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

        <div className="absolute top-3 left-3">
          <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
            Sponsored
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
