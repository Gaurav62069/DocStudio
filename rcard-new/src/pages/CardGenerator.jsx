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
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [palette, setPalette] = useState(PALETTES[0]);
  const [printMode, setPrintMode] = useState("");

  // ── Print effects ──
  useEffect(() => {
    if (printMode === "") return;
    const t = setTimeout(() => window.print(), 300);
    return () => clearTimeout(t);
  }, [printMode]);

  useEffect(() => {
    const reset = () => setPrintMode("");
    window.addEventListener("afterprint", reset);
    return () => window.removeEventListener("afterprint", reset);
  }, []);

  return (
    <>
      <PrintStyles cardBg={palette.cardBg} />

      <div className="min-h-screen flex font-sans bg-[#EEF3FB]">
        {/* ── Sidebar Form ── */}
        <SidebarForm
          formData={formData}
          setFormData={setFormData}
          onPrintFront={() => setPrintMode("front")}
          onPrintBack={() => setPrintMode("back")}
        />

        {/* ── Live Preview ── */}
        <main
          className="flex-1 flex flex-col print-area"
          style={{ background: "#EAF0FB" }}
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
            <div className="flex items-center gap-2.5">
              <span
                className="px-2.5 py-1 rounded-md text-[10px] font-bold text-[#4A6FA5]"
                style={{ background: "#EEF2FA" }}
              >
                A4 Scale
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {formData.rcNumber || "—"}
              </span>
            </div>
          </div>

          {/* Cards + Palette Panel */}
          <div className="flex-1 overflow-y-auto flex py-10 px-4 gap-4">
            {/* Cards */}
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

            {/* Palette Panel */}
            <PalettePanel palette={palette} setPalette={setPalette} />
          </div>
        </main>
      </div>
    </>
  );
}
