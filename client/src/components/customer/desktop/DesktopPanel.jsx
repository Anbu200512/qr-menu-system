import DesktopAdvertisement from "./DesktopAdvertisement";

function DesktopPanel({
  desktopPanel,
  renderDesktopPanelContent,
  panelMeta,
  setDesktopPanel,
  activeAd,
}) {
  if (!desktopPanel) return null;

  return (
    <div className="w-[340px] min-w-[340px] sticky top-24 self-start">
      {/* Main Panel */}
      <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        {/* Header */}
        <div className="p-4">
          <div className="relative bg-[#c84b2f] text-white rounded-2 px-5 py-4 shadow-sm h-[48px] flex items-center justify-center">
            <div className="flex items-center justify-center gap-2">
              <div>{panelMeta[desktopPanel]?.icon}</div>

              <span className="text-lg font-bold tracking-wide">
                {panelMeta[desktopPanel]?.title}
              </span>
            </div>

            <button
              onClick={() => setDesktopPanel(null)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-4">
          <div className="h-[280px] overflow-y-auto scrollbar-hide">
            {renderDesktopPanelContent()}
          </div>
        </div>
      </div>

      {/* Gap Between Panel & Advertisement */}
      <div className="h-6" />

      {/* Advertisement Card */}
      <DesktopAdvertisement activeAd={activeAd} />
    </div>
  );
}

export default DesktopPanel;
