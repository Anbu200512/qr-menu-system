import { useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { FaPrint, FaDownload, FaQrcode, FaTable, FaLink } from "react-icons/fa"

function QRGenerator() {
  const [tableNumber, setTableNumber] = useState("1")

  // UPDATED URL FORMAT
  const qrValue = `http://localhost:5173/menu/table/${tableNumber}`

  return (
    <>
      {/* PRINT STYLE */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #qr-print-area,
            #qr-print-area * {
              visibility: visible;
            }
            #qr-print-area {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 360px;
              background: white;
              padding: 30px;
              border-radius: 24px;
              border: 2px solid #c84b2f;
              box-shadow: none !important;
            }
            button,
            input,
            h1,
            p:not(.print-text),
            label {
              display: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <div className="w-full max-w-7xl mx-auto px-0 md:px-2">
        <div className="max-w-2xl mx-auto">
          {/* HEADER */}
          <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              QR Generator 
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Generate QR codes for restaurant tables
            </p>
          </div>

          {/* MAIN CARD */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            
            {/* TABLE INPUT SECTION */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Table Number
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <FaTable className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    min="1"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Enter table number"
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#c84b2f] transition-all text-gray-800 dark:text-white placeholder-gray-400"
                  />
                </div>
                <div className="bg-[#c84b2f]/10 dark:bg-[#c84b2f]/20 text-[#c84b2f] px-5 py-3 rounded-xl font-semibold whitespace-nowrap">
                  Table #{tableNumber}
                </div>
              </div>
            </div>

            {/* QR CODE DISPLAY AREA */}
            <div
              id="qr-print-area"
              className="bg-gradient-to-br from-[#c84b2f]/5 to-transparent dark:from-[#c84b2f]/10 p-8 flex flex-col items-center"
            >
              {/* QR CODE BOX */}
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                <QRCodeCanvas value={qrValue} size={220} />
              </div>

              {/* TABLE NUMBER */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-[#c84b2f] text-white px-5 py-2 rounded-full text-sm font-semibold">
                  <FaQrcode size={14} /> Table #{tableNumber}
                </div>
              </div>

              {/* SCAN INSTRUCTION */}
              <p className="print-text text-gray-500 dark:text-gray-400 text-sm mt-4 text-center">
                Scan QR code to view menu & place order
              </p>

              {/* URL DISPLAY */}
              <div className="print-text mt-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-xs text-gray-500 dark:text-gray-400 text-center break-all w-full flex items-center justify-center gap-2">
                <FaLink size={12} />
                <span>{qrValue}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 no-print">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PRINT BUTTON */}
                <button
                  onClick={() => window.print()}
                  className="bg-[#c84b2f] hover:bg-[#b03d24] text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <FaPrint size={16} /> Print QR
                </button>

                {/* DOWNLOAD BUTTON */}
                <button
                  onClick={() => {
                    const canvas = document.querySelector("canvas")
                    const image = canvas.toDataURL("image/png")
                    const link = document.createElement("a")
                    link.href = image
                    link.download = `table-${tableNumber}-qr.png`
                    link.click()
                  }}
                  className="bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <FaDownload size={16} /> Download QR
                </button>
              </div>
            </div>
          </div>

          {/* HELPER NOTE */}
          <div className="mt-6 bg-[#c84b2f]/5 dark:bg-[#c84b2f]/10 rounded-xl p-4 border border-[#c84b2f]/10 dark:border-[#c84b2f]/20">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              💡 Print this QR code and place it on the table. Customers can scan it to view your menu and place orders directly.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default QRGenerator