// CardGenerator.jsx — Government Portal Style v3
// Changes: wider sidebar (420px), color palette in header, smoother UI polish
import { useState, useEffect } from "react";
import axios from "axios";
import CardFront from "../components/card/CardFront";
import CardBack from "../components/card/CardBack";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";

// ── Color Palettes (4 options) ──────────────────────────────────────────────
const PALETTES = [
  {
    id: "white",
    label: "White",
    swatch: "#FFFFFF",
    swatchBorder: "#CBD5E1",
    cardBg: "#FFFFFF",
  },
  {
    id: "yellow",
    label: "Yellow",
    swatch: "#FFE500",
    swatchBorder: "#D4C000",
    cardBg: "yellow",
  },
  {
    id: "greenyellow",
    label: "Green",
    swatch: "#ADFF2F",
    swatchBorder: "#7DC000",
    cardBg: "greenyellow",
  },
  {
    id: "pink",
    label: "Pink",
    swatch: "rgba(253,48,238,0.71)",
    swatchBorder: "rgba(200,20,190,0.9)",
    cardBg: "rgba(253,48,238,0.71)",
  },
];

// ── Shared input classes ────────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-[9px] text-sm rounded-lg border border-[#D0DCF0] bg-white text-gray-800 " +
  "focus:outline-none focus:ring-2 focus:ring-[#1A56A8]/30 focus:border-[#1A56A8] " +
  "placeholder:text-gray-300 transition-all duration-200 shadow-sm " +
  "hover:border-[#A8C0E8] hover:shadow-md";

const selectCls =
  "w-full px-3 py-[9px] text-sm rounded-lg border border-[#D0DCF0] bg-white text-gray-800 " +
  "focus:outline-none focus:ring-2 focus:ring-[#1A56A8]/30 focus:border-[#1A56A8] " +
  "transition-all duration-200 appearance-none shadow-sm cursor-pointer " +
  "hover:border-[#A8C0E8] hover:shadow-md";

// ── Small reusable bits ─────────────────────────────────────────────────────
const FieldLabel = ({ children }) => (
  <label className="block text-[10px] font-bold text-[#4A6FA5] uppercase tracking-[0.14em] mb-1.5 select-none">
    {children}
  </label>
);

const SectionHeading = ({ children }) => (
  <div className="flex items-center gap-2.5 mb-3 mt-2">
    <span className="inline-block w-6 h-[2px] rounded-full bg-gradient-to-r from-[#1A56A8] to-[#4A8FFF]" />
    <p className="text-[9.5px] font-extrabold text-[#1A56A8] uppercase tracking-[0.18em] select-none">
      {children}
    </p>
    <span className="flex-1 h-px bg-[#EEF2FA]" />
  </div>
);

