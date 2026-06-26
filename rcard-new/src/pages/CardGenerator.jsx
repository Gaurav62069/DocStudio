// CardGenerator.jsx — Government Portal Style Redesign
import { useState, useEffect } from "react";
import axios from "axios";
import CardFront from "../components/card/CardFront";
import CardBack from "../components/card/CardBack";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";

// ── Reusable field wrapper ──────────────────────────────────────────────────
const FieldLabel = ({ children }) => (
  <label className="block text-[10px] font-semibold text-[#4A6FA5] uppercase tracking-widest mb-1">
    {children}
  </label>
);

const inputCls =
  "w-full px-3 py-2 text-sm rounded-md border border-[#D0DCF0] bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A56A8] focus:border-transparent placeholder:text-gray-300 transition";

const selectCls =
  "w-full px-3 py-2 text-sm rounded-md border border-[#D0DCF0] bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A56A8] focus:border-transparent transition appearance-none";

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

  useEffect(() => {
    if (printMode !== "") {
      const timer = setTimeout(() => window.print(), 300);
      return () => clearTimeout(timer);
    }
  }, [printMode]);

  useEffect(() => {
    const handleAfterPrint = () => setPrintMode("");
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  const handlePrintFront = () => setPrintMode("front");
  const handlePrintBack = () => setPrintMode("back");

  const handleAddMembers = () => {
    const count = parseInt(formData.membersCount) || 1;
    if (count > 1) {
      const newMembers = Array.from({ length: count - 1 }, () => ({
        name: "",
        age: "",
        gender: "",
        relation: "",
      }));
      setFormData((prev) => ({ ...prev, additionalMembers: newMembers }));
    } else {
      setFormData((prev) => ({ ...prev, additionalMembers: [] }));
    }
  };

  const handleClearMembers = () => {
    setFormData((prev) => ({
      ...prev,
      membersCount: 1,
      additionalMembers: [],
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.additionalMembers];
    updatedMembers[index][field] =
      field === "name" ? value : value.toUpperCase();
    setFormData((prev) => ({ ...prev, additionalMembers: updatedMembers }));
  };

  const handleScrape = async () => {
    if (!formData.rcNumber)
      return setMessage({
        text: "Pehle Ration Card Number daalo!",
        type: "error",
      });
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const response = await axios.post(
        "http://localhost:5000/api/data/scrape",
        { rcNumber: formData.rcNumber },
      );
      setFormData((prev) => ({ ...prev, ...response.data }));
      setMessage({ text: "Data Scraped Successfully!", type: "success" });
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
    const uploadData = new FormData();
    uploadData.append("pdfFile", pdfFile);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/data/upload",
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setFormData((prev) => ({ ...prev, ...response.data }));
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

  return (
    <>
      {/* ── PRINT CSS ─────────────────────────────────────────────── */}
      <style>{`
        @page { size: A4 portrait; margin: 0; }
        @media print {
          html, body { width: 100%; height: 100%; margin: 0; padding: 0; background: white; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .hide-on-print { display: none !important; }
          .print-area {
            position: absolute; left: 0; top: 0; width: 100%;
            display: flex !important; justify-content: center !important;
            padding-top: 25px !important;
          }
          .cards-wrapper {
            transform: scale(0.92) !important;
            transform-origin: top center !important;
            width: 800px !important; margin: 0 auto !important;
          }
          .react-transliterate-container { display: inline; }
          .print-front-only #cardback-print { display: none !important; }
          .print-back-only #cardfront-print { display: none !important; }
        }
      `}</style>

      {/* ── ROOT LAYOUT ───────────────────────────────────────────── */}
      <div className="min-h-screen flex font-sans bg-[#F0F4FB]">
        {/* ══════════════════════════════════════════════════════════
            LEFT SIDEBAR — FORM
        ══════════════════════════════════════════════════════════ */}
        <aside className="hide-on-print w-[340px] min-w-[300px] max-w-[360px] h-screen sticky top-0 bg-white border-r border-[#D0DCF0] flex flex-col shadow-[4px_0_24px_rgba(26,86,168,0.07)]">
          {/* Sidebar Header */}
          <div className="bg-[#1A56A8] px-5 py-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Ashoka Chakra placeholder */}
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold border border-white/30">
                🏛
              </div>
              <div>
                <p className="text-white text-xs opacity-75 tracking-widest uppercase">
                  भारत सरकार
                </p>
                <h1 className="text-white font-bold text-sm leading-tight">
                  राशन कार्ड पोर्टल
                </h1>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {message.text && (
            <div
              className={`mx-4 mt-3 px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-2 flex-shrink-0 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              <span>{message.type === "success" ? "✓" : "✕"}</span>
              {message.text}
            </div>
          )}

          {/* ── Data Import Controls ── */}
          <div className="px-4 pt-4 pb-3 border-b border-[#EEF2FA] flex-shrink-0">
            <p className="text-[10px] font-bold text-[#4A6FA5] uppercase tracking-widest mb-3">
              डेटा आयात करें
            </p>

            {/* PDF Upload */}
            <div className="mb-3">
              <FieldLabel>PDF अपलोड</FieldLabel>
              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer">
                  <div className="px-3 py-2 text-xs rounded-md border border-dashed border-[#A8C0E8] bg-[#F5F8FF] text-[#4A6FA5] hover:bg-[#EBF0FF] transition text-center truncate">
                    {pdfFile ? pdfFile.name : "📄 फ़ाइल चुनें"}
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
                  className="px-3 py-2 text-xs rounded-md bg-[#1A56A8] text-white font-semibold hover:bg-[#154496] active:scale-95 transition disabled:opacity-50 whitespace-nowrap"
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
                  className={`${inputCls} flex-1 text-xs`}
                />
                <button
                  onClick={handleScrape}
                  disabled={loading}
                  className="px-3 py-2 text-xs rounded-md border border-[#1A56A8] text-[#1A56A8] font-semibold hover:bg-[#F0F6FF] active:scale-95 transition disabled:opacity-50 whitespace-nowrap"
                >
                  Fetch
                </button>
              </div>
            </div>
          </div>

          {/* ── Scrollable Form Fields ── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {/* Section: कार्डधारक की जानकारी */}
            <div>
              <p className="text-[9px] font-extrabold text-[#1A56A8] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                <span className="inline-block w-4 h-[2px] bg-[#1A56A8]"></span>
                कार्डधारक की जानकारी
              </p>

              <div className="space-y-2">
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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FieldLabel>नाम (हिंदी)</FieldLabel>
                    <ReactTransliterate
                      value={formData.headOfFamily}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, headOfFamily: text }))
                      }
                      lang="hi"
                      placeholder="राखी देवी"
                      containerClassName="w-full"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel>लिंग</FieldLabel>
                    <div className="relative">
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
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#4A6FA5] text-xs">
                        ▾
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
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
                  <div>
                    <FieldLabel>संबंध</FieldLabel>
                    <div className="relative">
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
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#4A6FA5] text-xs">
                        ▾
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <FieldLabel>पिता / पति का नाम</FieldLabel>
                  <ReactTransliterate
                    value={formData.fatherName}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, fatherName: text }))
                    }
                    lang="hi"
                    placeholder="अनिल राम"
                    containerClassName="w-full"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Section: पता */}
            <div>
              <p className="text-[9px] font-extrabold text-[#1A56A8] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                <span className="inline-block w-4 h-[2px] bg-[#1A56A8]"></span>
                पता
              </p>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FieldLabel>ग्राम / टोला</FieldLabel>
                    <ReactTransliterate
                      value={formData.village}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, village: text }))
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
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, block: text }))
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
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, district: text }))
                    }
                    lang="hi"
                    placeholder="गिरिडीह"
                    containerClassName="w-full"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Section: वितरक */}
            <div>
              <p className="text-[9px] font-extrabold text-[#1A56A8] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                <span className="inline-block w-4 h-[2px] bg-[#1A56A8]"></span>
                वितरक / डीलर
              </p>
              <div className="space-y-2">
                <div>
                  <FieldLabel>वितरक का नाम</FieldLabel>
                  <ReactTransliterate
                    value={formData.dealerName}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, dealerName: text }))
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
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, dealerAddress: text }))
                    }
                    lang="hi"
                    placeholder="बेताटाड़"
                    containerClassName="w-full"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Section: अतिरिक्त सदस्य */}
            <div>
              <p className="text-[9px] font-extrabold text-[#1A56A8] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                <span className="inline-block w-4 h-[2px] bg-[#1A56A8]"></span>
                परिवार के सदस्य
              </p>
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
                  className="px-3 py-2 text-xs rounded-md bg-[#1A56A8] text-white font-semibold hover:bg-[#154496] active:scale-95 transition"
                >
                  Add
                </button>
                <button
                  onClick={handleClearMembers}
                  className="px-3 py-2 text-xs rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 active:scale-95 transition"
                >
                  Clear
                </button>
              </div>

              {/* Member Cards */}
              {formData.additionalMembers.map((member, index) => (
                <div
                  key={index}
                  className="mb-2 p-3 rounded-lg border border-[#D0DCF0] bg-[#F8FAFF]"
                >
                  <p className="text-[9px] font-bold text-[#4A6FA5] mb-2 uppercase tracking-wider">
                    सदस्य {index + 2}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <ReactTransliterate
                        value={member.name}
                        onChangeText={(text) =>
                          handleMemberChange(index, "name", text)
                        }
                        lang="hi"
                        placeholder="नाम"
                        containerClassName="w-full"
                        className={inputCls}
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="उम्र"
                      value={member.age}
                      onChange={(e) =>
                        handleMemberChange(index, "age", e.target.value)
                      }
                      className={inputCls}
                    />
                    <div className="relative">
                      <select
                        value={member.gender}
                        onChange={(e) =>
                          handleMemberChange(index, "gender", e.target.value)
                        }
                        className={selectCls}
                      >
                        <option value="">लिंग</option>
                        <option value="म.">म.</option>
                        <option value="पु.">पु.</option>
                      </select>
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#4A6FA5] text-xs">
                        ▾
                      </span>
                    </div>
                    <div className="col-span-2 relative">
                      <select
                        value={member.relation}
                        onChange={(e) =>
                          handleMemberChange(index, "relation", e.target.value)
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
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#4A6FA5] text-xs">
                        ▾
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Print Buttons — Sticky Bottom ── */}
          <div className="flex-shrink-0 px-4 py-3 border-t border-[#D0DCF0] bg-white flex gap-3">
            <button
              onClick={handlePrintFront}
              className="flex-1 py-2.5 rounded-md bg-[#1A56A8] text-white text-xs font-bold tracking-wide hover:bg-[#154496] active:scale-95 transition shadow-sm"
            >
              🖨 Print Front
            </button>
            <button
              onClick={handlePrintBack}
              className="flex-1 py-2.5 rounded-md border-2 border-[#1A56A8] text-[#1A56A8] text-xs font-bold tracking-wide hover:bg-[#F0F6FF] active:scale-95 transition"
            >
              🖨 Print Back
            </button>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════
            RIGHT MAIN AREA — LIVE PREVIEW
        ══════════════════════════════════════════════════════════ */}
        <main className="flex-1 flex flex-col bg-[#F0F4FB] print-area">
          {/* Top Bar */}
          <div className="hide-on-print sticky top-0 z-10 bg-white border-b border-[#D0DCF0] px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#1A56A8]"></div>
              <span className="text-sm font-semibold text-gray-600">
                Live Preview
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="px-2 py-1 rounded bg-[#EEF2FA] text-[#4A6FA5] font-medium">
                A4 Scale
              </span>
              <span>Card ID: {formData.rcNumber || "—"}</span>
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="flex-1 overflow-y-auto flex justify-center items-start py-10 px-4">
            <div className="w-full flex justify-center overflow-hidden pb-10">
              {/* Screen scale wrapper */}
              <div className="origin-top scale-[0.55] md:scale-[0.65] lg:scale-[0.75] xl:scale-[0.82] 2xl:scale-95 print:scale-100 print:transform-none transition-transform duration-300">
                <div
                  className={`cards-wrapper flex flex-col gap-6 w-[800px] ${
                    printMode === "front"
                      ? "print-front-only"
                      : printMode === "back"
                        ? "print-back-only"
                        : ""
                  }`}
                >
                  <CardFront details={formData} />
                  <CardBack details={formData} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
