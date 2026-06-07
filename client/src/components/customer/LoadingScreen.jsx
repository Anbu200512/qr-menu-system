import { UtensilsCrossed } from "lucide-react"

function LoadingScreen() {
  return (
    <div className="fp-loading">
      <div className="fp-loading-inner">
        <div className="fp-spinner-wrap">
          <div className="fp-spinner"></div>
          <UtensilsCrossed className="fp-spinner-icon" />
        </div>

        <p className="fp-loading-text">
          Loading menu…
        </p>
      </div>
    </div>
  )
}

export default LoadingScreen