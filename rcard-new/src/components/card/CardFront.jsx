import React from "react";

const CardFront = ({ details, cardBg = "#FFFFFF" }) => {
  const extraMembers = details.additionalMembers || [];

  return (
    <div
      id="cardfront-print"
      className="w-[800px] h-[575px] text-black flex mx-auto"
      style={{
        fontFamily: "'Noto Serif Devanagari', serif",
        backgroundColor: cardBg,
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* LEFT SIDE */}
      <div
        className="w-1/2 border border-black px-3 pt-2 relative mr-2"
        style={{
          backgroundColor: cardBg,
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        <h5 className="text-center font-bold text-[16px] leading-4 mb-2 pt-2">
          अपवर्जन/समावेशन मानक के आलोक में
          <br />
          परिवारिक सुचि
        </h5>

        <p className="border border-black text-center text-[13px] font-bold py-[2px] mb-2">
          Ration Card No. / राशन कार्ड संख्या : {details.rcNumber || "XXXXXXXX"}
        </p>

        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border border-black py-1 w-[40px]">क्र.</th>
              <th className="border border-black py-1">पूरा नाम</th>
              <th className="border border-black py-1 w-[40px]">लिंग</th>
              <th className="border border-black py-1 w-[40px]">उम्र</th>
              <th className="border border-black py-1 w-[90px]">संबंध</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black text-center">1</td>
              <td className="border border-black text-center">
                {details.headOfFamily || "---"}
              </td>
              <td className="border border-black text-center">
                {details.gender || "---"}
              </td>
              <td className="border border-black text-center">
                {details.age || "---"}
              </td>
              <td className="border border-black text-center">
                {details.relation || "स्वयं"}
              </td>
            </tr>

            {extraMembers.map((member, index) => (
              <tr key={index}>
                <td className="border border-black text-center">{index + 2}</td>
                <td className="border border-black text-center">
                  {member.name || "---"}
                </td>
                <td className="border border-black text-center">
                  {member.gender || "---"}
                </td>
                <td className="border border-black text-center">
                  {member.age || "---"}
                </td>
                <td className="border border-black text-center">
                  {member.relation || "---"}
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan="5" className="border border-black  text-left pl-1">
                कुल व्यक्तियों की संख्या : {details.membersCount || "1"}
              </td>
            </tr>
            <tr>
              <td colSpan="5" className="border border-black  text-left pl-1">
                कार्डधारी का हस्ताक्षर :
              </td>
            </tr>
          </tbody>
        </table>

        <div className="absolute bottom-4 left-0 right-0 text-center mb-6">
          <p className="font-bold text-[14px]">Help Line No :- 18003456598</p>
          <p className="font-bold text-[13px]">
            IT SUPPORT BY NATIONAL INFORMATICS CENTER(NIC)
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        className="w-1/2 border border-black px-3 pt-5 relative flex flex-col items-center ml-2"
        style={{
          backgroundColor: cardBg,
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        <h3 className="font-bold text-[24px] mb-10">राशन कार्ड</h3>

        <h4 className="font-bold text-[16px] text-center leading-6 mb-4">
          खाद्य,सार्वजनिक वितरण एवम उपभोक्ता मामले विभाग
        </h4>

        <img
          src="/logo.png"
          alt="logo"
          className="w-[170px] h-[170px] object-contain mb-2"
        />

        <h5 className="font-bold text-center text-[14px] leading-5 ,b-2">
          राष्ट्रीय खाद्य सुरक्षा अधिनियम
          <br />
          पूर्वविक्ताप्राप्त गृहस्थी योजना - गिरिडीह
        </h5>

        <div className="absolute bottom-26 left-2 right-2">
          <p className="border border-black text-center text-[13px] font-bold py-[2px]">
            Ration Card No. / राशन कार्ड संख्या :{" "}
            {details.rcNumber || "XXXXXXXX"}
          </p>
          <p className="text-center font-bold text-[14px] mt-2">
            कार्डधारी का नाम : {details.headOfFamily || "---"}
          </p>
          <img
            src="/barcode2.png"
            alt="barcode"
            className="h-[45px] mx-auto mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default CardFront;
