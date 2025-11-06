import Navbar from "./navbar";

export default function Homepage() {
  return (
    <div className="bg-[#0d1333] text-white min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-3 px-4 bg-[#0d1333]">
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
          
        </div>
      </section>

      {/* Features */}
      <section className="py-9 bg-[#101942] text-center">
        <h2 className="text-3xl font-bold mb-2">Why choose Volt?</h2>
        <p className="text-gray-400 mb-10">
          Built for the modern world with features that matter to you
        </p>

        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto px-7">
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
      <section className="bg-[#121b45] py-2 text-center">
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
        <br />
        <br />
      </section>

     {/* Footer */}
<footer className="bg-[#0a0f29] py-10 text-gray-400 text-sm">
   {/* Credit Line */}
    <div className="mt-10 pt-6 border-t border-gray-700 text-center text-xs text-gray-500">
      Professionally created by <span className="text-white font-medium">Parmar Mohit</span>
    </div>
</footer>
    </div>
  );
}
