/**
 * `pnpm version patch/minor/major` to update version in footer
 */
export function Footer() {
    const version = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0';
    const year = new Date().getFullYear();

    return (
        <footer className="sticky bottom-0 z-50 w-full border-t border-border bg-background/80 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-6 py-3 text-center text-xs text-muted-foreground">
                © {year} zawosite - żadne prawa nie są zastrzeżone (v{version})
            </div>
        </footer>
    );
}
