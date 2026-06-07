function BannerSlider({
  banners,
  currentBannerIndex,
  setCurrentBannerIndex,
}) {
  if (!banners.length) return null

  return (
    <div className="fp-banner-wrap">
      {banners.map((banner, idx) => (
        <div
          key={banner._id}
          className="fp-banner-slide"
          style={{
            opacity:
              idx === currentBannerIndex
                ? 1
                : 0,
          }}
        >
          <img
            src={banner.image}
            alt={banner.title}
            loading="lazy"
          />

          <div className="fp-banner-overlay" />

          <div className="fp-banner-text">
            <h2>{banner.title}</h2>
            <p>{banner.subtitle}</p>
          </div>
        </div>
      ))}

      <div className="fp-banner-dots">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() =>
              setCurrentBannerIndex(idx)
            }
            className={`fp-banner-dot ${
              idx === currentBannerIndex
                ? "active"
                : ""
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default BannerSlider