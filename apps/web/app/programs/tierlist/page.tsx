import { cookies } from 'next/headers';
import { TierlistPage } from '@/components/tierlist/TierlistPage';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

async function gql(query: string, authCookie?: string) {
  try {
    const res = await fetch(`${BACKEND}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authCookie ? { Cookie: `token=${authCookie}` } : {}),
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });
    return res.json();
  } catch {
    return { data: null };
  }
}

export default async function TierlistRoute() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const [allRes, meRes] = await Promise.all([
    gql(`query {
      allTierlists {
        id userId entries updatedAt
        user { id username globalName discordId avatar role }
      }
    }`),
    gql(`query { me { id username globalName discordId avatar role } }`, token),
  ]);

  const me   = meRes.data?.me ?? null;
  const all  = (allRes.data?.allTierlists ?? []) as any[];

  // Oddziel własną tierlistę od pozostałych
  const myTierlist     = me ? (all.find((t: any) => t.userId === me.id) ?? null) : null;
  const otherTierlists = me ? all.filter((t: any) => t.userId !== me.id) : all;

  // Parsuj entries (string JSON z backendu)
  const parse = (t: any) => ({
    ...t,
    entries: typeof t.entries === 'string' ? JSON.parse(t.entries) : t.entries,
  });

  return (
    <TierlistPage
      me={me}
      myTierlist={myTierlist ? parse(myTierlist) : null}
      otherTierlists={otherTierlists.map(parse)}
    />
  );
}
