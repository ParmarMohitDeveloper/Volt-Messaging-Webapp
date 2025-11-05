export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-gradient-to-r from-[#0a0f29] to-[#101942] text-white">
      <div className="flex items-center space-x-2">
        <div className="bg-yellow-400 w-8 h-8 flex items-center justify-center rounded-full text-black font-bold">
          ⚡
        </div>
        <h1 className="text-lg font-semibold">Volt</h1>
      </div>
      <a
        href="/signup"
        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-5 py-2 rounded-lg shadow-lg hover:shadow-yellow-500/50 transition-all"
      >
        Get Started →
      </a>
    </nav>
  );
}
