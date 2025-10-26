import { useState } from "react";
import { Menu } from "lucide-react";

type ActionKey = "checkin" | "journal" | "gratitude" | "progress";

export default function ActionsMenu({ onSelect }: { onSelect?: (k: ActionKey) => void }) {
  const [open, setOpen] = useState(false);

  const choose = (k: ActionKey) => {
    onSelect?.(k);
    window.dispatchEvent(new CustomEvent("ba:action", { detail: k }));
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        aria-label="Open menu"
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-10 inline-flex items-center justify-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-2 shadow-[var(--shadow)]"
        >
          {(
            [
              { id: "checkin", label: "Check-in" },
              { id: "journal", label: "Journal" },
              { id: "gratitude", label: "Gratitude" },
              { id: "progress", label: "Progress" },
            ] as { id: ActionKey; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => choose(item.id)}
              className="w-full text-left rounded-full px-3 py-2 text-sm hover:bg-[var(--surface)] min-h-[44px]"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


