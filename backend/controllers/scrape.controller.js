// scrape.controller.js
import { PDFExtract } from "pdf.js-extract";
import translate from "translate";

const pdfExtract = new PDFExtract();
translate.engine = "google";

const safeTranslate = async (text, to = "hi") => {
  if (!text) return text;
  try {
    const result = await translate(text, { to });
    return result || text;
  } catch {
    return text;
  }
};

const relationMap = {
  HUSBAND: "पति",
  WIFE: "पत्नी",
  SON: "बेटा",
  DAUGHTER: "बेटी",
  MOTHER: "माँ",
  FATHER: "पिता",
  SELF: "स्वयं",
  SISTER: "बहन",
  BROTHER: "भाई",
  GRANDSON: "पोता",
  GRANDDAUGHTER: "पोती",
  "DAUGHTER-IN-LAW": "बहू",
  "SON-IN-LAW": "दामाद",
  "FATHER-IN-LAW": "ससुर",
  "MOTHER-IN-LAW": "सास",
  OTHER: "अन्य",
};

const parseMembers = (text) => {
  const pattern =
    /(\d+)\s+([A-Za-z][A-Za-z ]+?)\s+(\d{1,3})\s*\/\s*([MF])\s+([A-Z]+)\s+XXXX-XXXX-\d{4}/g;
  const members = [];
  let m;
  while ((m = pattern.exec(text)) !== null) {
    members.push({
      sr: parseInt(m[1]),
      name: m[2].trim(),
      age: m[3],
      gender: m[4] === "F" ? "म." : "पु.",
      relation: relationMap[m[5].toUpperCase()] || "अन्य",
      relEng: m[5].toUpperCase(),
    });
  }
  members.sort((a, b) => a.sr - b.sr);
  return members;
};

const getFatherName = (members) => {
  if (!members.length) return null;
  const headGender = members[0].gender;
  const targetRel = headGender === "म." ? "HUSBAND" : "FATHER";
  const found = members.find((m) => m.relEng === targetRel);
  return found ? found.name : null;
};

