// src/pages/CardGenerator.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PALETTES } from "../constants/palettes";
import PrintStyles from "../components/PrintStyles";
import SidebarForm from "../components/SidebarForm";
import PalettePanel from "../components/PalettePanel";
import CardFront from "../components/card/CardFront";
import CardBack from "../components/card/CardBack";

const INITIAL_FORM = {
  rcNumber: "",
  headOfFamilyEng: "",
  headOfFamily: "",
  gender: "",
  fatherName: "",
  age: "",
  village: "",
  district: "",
  dealerName: "",
  dealerAddress: "",
  relation: "",
  block: "",
  membersCount: 1,
  additionalMembers: [],
};

export default function CardGenerator() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [palette, setPalette] = useState(PALETTES[0]);
  const [printMode, setPrintMode] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ── Print effects — exactly same as original ──
  useEffect(() => {
    if (printMode !== "") {
      const t = setTimeout(() => window.print(), 300);
      return () => clearTimeout(t);
    }
  }, [printMode]);

  useEffect(() => {
    const fn = () => setPrintMode("");
    window.addEventListener("afterprint", fn);
    return () => window.removeEventListener("afterprint", fn);
  }, []);

  // ── Logout ──
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* PrintStyles ko cardBg pass karo — exactly original jaisa inject hoga */}
      <PrintStyles cardBg={palette.cardBg} />

      <div className="min-h-screen flex font-sans bg-[#EEF3FB]">
        {/* ── Sidebar Form ── */}
        <SidebarForm
          formData={formData}
          setFormData={setFormData}
          onPrintFront={() => setPrintMode("front")}
          onPrintBack={() => setPrintMode("back")}
        />

        {/* ── MAIN — LIVE PREVIEW ──
            CRITICAL: className="print-area colored-bg" + style "--print-card-bg" 
            Exactly same as original main tag
        ── */}
        <main
          className="flex-1 flex flex-col print-area colored-bg"
          style={{
            background: "#EAF0FB",
            "--print-card-bg": palette.cardBg,
          }}
        >
          {/* Top Bar */}
          <div
            className="hide-on-print sticky top-0 z-10 flex items-center justify-between px-6 py-3"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderBottom: "1px solid #D4E0F5",
              boxShadow: "0 1px 10px rgba(26,86,168,0.07)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.4)]" />
              <span className="text-sm font-bold text-gray-600 tracking-tight">
                Live Preview
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="px-2.5 py-1 rounded-md text-[10px] font-bold text-[#4A6FA5]"
                style={{ background: "#EEF2FA" }}
              >
                A4 Scale
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {formData.rcNumber || "—"}
              </span>

              <span className="w-px h-4 bg-[#D4E0F5]" />

              {user?.picture && (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-7 h-7 rounded-full border-2 border-[#D4E0F5] object-cover"
                />
              )}
              <span className="text-xs font-semibold text-gray-600 hidden md:block max-w-[120px] truncate">
                {user?.name || "User"}
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 active:scale-95 transition-all duration-150"
              >
                <span>⏻</span>
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>

          {/* Preview Canvas + Right Palette Panel */}
          <div className="flex-1 overflow-y-auto flex py-10 px-4 gap-4 relative">
            {/* Cards — center — exactly same as original */}
            <div className="flex-1 flex justify-center overflow-hidden pb-10">
              <div className="origin-top scale-[0.50] md:scale-[0.58] lg:scale-[0.68] xl:scale-[0.76] 2xl:scale-[0.88] print:scale-100 print:transform-none transition-transform duration-300">
                <div
                  className={`cards-wrapper flex flex-col gap-6 w-[800px] ${
                    printMode === "front"
                      ? "print-front-only"
                      : printMode === "back"
                        ? "print-back-only"
                        : ""
                  }`}
                >
                  <CardFront details={formData} cardBg={palette.cardBg} />
                  <CardBack details={formData} cardBg={palette.cardBg} />
                </div>
              </div>
            </div>

            {/* Floating Right Palette Panel */}
            <PalettePanel palette={palette} setPalette={setPalette} />
          </div>
        </main>
      </div>
    </>
  );
}
