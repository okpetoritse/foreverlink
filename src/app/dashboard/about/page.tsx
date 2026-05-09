import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050B14] text-[#F5F5DC] p-6 md:p-8 pt-8 md:pt-16 font-mono selection:bg-[#D4AF37] selection:text-[#050B14]">
      <div className="max-w-3xl mx-auto pb-20">
        
        {/* Header */}
        <div className="border-b border-[#D4AF37]/30 pb-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] tracking-widest uppercase mb-4">
            About ForeverLink
          </h1>
          <p className="text-sm md:text-base text-[#8892B0] uppercase tracking-widest">
            We Are the Bridge Between Your Memory and Eternity
          </p>
        </div>

        {/* The Manifesto */}
        <article className="space-y-12 text-sm md:text-base leading-relaxed text-[#8892B0]">
          
          <section>
            <p className="text-white text-lg leading-loose mb-6">
              Welcome. You are here because, somewhere inside you, there is a quiet fear. And a quiet hope.
            </p>
            <p className="mb-4">
              <strong className="text-[#D4AF37]">The fear:</strong> that one day, no one will remember your face. That your grandchildren’s grandchildren will scroll through old photos on a forgotten hard drive and see nothing but faded pixels. That your voice—the way you laughed, the way you said “I love you”—will evaporate like morning mist.
            </p>
            <p className="mb-4">
              <strong className="text-[#D4AF37]">The hope:</strong> that it doesn’t have to be that way. That you can still reach across decades, even centuries, and touch the ones who come after you. That your story can outlive your bones.
            </p>
            <p>
              ForeverLink was born from that hope. This is what we are, what we believe, and what we make possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide border-l-4 border-[#D4AF37] pl-4">
              The Problem: In 100 Years, Your Social Media Will Be Gone
            </h2>
            <p className="mb-4">Think about where your most precious memories live right now.</p>
            <p className="mb-4">
              They live on Instagram, in stories that vanish after 24 hours. They live on Facebook, buried under algorithm-driven ads, in a platform that could be sold, shut down, or forgotten by the next generation. They live on your phone, backed up to iCloud or Google Photos—services you pay for monthly, that your children might not even know exist.
            </p>
            <p className="mb-4 font-bold text-white">
              Now answer this honestly: Who will log into your accounts 50 years after you’re gone?
            </p>
            <p className="mb-4">
              No one. Your passwords will die with you. Your two-factor authentication will send codes to a phone number that no longer exists. The cloud storage you paid for will quietly delete your files the moment your credit card expires. Even physical photos fade. Paper yellows. Ink smudges. Hard drives fail. CDs rot.
            </p>
            <p className="italic text-[#D4AF37]">
              The truth is brutal: Most family histories disappear within two generations. Your great-grandchildren will know your name, maybe a vague story, and that’s it. Your face becomes a stranger’s face. Your voice becomes silence. Your life becomes a footnote with no footnotes.
            </p>
            <p className="mt-4">That is the problem ForeverLink exists to solve.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide border-l-4 border-[#D4AF37] pl-4">
              The Vision: Bridging the Gap Between 2026 and 2126
            </h2>
            <p className="mb-6">
              ForeverLink is not an app. It is not a photo album. It is not a family tree in the traditional sense. <strong className="text-[#D4AF37]">It is a digital vessel for the soul of your family.</strong>
            </p>
            
            <div className="space-y-8 pl-4 border-l border-white/10">
              <div>
                <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-sm">1. The Living Tree</h3>
                <p>Every family starts with a tree—but not the static, names-and-dates kind. Our tree is alive. It grows as you add people, stories, photos, videos, and voice recordings. Every person on the tree controls their own story. The deceased are added with honor, managed by descendants who become their voice.</p>
              </div>
              
              <div>
                <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-sm">2. The Time Vault</h3>
                <p>This is the heart of ForeverLink. A Time Vault is a message you seal for a specific future date. A video of you singing a lullaby, set to open on your granddaughter’s 18th birthday. You choose the year. Your descendants discover it like a treasure map. They don’t just read about you. They meet you.</p>
              </div>

              <div>
                <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-sm">3. The Echo Wall</h3>
                <p>Not everything needs a date. The Echo Wall is where your essence lives: a 10-second video of you smiling, an audio clip saying "I love you," a recipe for Christmas cookies. Decades from now, a descendant can stand on your Echo Wall and feel your presence as surely as if you were in the next room.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide border-l-4 border-[#D4AF37] pl-4">
              What You Achieve
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <li className="bg-[#0A192F]/50 p-6 rounded-xl border border-white/5">
                <strong className="text-[#D4AF37] block mb-2">1. Perpetual Presence</strong>
                You will die. That is reality. But with ForeverLink, your voice, your face, and your love do not have to die with you.
              </li>
              <li className="bg-[#0A192F]/50 p-6 rounded-xl border border-white/5">
                <strong className="text-[#D4AF37] block mb-2">2. Family Unity Across Time</strong>
                Every family member can contribute to the same tree, the same vaults. You become a family not just in the present, but across generations.
              </li>
              <li className="bg-[#0A192F]/50 p-6 rounded-xl border border-white/5">
                <strong className="text-[#D4AF37] block mb-2">3. Closure for the Living</strong>
                Build retroactive profiles for those who have passed, inviting all who loved them to contribute. It becomes a digital memorial that heals.
              </li>
              <li className="bg-[#0A192F]/50 p-6 rounded-xl border border-white/5">
                <strong className="text-[#D4AF37] block mb-2">4. A Home for Your Legacy</strong>
                Your legacy finally has a home that won’t be evicted. We are building systems designed to outlive us.
              </li>
              <li className="bg-[#0A192F]/50 p-6 rounded-xl border border-white/5">
                <strong className="text-[#D4AF37] block mb-2">5. A Gift for the Future</strong>
                A child born in 2126 will inherit you. They will tap “Play” on a video you recorded 100 years earlier.
              </li>
              <li className="bg-[#0A192F]/50 p-6 rounded-xl border border-white/5">
                <strong className="text-[#D4AF37] block mb-2">6. Peace of Mind</strong>
                Once your family is in ForeverLink, you can rest. We protect it. We preserve it.
              </li>
            </ul>
          </section>

          <section className="bg-[#0A192F] p-8 rounded-2xl border border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.05)] mt-12">
            <h2 className="text-2xl font-bold text-[#D4AF37] mb-6 uppercase tracking-wide">
              The Trust & The $5 Legacy Pass
            </h2>
            <p className="mb-4">
              Let’s talk about sustainability. Because trust without sustainability is just a promise that will break.
            </p>
            <p className="mb-4">
              ForeverLink operates on two simple principles:
              <br/><br/>
              <strong>1. Everyone gets the basics forever.</strong> A free account includes your profile and family tree. Every family deserves to be remembered.
              <br/><br/>
              <strong>2. Those who want permanence, subscribe to the Legacy Pass.</strong>
            </p>
            <p className="mb-4">
              For $5 a month, you secure a digital plot of land for your descendants to visit 50 generations from now. That $5 pays for the server costs, the massive bandwidth required for video storage, redundant offline backups, and the human effort required to keep your family’s soul safe for a century or more. 
            </p>
            <p className="text-white italic">
              We charge it because free cannot be forever. We do not sell your data. We do not show ads next to your grandmother’s face. We simply ask for a contribution that makes eternal preservation mathematically possible.
            </p>
          </section>

          <section className="text-center pt-12 border-t border-white/10">
            <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-6">Join Us</h2>
            <p className="text-lg text-[#8892B0] mb-10 max-w-2xl mx-auto">
              ForeverLink is for the person who lies awake wondering if their grandchildren will know their face. Add your branch to the eternal tree. And when your great‑great‑grandchild opens a time capsule you sealed today, you will know: It was worth it.
            </p>
            <Link href="/dashboard/tree" className="bg-[#D4AF37] text-[#050B14] px-10 py-4 rounded-lg font-bold uppercase tracking-[0.2em] hover:bg-white hover:scale-105 transition-all inline-block shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              Start Your Forever
            </Link>
          </section>

        </article>
      </div>
    </main>
  );
}