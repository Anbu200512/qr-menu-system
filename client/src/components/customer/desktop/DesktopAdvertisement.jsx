function DesktopAdvertisement({ activeAd }) {
  if (!activeAd) return null;

  return (
    <div
      onClick={() => {
        if (!activeAd.link) return;

        window.open(activeAd.link, "_blank");
      }}
      className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden cursor-pointer"
    >
      <div className="relative h-[240px]">
        <img
          src={activeAd.image}
          alt={activeAd.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute top-5 left-5">
          <span className="flex items-center justify-center w-32 h-6 bg-white text-[#c84b2f] text-sm font-bold rounded-full border border-white/30">
            ✦ SPONSORED
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-bold text-xl">{activeAd.title}</h3>

          <p className="text-sm text-gray-200 mt-1">{activeAd.description}</p>
        </div>
      </div>
    </div>
  );
}

export default DesktopAdvertisement;
