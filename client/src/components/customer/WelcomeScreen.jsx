function WelcomeScreen() {
  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
      <div className="text-center animate-pulse">
        <h1 className="text-5xl md:text-7xl font-bold text-green-500">
          Welcome
        </h1>

        <p className="text-white text-2xl mt-4">
          To Aura Kitchen
        </p>
      </div>
    </div>
  )
}

export default WelcomeScreen