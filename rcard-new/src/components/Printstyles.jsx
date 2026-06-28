// src/components/card/PrintStyles.jsx
export default function PrintStyles({ cardBg }) {
  return (
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

        /* Purana wala jo kaam kar raha tha — exactly same */
        .print-area.colored-bg {
          background-color: ${cardBg} !important;
          height: 54% !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
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
  );
}