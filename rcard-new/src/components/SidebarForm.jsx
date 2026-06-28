// src/components/card/SidebarForm.jsx
import axios from "axios";
import { useState } from "react";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";

export const inputCls =
  "w-full px-3 py-[9px] text-sm rounded-lg border border-[#D0DCF0] bg-white text-gray-800 " +
  "focus:outline-none focus:ring-2 focus:ring-[#1A56A8]/30 focus:border-[#1A56A8] " +
  "placeholder:text-gray-300 transition-all duration-200 shadow-sm hover:border-[#A8C0E8] hover:shadow-md";

export const selectCls =
  "w-full px-3 py-[9px] text-sm rounded-lg border border-[#D0DCF0] bg-white text-gray-800 " +
  "focus:outline-none focus:ring-2 focus:ring-[#1A56A8]/30 focus:border-[#1A56A8] " +
  "transition-all duration-200 appearance-none shadow-sm cursor-pointer hover:border-[#A8C0E8] hover:shadow-md";

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

const RELATIONS = [
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
];

export default function SidebarForm({
  formData,
  setFormData,
  onPrintFront,
  onPrintBack,
}) {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) =>
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value.toUpperCase(),
    }));

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

  const handlePdfUpload = async () => {
    if (!pdfFile)
      return setMessage({ text: "Pehle PDF select karo!", type: "error" });
    setLoading(true);
    setMessage({ text: "", type: "" });
    const fd = new FormData();
    fd.append("pdfFile", pdfFile);
    try {
      const r = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/data/upload`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
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

  return (
    <aside
      className="hide-on-print flex flex-col h-screen sticky top-0 bg-white border-r border-[#D4E0F5]"
      style={{
        width: "420px",
        minWidth: "380px",
        boxShadow: "6px 0 32px rgba(26,86,168,0.09)",
      }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-6 py-4"
        style={{
          background: "linear-gradient(135deg, #1A56A8 0%, #1e6fc7 100%)",
        }}
      >
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

      {/* Status Message */}
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

      {/* PDF Upload only */}
      <div className="px-5 pt-4 pb-4 border-b border-[#EEF2FA] flex-shrink-0">
        <p className="text-[9.5px] font-extrabold text-[#4A6FA5] uppercase tracking-[0.16em] mb-3">
          PDF से Auto-fill करें
        </p>
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
            {loading ? "⏳..." : "Extract"}
          </button>
        </div>
      </div>

      {/* Scrollable Form */}
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
                    {RELATIONS.map((r) => (
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
                  onChangeText={(t) => setFormData((p) => ({ ...p, block: t }))}
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

      {/* Print Buttons */}
      <div
        className="flex-shrink-0 px-5 py-4 bg-white flex gap-3"
        style={{
          borderTop: "1px solid #D4E0F5",
          boxShadow: "0 -4px 16px rgba(26,86,168,0.06)",
        }}
      >
        <button
          onClick={onPrintFront}
          className="flex-1 py-3 rounded-xl text-white text-xs font-extrabold tracking-wider uppercase hover:opacity-90 active:scale-95 transition-all duration-150"
          style={{
            background: "linear-gradient(135deg, #1A56A8 0%, #2563EB 100%)",
            boxShadow: "0 4px 14px rgba(26,86,168,0.30)",
          }}
        >
          🖨 Print Front
        </button>
        <button
          onClick={onPrintBack}
          className="flex-1 py-3 rounded-xl text-[#1A56A8] text-xs font-extrabold tracking-wider uppercase border-2 border-[#1A56A8] hover:bg-[#EBF0FF] active:scale-95 transition-all duration-150"
        >
          🖨 Print Back
        </button>
      </div>
    </aside>
  );
}
