export default function UserProfilePage({ params }: { params: { username: string } }) {
    return (
        <div className="container mx-auto max-w-7xl px-6 py-12">
            <h1 className="text-3xl font-bold">@{params.username}</h1>
            <p className="mt-2 text-muted-foreground">profil użytkownika. coming soon.</p>
        </div>
    );
}
