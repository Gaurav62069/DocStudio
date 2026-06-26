import React from "react";

const CardBack = ({ details }) => {
  return (
    <div
      id="cardback-print"
      className="w-[800px] h-[575px]  bg-white text-black flex mx-auto"
      style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
    >
      {/* LEFT PANEL */}
      <div className="w-1/2 border border-black px-3 pt-3 relative mr-2">
        <p className="border border-black text-center text-[12px] font-semibold py-[3px] mb-4">
          Ration Card No. / राशन कार्ड संख्या : {details.rcNumber || "XXXXXXXX"}
        </p>

        <ol className="list-decimal pl-5 text-[13px] font-semibold leading-[1.45]">
          <li className="mb-3">
            Cardholder Name : {details.headOfFamilyEng || "---"}
          </li>

          <li className="mb-4">
            कार्डधारी का नाम : {details.headOfFamily || "---"}
            <div className="font-normal text-[12px] mt-3 ml-4 leading-[1.35]">
              <p className="mb-2">(वरिष्ठ महिला का नाम)</p>

              <p>
                (गृहस्थी का मुखिया 18 वर्ष या उससे अधिक की महिला होगी। यदि 18
                वर्ष से कम उम्र की महिलाएं हों तो पुरुष गृहस्थी का मुखिया होगा।
                जैसे ही महिला की उम्र 18 वर्ष होगी वह गृहस्थी की मुखिया हो
                जाएगी।)
              </p>
            </div>
          </li>

          <li className="mb-3">
            पिता/पति का नाम : {details.fatherName || "---"}
          </li>

          <li className="mb-3">
            आवासीय पता :
            <div className="font-normal text-[12px] ml-5 mt-2 space-y-1">
              <p>ग्राम/टोला : {details.village || "---"}</p>
              <p>प्रखंड/नगर-पालिका : {details.block || "---"}</p>
              <p>जिला का नाम : {details.district || "---"}</p>
            </div>
          </li>

          <li>
            लक्षित जन वितरण प्रणाली के दुकानदार का नाम/पता :
            <div className="font-normal text-[12px] ml-5 mt-2 space-y-1">
              <p>वितरक का नाम : {details.dealerName || "---"}</p>
              <p>वितरक का पता : {details.dealerAddress || "---"}</p>
            </div>
          </li>
        </ol>

        <div className="absolute bottom-5 left-5 right-5 flex justify-between text-[13px] font-semibold">
          <span>निर्गत करने की तिथि</span>

          <span>प्राधिकृत अधिकारी का हस्ताक्षर</span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2 px-4 pt-3 border border-black ml-2">
        <h6 className="text-center font-bold underline text-[15px] mb-4">
          कार्डधारियों के लिए आवश्यक सूचनाएं
        </h6>

        <ul className="text-[12px] leading-[1.4] space-y-2 text-justify list-none">
          <li>
            १. यह राशनकार्ड, कार्डधारी को निजी रूप से दिया गया है। इसे कार्डधारी
            के अलावा कोई अन्य व्यक्ति प्रयोग नहीं कर सकता। इसे सुरक्षित रखना
            कार्डधारी की निजी जिम्मेदारी है।
          </li>

          <li>
            २. प्राधिकृत उचित मूल्य की दुकान से राशन प्राप्त करते समय कार्ड में
            राशन की मात्रा अवश्य अंकित करा लें। अपना कार्ड दुकान पर न छोड़ें।
          </li>

          <li>
            ३. किसी भी माह का राशन यदि उसी माह में प्राप्त नहीं किया जाए तो वह
            राशन अगले माह में भी प्राप्त किया जा सकता है।
          </li>

          <li>
            ४. उचित मूल्य के दुकानदार के विरुद्ध शिकायत होने पर उसकी सूचना
            उपायुक्त/उपविकास आयुक्त/अनुमंडल पदाधिकारी/जिला आपूर्ति
            पदाधिकारी/प्रखण्ड आपूर्ति पदाधिकारी/आपूर्ति निरीक्षक को दी जा सकती
            है।
          </li>

          <li>
            ५. इस कार्ड का निर्धारित मूल्य है। इसके खो जाने या अन्य कारणों से
            दूसरा कार्ड आवश्यक होने पर निर्धारित शुल्क जमा कर जांच के उपरांत नया
            कार्ड प्राप्त किया जा सकता है।
          </li>

          <li>
            ६. यदि कार्डधारी अपना निवास स्थान बदलता है तो इसकी सूचना संबंधित
            आपूर्ति कार्यालय को तत्काल दें तथा अपना कार्ड स्थानांतरित करवाएं।
          </li>

          <li>
            ७. यदि कार्डधारी अपने राशनिंग क्षेत्र से बाहर स्थायी रूप से जाता है
            तो इस राशन कार्ड को संबंधित कार्यालय में जमा कर प्रमाणपत्र प्राप्त
            करना आवश्यक होगा।
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CardBack;
