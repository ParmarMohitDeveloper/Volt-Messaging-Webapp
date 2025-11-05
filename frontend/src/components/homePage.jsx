import Navbar from "./navbar";

export default function Homepage() {
  return (
    <div className="bg-[#0d1333] text-white min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-24 px-4 bg-[#0d1333]">
        <div className="inline-block bg-[#121b45] px-4 py-1 rounded-full text-sm mb-4">
          🟡 Now available on all platforms
        </div>
        <h1 className="text-5xl font-bold mb-4">
          Lightning-Fast <span className="text-yellow-400">Messaging</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Connect with friends and family in real-time. Crystal-clear conversations,
          lightning-fast delivery, and privacy you can trust.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/login"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-yellow-500/50 transition-all"
          >
            Start Messaging →
          </a>
          <button className="border border-gray-500 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#101942] text-center">
        <h2 className="text-3xl font-bold mb-2">Why choose Volt?</h2>
        <p className="text-gray-400 mb-10">
          Built for the modern world with features that matter to you
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8">
          {[
            {
              icon: "⚡",
              title: "Lightning Fast",
              desc: "Instant message delivery with sub-second latency. Experience real-time conversations like never before.",
            },
            {
              icon: "🛡️",
              title: "Privacy First",
              desc: "End-to-end encryption on all messages. Your conversations stay private and secure, always.",
            },
            {
              icon: "📱",
              title: "Works Everywhere",
              desc: "Available on iOS, Android, web, and desktop. Stay connected across all your devices.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-[#0d1333] p-6 rounded-xl border border-gray-700 hover:border-yellow-400 transition"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#121b45] py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to experience the future of messaging?
        </h2>
        <p className="text-gray-300 mb-8">
          Join millions of users already using Volt for instant, secure communication.
        </p>
        <a
          href="/signup"
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-yellow-500/50 transition-all"
        >
          Create Your Account →
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0f29] py-10 text-gray-400 text-sm">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 px-8">
          <div>
            <h3 className="flex items-center space-x-2 text-white font-semibold mb-2">
              ⚡ <span>Volt</span>
            </h3>
            <p>Lightning-fast messaging for everyone.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Product</h4>
            <ul className="space-y-1">
              <li>Features</li>
              <li>Pricing</li>
              <li>Security</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Legal</h4>
            <ul className="space-y-1">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
