// src/components/card/PalettePanel.jsx
import { PALETTES } from "../constants/palettes";

export default function PalettePanel({ palette, setPalette }) {
  return (
    <div
      className="hide-on-print flex-shrink-0 self-start sticky top-6 flex flex-col items-center gap-1 py-3 px-2.5 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.80)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid #D4E0F5",
        boxShadow: "0 4px 24px rgba(26,86,168,0.12)",
        minWidth: "52px",
      }}
    >
      {/* Title */}
      <p
        className="text-[8px] font-extrabold text-[#4A6FA5] uppercase tracking-[0.18em] mb-1 select-none"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        Color
      </p>

      <span className="w-6 h-px bg-[#D4E0F5] mb-1" />

      {/* Swatches */}
      {PALETTES.map((p) => (
        <button
          key={p.id}
          onClick={() => setPalette(p)}
          title={p.label}
          className="focus:outline-none transition-all duration-200 relative group"
          style={{
            width: palette.id === p.id ? "36px" : "28px",
            height: palette.id === p.id ? "36px" : "28px",
            borderRadius: "50%",
            background: p.swatch,
            border:
              palette.id === p.id
                ? "3px solid #1A56A8"
                : `2px solid ${p.swatchBorder}`,
            boxShadow:
              palette.id === p.id
                ? "0 0 0 3px rgba(26,86,168,0.18), 0 4px 12px rgba(0,0,0,0.18)"
                : "0 2px 6px rgba(0,0,0,0.14)",
            transform: palette.id === p.id ? "scale(1.08)" : "scale(1)",
            marginBottom: "6px",
            cursor: "pointer",
          }}
        >
          {palette.id === p.id && (
            <span
              className="absolute inset-0 flex items-center justify-center text-[13px] font-black"
              style={{
                color: p.id === "white" ? "#1A56A8" : "rgba(0,0,0,0.55)",
              }}
            >
              ✓
            </span>
          )}
          {/* Tooltip */}
          <span
            className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150"
            style={{
              background: "#1A56A8",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(26,86,168,0.25)",
            }}
          >
            {p.label}
          </span>
        </button>
      ))}
    </div>
  );
}