const SelectWrapper = ({ children }) => (
  <div className="relative">
    {children}
    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4A6FA5] text-[11px]">
      ▾
    </span>
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
export default function CardGenerator() {
  const [formData, setFormData] = useState({
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
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [printMode, setPrintMode] = useState("");
  const [palette, setPalette] = useState(PALETTES[0]);

  // ── Print effects ──────────────────────────────────────────────────────
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

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });

  const handleMemberChange = (i, field, val) => {
    const m = [...formData.additionalMembers];
    m[i][field] = field === "name" ? val : val.toUpperCase();
    setFormData((p) => ({ ...p, additionalMembers: m }));
  };

  const handleAddMembers = () => {
    const count = parseInt(formData.membersCount) || 1;
    const newMembers =
      count > 1
        ? Array.from({ length: count - 1 }, () => ({
            name: "",
            age: "",
            gender: "",
            relation: "",
          }))
        : [];
    setFormData((p) => ({ ...p, additionalMembers: newMembers }));
  };

  const handleClearMembers = () =>
    setFormData((p) => ({ ...p, membersCount: 1, additionalMembers: [] }));

  const handleScrape = async () => {
    if (!formData.rcNumber)
      return setMessage({ text: "Pehle Card Number daalo!", type: "error" });
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const r = await axios.post("http://localhost:5000/api/data/scrape", {
        rcNumber: formData.rcNumber,
      });
      setFormData((p) => ({ ...p, ...r.data }));
      setMessage({ text: "Data Fetched Successfully!", type: "success" });
    } catch {
      setMessage({ text: "Scraping fail ho gayi.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async () => {
    if (!pdfFile)
      return setMessage({ text: "Pehle PDF select karo!", type: "error" });
    setLoading(true);
    setMessage({ text: "", type: "" });
    const fd = new FormData();
    fd.append("pdfFile", pdfFile);
    try {
      const r = await axios.post("http://localhost:5000/api/data/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((p) => ({ ...p, ...r.data }));
      setMessage({
        text: "PDF Extract & Auto-fill Successful!",
        type: "success",
      });
    } catch {
      setMessage({ text: "PDF extraction fail ho gayi.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── PRINT CSS ─────────────────────────────────────────────────── */}
      <style>{`
        @page { size: A4 portrait; margin: 0; }
        @media print {
          html, body {
            width: 100%; height: 100%;
            margin: 0; padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .hide-on-print { display: none !important; }

          .print-area {
            position: fixed;
            left: 0; top: 0;
            width: 100vw; height: 100vh;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            align-items: center !important;
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Full A4 page ko card ka color de do */
          .print-area.colored-bg {
            background-color: var(--print-card-bg) !important;
            height: 54% !important;
          }

          .cards-wrapper {
            transform: scale(0.91) !important;
            transform-origin: top center !important;
            width: 800px !important;
            
          }
          .react-transliterate-container { display: inline; }
          .print-front-only #cardback-print  { display: none !important; }
          .print-back-only  #cardfront-print { display: none !important; }
        }
      `}</style>

      {/* ── ROOT ──────────────────────────────────────────────────────── */}
      <div className="min-h-screen flex font-sans bg-[#EEF3FB]">
        {/* ══════════════════════════════════════════════════
            SIDEBAR — 420px wide
        ══════════════════════════════════════════════════ */}
        <aside
          className="hide-on-print flex flex-col h-screen sticky top-0 bg-white border-r border-[#D4E0F5]"
          style={{
            width: "420px",
            minWidth: "380px",
            boxShadow: "6px 0 32px rgba(26,86,168,0.09)",
          }}
        >
          {/* ── Header ────────────────────────────────────────────────── */}
          <div
            className="flex-shrink-0 px-6 py-4"
            style={{
              background: "linear-gradient(135deg, #1A56A8 0%, #1e6fc7 100%)",
            }}
          >
            {/* Brand row */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-xl shadow-inner">
                🏛
              </div>
              <div>
                <p className="text-white/70 text-[10px] uppercase tracking-[0.2em]">
                  भारत सरकार
                </p>
                <h1 className="text-white font-extrabold text-base leading-tight">
                  राशन कार्ड पोर्टल
                </h1>
              </div>
            </div>
          </div>

          {/* ── Status message ────────────────────────────────────────── */}
          {message.text && (
            <div
              className={`mx-5 mt-3 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 flex-shrink-0 border ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              <span className="text-sm">
                {message.type === "success" ? "✓" : "✕"}
              </span>
              {message.text}
            </div>
          )}

          {/* ── Data Import ───────────────────────────────────────────── */}
          <div className="px-5 pt-4 pb-4 border-b border-[#EEF2FA] flex-shrink-0 space-y-3">
            <p className="text-[9.5px] font-extrabold text-[#4A6FA5] uppercase tracking-[0.16em] mb-2">
              डेटा आयात करें
            </p>

            {/* PDF Upload */}
            <div>
              <FieldLabel>PDF अपलोड</FieldLabel>
              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer group">
                  <div className="px-3 py-[9px] text-xs rounded-lg border border-dashed border-[#A8C0E8] bg-[#F5F8FF] text-[#4A6FA5] group-hover:bg-[#EBF0FF] group-hover:border-[#1A56A8] transition-all duration-200 text-center truncate select-none">
                    {pdfFile ? `📄 ${pdfFile.name}` : "📄 फ़ाइल चुनें..."}
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                  />
                </label>
                <button
                  onClick={handlePdfUpload}
                  disabled={loading}
                  className="px-4 py-[9px] text-xs rounded-lg bg-[#1A56A8] text-white font-bold hover:bg-[#154496] active:scale-95 transition-all duration-150 shadow-sm disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? "..." : "Extract"}
                </button>
              </div>
            </div>

            {/* Online Fetch */}
            <div>
              <FieldLabel>कार्ड नंबर से Fetch</FieldLabel>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="rcNumber"
                  value={formData.rcNumber}
                  onChange={handleChange}
                  placeholder="Card Number..."
                  className={`${inputCls} flex-1`}
                />
                <button
                  onClick={handleScrape}
                  disabled={loading}
                  className="px-4 py-[9px] text-xs rounded-lg border-2 border-[#1A56A8] text-[#1A56A8] font-bold hover:bg-[#EBF0FF] active:scale-95 transition-all duration-150 disabled:opacity-50 whitespace-nowrap"
                >
                  Fetch
                </button>
              </div>
            </div>
          </div>

          {/* ── Scrollable Form ───────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {/* § कार्डधारक */}
            <div>
              <SectionHeading>कार्डधारक की जानकारी</SectionHeading>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Card Number</FieldLabel>
                    <input
                      type="number"
                      name="rcNumber"
                      value={formData.rcNumber}
                      onChange={handleChange}
                      placeholder="202800815415"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel>नाम (अंग्रेज़ी)</FieldLabel>
                    <input
                      type="text"
                      name="headOfFamilyEng"
                      value={formData.headOfFamilyEng}
                      onChange={handleChange}
                      placeholder="RAKHI DEVI"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <FieldLabel>नाम (हिंदी)</FieldLabel>
                    <ReactTransliterate
                      value={formData.headOfFamily}
                      onChangeText={(t) =>
                        setFormData((p) => ({ ...p, headOfFamily: t }))
                      }
                      lang="hi"
                      placeholder="राखी देवी"
                      containerClassName="w-full"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel>लिंग</FieldLabel>
                    <SelectWrapper>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={selectCls}
                      >
                        <option value="">चुनें</option>
                        <option value="म.">म.</option>
                        <option value="पु.">पु.</option>
                      </select>
                    </SelectWrapper>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <FieldLabel>उम्र</FieldLabel>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="42"
                      min={1}
                      max={120}
                      className={inputCls}
                    />
                  </div>
                  <div className="col-span-2">
                    <FieldLabel>संबंध</FieldLabel>
                    <SelectWrapper>
                      <select
                        name="relation"
                        value={formData.relation}
                        onChange={handleChange}
                        className={selectCls}
                      >
                        <option value="">चुनें</option>
                        {[
                          "मुखिया",
                          "स्वयं",
                          "पति",
                          "बेटा",
                          "बेटी",
                          "सास",
                          "ससुर",
                          "पोता",
                          "पोती",
                          "बहू",
                          "माँ",
                          "बहन",
                          "अन्य",
                        ].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </SelectWrapper>
                  </div>
                </div>

                <div>
                  <FieldLabel>पिता / पति का नाम</FieldLabel>
                  <ReactTransliterate
                    value={formData.fatherName}
                    onChangeText={(t) =>
                      setFormData((p) => ({ ...p, fatherName: t }))
                    }
                    lang="hi"
                    placeholder="अनिल राम"
                    containerClassName="w-full"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* § पता */}
            <div>
              <SectionHeading>पता</SectionHeading>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>ग्राम / टोला</FieldLabel>
                    <ReactTransliterate
                      value={formData.village}
                      onChangeText={(t) =>
                        setFormData((p) => ({ ...p, village: t }))
                      }
                      lang="hi"
                      placeholder="बेताटाड़"
                      containerClassName="w-full"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel>प्रखंड</FieldLabel>
                    <ReactTransliterate
                      value={formData.block}
                      onChangeText={(t) =>
                        setFormData((p) => ({ ...p, block: t }))
                      }
                      lang="hi"
                      placeholder="बेताटाड़"
                      containerClassName="w-full"
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>जिला</FieldLabel>
                  <ReactTransliterate
                    value={formData.district}
                    onChangeText={(t) =>
                      setFormData((p) => ({ ...p, district: t }))
                    }
                    lang="hi"
                    placeholder="गिरिडीह"
                    containerClassName="w-full"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* § वितरक */}
            <div>
              <SectionHeading>वितरक / डीलर</SectionHeading>
              <div className="space-y-3">
                <div>
                  <FieldLabel>वितरक का नाम</FieldLabel>
                  <ReactTransliterate
                    value={formData.dealerName}
                    onChangeText={(t) =>
                      setFormData((p) => ({ ...p, dealerName: t }))
                    }
                    lang="hi"
                    placeholder="गोपाल विश्वकर्मा"
                    containerClassName="w-full"
                    className={inputCls}
                  />
                </div>
                <div>
                  <FieldLabel>वितरक का पता</FieldLabel>
                  <ReactTransliterate
                    value={formData.dealerAddress}
                    onChangeText={(t) =>
                      setFormData((p) => ({ ...p, dealerAddress: t }))
                    }
                    lang="hi"
                    placeholder="बेताटाड़"
                    containerClassName="w-full"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* § परिवार के सदस्य */}
            <div>
              <SectionHeading>परिवार के सदस्य</SectionHeading>
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  name="membersCount"
                  value={formData.membersCount}
                  onChange={handleChange}
                  placeholder="कुल सदस्य"
                  min={1}
                  className={`${inputCls} flex-1`}
                />
                <button
                  onClick={handleAddMembers}
                  className="px-4 py-[9px] text-xs rounded-lg bg-[#1A56A8] text-white font-bold hover:bg-[#154496] active:scale-95 transition-all shadow-sm"
                >
                  Add
                </button>
                <button
                  onClick={handleClearMembers}
                  className="px-4 py-[9px] text-xs rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 active:scale-95 transition-all shadow-sm"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-2">
                {formData.additionalMembers.map((member, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-[#D4E0F5] bg-[#F6F9FF] space-y-2.5 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <p className="text-[9px] font-extrabold text-[#4A6FA5] uppercase tracking-wider">
                      सदस्य {i + 2}
                    </p>
                    <ReactTransliterate
                      value={member.name}
                      onChangeText={(t) => handleMemberChange(i, "name", t)}
                      lang="hi"
                      placeholder="नाम"
                      containerClassName="w-full"
                      className={inputCls}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        placeholder="उम्र"
                        value={member.age}
                        onChange={(e) =>
                          handleMemberChange(i, "age", e.target.value)
                        }
                        className={inputCls}
                      />
                      <SelectWrapper>
                        <select
                          value={member.gender}
                          onChange={(e) =>
                            handleMemberChange(i, "gender", e.target.value)
                          }
                          className={selectCls}
                        >
                          <option value="">लिंग</option>
                          <option value="म.">म.</option>
                          <option value="पु.">पु.</option>
                        </select>
                      </SelectWrapper>
                      <SelectWrapper>
                        <select
                          value={member.relation}
                          onChange={(e) =>
                            handleMemberChange(i, "relation", e.target.value)
                          }
                          className={selectCls}
                        >
                          <option value="">संबंध</option>
                          {["पति", "बेटा", "बेटी", "माँ", "अन्य"].map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </SelectWrapper>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sticky Print Buttons ──────────────────────────────────── */}
          <div
            className="flex-shrink-0 px-5 py-4 bg-white flex gap-3"
            style={{
              borderTop: "1px solid #D4E0F5",
              boxShadow: "0 -4px 16px rgba(26,86,168,0.06)",
            }}
          >
            <button
              onClick={() => setPrintMode("front")}
              className="flex-1 py-3 rounded-xl text-white text-xs font-extrabold tracking-wider uppercase hover:opacity-90 active:scale-95 transition-all duration-150"
              style={{
                background: "linear-gradient(135deg, #1A56A8 0%, #2563EB 100%)",
                boxShadow: "0 4px 14px rgba(26,86,168,0.30)",
              }}
            >
              🖨 Print Front
            </button>
            <button
              onClick={() => setPrintMode("back")}
              className="flex-1 py-3 rounded-xl text-[#1A56A8] text-xs font-extrabold tracking-wider uppercase border-2 border-[#1A56A8] hover:bg-[#EBF0FF] active:scale-95 transition-all duration-150"
            >
              🖨 Print Back
            </button>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════
            MAIN — LIVE PREVIEW
        ══════════════════════════════════════════════════ */}
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

          {/* Preview Canvas + Right Palette Panel */}
          <div className="flex-1 overflow-y-auto flex py-10 px-4 gap-4 relative">
            {/* Cards — center */}
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

            {/* ── Floating Right Palette Panel ── */}
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
              {/* Panel title */}
              <p
                className="text-[8px] font-extrabold text-[#4A6FA5] uppercase tracking-[0.18em] mb-1 select-none"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  letterSpacing: "0.2em",
                }}
              >
                Color
              </p>

              {/* Divider */}
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
                  {/* Active checkmark */}
                  {palette.id === p.id && (
                    <span
                      className="absolute inset-0 flex items-center justify-center text-[13px] font-black"
                      style={{
                        color:
                          p.id === "white" ? "#1A56A8" : "rgba(0,0,0,0.55)",
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
          </div>
        </main>
      </div>
    </>
  );
}
