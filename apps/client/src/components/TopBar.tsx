import ActionsMenu from "./ActionsMenu";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-screen-sm items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-base font-semibold">Balance Agent</h1>
          <p className="text-xs text-[var(--muted)]">Your mindful companion</p>
        </div>
        <ActionsMenu />
      </div>
    </header>
  );
}


