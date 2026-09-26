'use client';

import { useEffect, useState } from 'react';
import { TierlistEditor, type SaveStatus } from '@/components/tierlist/TierlistEditor';
import { TierlistReadonly } from '@/components/tierlist/TierlistReadonly';
import { defaultEntries } from '@/components/tierlist/constants';

interface User {
  id: number;
  username: string;
  globalName?: string;
  discordId: string;
  avatar?: string;
  role: string;
}

interface TierlistData {
  id: number;
  userId: number;
  entries: unknown;
  updatedAt: string;
  user: User;
}

interface TierlistPageProps {
  me: User | null;
  myTierlist: TierlistData | null;
  otherTierlists: TierlistData[];
}

function UserAvatar({ user, size = 32 }: { user: User; size?: number }) {
  const src = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={user.username} width={size} height={size} className="rounded-full" />;
}

function timeAgo(iso: string) {
  const time = new Date(iso).getTime();
  if (isNaN(time)) return 'niedawno';
  const diff = Date.now() - time;
  const mins = Math.floor(diff / 60000);
  if (mins < 2)   return 'przed chwilą';
  if (mins < 60)  return `${mins} min. temu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs} godz. temu`;
  const days = Math.floor(hrs / 24);
  return `${days} dni temu`;
}

const statusText: Record<SaveStatus, string> = {
  idle:    '',
  pending: 'Niezapisane zmiany',
  saving:  'Zapisywanie...',
  saved:   'Zapisano',
  error:   'Błąd zapisu',
};

const CAN_EDIT_ROLES = ['USER', 'ADMIN'];

export function TierlistPage({
  me: initialMe,
  myTierlist: initialMyTierlist,
  otherTierlists: initialOtherTierlists,
}: TierlistPageProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(initialMe);
  const [myList, setMyList] = useState<TierlistData | null>(initialMyTierlist);
  const [otherList, setOtherList] = useState<TierlistData[]>(initialOtherTierlists);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Fallback / sync po stronie klienta:
  // Jeśli SSR nie miał dostępu do ciasteczka sesji (np. w konfiguracji Docker lub między domenami),
  // przeglądarka pobiera dane bezpośrednio z API z credentials: 'include'.
  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) return;

    fetch(`${backendUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        query: `
          query SyncTierlistClient {
            me { id username globalName discordId avatar role }
            allTierlists {
              id userId entries updatedAt
              user { id username globalName discordId avatar role }
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.data?.me) {
          const clientMe: User = json.data.me;
          setCurrentUser(clientMe);

          const clientAll: TierlistData[] = (json.data.allTierlists ?? []).map((t: any) => ({
            ...t,
            entries: typeof t.entries === 'string' ? JSON.parse(t.entries) : t.entries,
          }));

          const clientMy = clientAll.find((t) => t.userId === clientMe.id) ?? null;
          const clientOthers = clientAll.filter((t) => t.userId !== clientMe.id);

          setMyList(clientMy);
          setOtherList(clientOthers);
        } else if (json.data?.allTierlists && otherList.length === 0) {
          const clientAll: TierlistData[] = json.data.allTierlists.map((t: any) => ({
            ...t,
            entries: typeof t.entries === 'string' ? JSON.parse(t.entries) : t.entries,
          }));
          setOtherList(clientAll);
        }
      })
      .catch((err) => {
        console.error('[Tierlist Client Sync] Error:', err);
      });
  }, []);

  const canEdit = currentUser && CAN_EDIT_ROLES.includes(currentUser.role);

  return (
    <div className="container mx-auto max-w-screen-xl px-6 py-10 flex flex-col gap-10">

      {/* ── Własna tierlista ─────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          {currentUser && <UserAvatar user={currentUser} size={36} />}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {currentUser ? (currentUser.globalName ?? currentUser.username) : 'Twoja tierlista'}
                <span className="ml-2 text-xs font-normal text-primary">[Ty]</span>
              </h2>
              {saveStatus !== 'idle' && (
                <span
                  className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium transition-all ${
                    saveStatus === 'saved'
                      ? 'bg-green-500/15 text-green-400'
                      : saveStatus === 'error'
                      ? 'bg-red-500/15 text-red-400'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {statusText[saveStatus]}
                </span>
              )}
            </div>
            {myList && (
              <p className="text-xs text-muted-foreground">Zaktualizowano {timeAgo(myList.updatedAt)}</p>
            )}
          </div>
        </div>

        {canEdit ? (
          <TierlistEditor
            initialEntries={myList?.entries ?? defaultEntries()}
            onStatusChange={setSaveStatus}
          />
        ) : currentUser ? (
          <div className="rounded-lg border border-white/10 bg-muted/30 px-6 py-8 text-center text-sm text-muted-foreground">
            Twoje konto ma rolę <strong>{currentUser.role}</strong>. Skontaktuj się z adminem, żeby uzyskać dostęp do edycji tierlisty.
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-muted/30 px-6 py-8 text-center text-sm text-muted-foreground">
            Zaloguj się przez Discord, żeby tworzyć własną tierlistę.
          </div>
        )}
      </section>

      {/* ── Wall — inne tierlisty ─────────────────────────────── */}
      {otherList.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-semibold text-muted-foreground">
            Tierlisty społeczności
          </h2>
          <div className="flex flex-col gap-8">
            {otherList.map((t) => (
              <div key={t.id}>
                <div className="mb-2 flex items-center gap-2.5">
                  <UserAvatar user={t.user} size={28} />
                  <span className="text-sm font-medium">
                    {t.user.globalName ?? t.user.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • zaktualizowano {timeAgo(t.updatedAt)}
                  </span>
                </div>
                <TierlistReadonly entries={t.entries as any} heroSize={44} />
              </div>
            ))}
          </div>
        </section>
      )}

      {otherList.length === 0 && !canEdit && (
        <p className="text-center text-sm text-muted-foreground">
          Nikt jeszcze nie stworzył tierlisty.
        </p>
      )}
    </div>
  );
}