export const extractFromPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const data = await pdfExtract.extractBuffer(req.file.buffer);

    // pdf.js-extract: har page ke saare items ko space se join karo
    // \n nahi milta — sab ek flat string ban jaata hai
    const pages = data.pages.map((page) =>
      page.content.map((item) => item.str).join(" "),
    );

    const fullText = pages.join(" ");
    const page1 = pages[0] || "";
    const page2 = pages[1] || "";

    const isRationCard = /Fare Price Shop No:/i.test(page1);
    const isJharkhandPDF =
      /Jharkhand Government e-Ration Card|Rationcard No\s*:/i.test(fullText);

    const parsedData = {
      rcNumber: "",
      headOfFamilyEng: "",
      headOfFamily: "",
      fatherName: "",
      gender: "",
      age: "",
      village: "",
      district: "",
      block: "",
      dealerName: "",
      dealerAddress: "",
      membersCount: 1,
      additionalMembers: [],
    };

    // ══════════════════════════════════════════════════════
    // rationCard.pdf
    // ══════════════════════════════════════════════════════
    if (isRationCard) {
      // RC Number
      const rcM = page1.match(/Ration Card Number\s+(\d{10,20})/i);
      if (rcM) parsedData.rcNumber = rcM[1].trim();

      // Head of Family — "Head of Family: Rakhi Devi Address:" mein se
      // pdf.js-extract sab ek line mein deta hai, isliye Address: boundary use karo
      const hofM = page1.match(/Head of Family:\s*(.+?)\s+Address:/i);
      if (hofM) parsedData.headOfFamilyEng = hofM[1].trim();

      // Address — "Address: Belatand Po Baddiha Ps Giridih Dist Giridih"
      // Boundary: "Mobile Number:" ya "Issue Date"
      const addrM = page1.match(
        /Address:\s*(.+?)\s+(?:Mobile Number:|Issue Date)/i,
      );
      if (addrM) {
        const full = addrM[1].trim();
        // District
        const distM = full.match(/Dist\s+(\w+)/i);
        if (distM) parsedData.district = distM[1].trim();

        // Village/Gram-Tola — Dist ke pehle ka PEHLA word
        // "Belatand Po Baddiha Ps Giridih" → "Belatand"
        const beforeDist = full.replace(/\s*Dist\s+.*/i, "").trim();
        const village = beforeDist.split(/\s+/)[0];
        parsedData.village = village;

        // Dealer Address = same village
        parsedData.dealerAddress = village;
      }

      // Members table (page 2)
      const members = parseMembers(page2);
      if (members.length > 0) {
        const head = members[0];
        parsedData.age = head.age;
        parsedData.gender = head.gender;
        parsedData.relation = head.relation;

        const fatherEng = getFatherName(members);
        if (fatherEng) parsedData._fatherEng = fatherEng;

        parsedData.membersCount = members.length;
        parsedData.additionalMembers = members
          .slice(1)
          .map(({ name, age, gender, relation }) => ({
            name,
            age,
            gender,
            relation,
          }));
      }
    }

    // ══════════════════════════════════════════════════════
    // Jharkhand scrape PDF
    // ══════════════════════════════════════════════════════
    if (isJharkhandPDF) {
      if (!parsedData.rcNumber) {
        const rcM = fullText.match(/Rationcard No\s*:\s*(\d{10,20})/i);
        if (rcM) parsedData.rcNumber = rcM[1].trim();
      }

      // Dealer name — actual naam (number nahi)
      const dealerM = fullText.match(
        /Dealer\s*:\s*([A-Z][A-Z\s]+?)(?=\s*\d|\s*Dealer License|License)/i,
      );
      if (dealerM) parsedData.dealerName = dealerM[1].trim();

      // Block
      const blockM = fullText.match(/Block\s*:\s*([A-Za-z]+)/i);
      if (blockM) parsedData.block = blockM[1].trim();

      // District (agar pehle se nahi mila)
      if (!parsedData.district) {
        const distM = fullText.match(/District\s*:\s*([A-Za-z]+)/i);
        if (distM) parsedData.district = distM[1].trim();
      }

      // Village (agar pehle se nahi mila)
      if (!parsedData.village) {
        const villM = fullText.match(/Village\s*:\s*([A-Za-z]+)/i);
        if (villM) {
          parsedData.village = villM[1].trim();
          parsedData.dealerAddress = villM[1].trim();
        }
      }
    }

    // ══════════════════════════════════════════════════════
    // Translation
    // ══════════════════════════════════════════════════════
    if (parsedData.headOfFamilyEng) {
      parsedData.headOfFamily = await safeTranslate(parsedData.headOfFamilyEng);
    }
    if (parsedData._fatherEng) {
      parsedData.fatherName = await safeTranslate(parsedData._fatherEng);
      delete parsedData._fatherEng;
    }
    if (parsedData.district) {
      parsedData.district = await safeTranslate(parsedData.district);
    }
    if (parsedData.village) {
      parsedData.village = await safeTranslate(parsedData.village);
      // dealerAddress bhi same translate karo
      parsedData.dealerAddress = parsedData.village;
    }
    if (parsedData.block) {
      parsedData.block = await safeTranslate(parsedData.block);
    }
    if (parsedData.dealerName) {
      parsedData.dealerName = await safeTranslate(parsedData.dealerName);
    }
    for (let i = 0; i < parsedData.additionalMembers.length; i++) {
      parsedData.additionalMembers[i].name = await safeTranslate(
        parsedData.additionalMembers[i].name,
      );
    }

    console.log("Extracted:", JSON.stringify(parsedData, null, 2));
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("PDF Error:", error);
    res
      .status(500)
      .json({ message: "Error extracting data", error: error.message });
  }
};

export const scrapeCardData = async (req, res) => {
  res.status(501).json({ message: "Scraping abhi implement nahi hai" });
};
