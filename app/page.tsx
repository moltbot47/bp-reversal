import Link from "next/link";
import { Heart, Droplets, Brain, Leaf, ArrowRight } from "lucide-react";

const PILLARS = [
  {
    icon: Heart,
    label: "Vascular",
    color: "#EF4444",
    bg: "#FEE2E2",
    desc: "Open up your blood vessels so blood flows easier — less pressure on your heart",
  },
  {
    icon: Brain,
    label: "Nervous",
    color: "#3B82F6",
    bg: "#DBEAFE",
    desc: "Calm your stress response so your body stops keeping blood pressure high",
  },
  {
    icon: Droplets,
    label: "Blood",
    color: "#22C55E",
    bg: "#D1FAE5",
    desc: "Fix the mineral balance in your blood so your body holds less extra water",
  },
  {
    icon: Leaf,
    label: "Kidney",
    color: "#A855F7",
    bg: "#F3E8FF",
    desc: "Help your kidneys flush out excess salt and fluid that raises pressure",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#EEEFE9]">
      {/* Hero */}
      <section className="px-4 pt-12 pb-8 max-w-lg mx-auto text-center">
        <div className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-medium px-3 py-1 rounded-full mb-4">
          <Heart className="w-3 h-3" />
          90-Day Protocol
        </div>
        <h1 className="text-4xl font-bold text-[#1D2939] leading-tight mb-4">
          Reverse High Blood Pressure{" "}
          <span className="text-[#EB9D2A]">Naturally</span>
        </h1>
        <p className="text-[#667085] text-lg mb-8 max-w-md mx-auto">
          A science-backed protocol targeting the 4 root causes of hypertension.
          21 daily habits. 3 phases. Free forever.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#EB9D2A] text-white font-semibold text-lg rounded-xl shadow-[0_3px_0_0_#C4800F] hover:bg-[#D4891F] active:translate-y-[1px] active:shadow-[0_1px_0_0_#C4800F] transition-all"
        >
          Start Free
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-sm text-[#667085] mt-3">
          No credit card. No subscriptions. Ever.
        </p>
      </section>

      {/* 4 Pillars */}
      <section className="px-4 py-8 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-[#1D2939] text-center mb-6">
          The 4 Pillars of Reversal
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {PILLARS.map((p) => (
            <div
              key={p.label}
              className="bg-[#FDFDF8] rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-4"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: p.bg }}
              >
                <p.icon className="w-6 h-6" style={{ color: p.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-[#1D2939]">{p.label}</h3>
                <p className="text-sm text-[#667085] mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-8 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-[#1D2939] text-center mb-6">
          How It Works
        </h2>
        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Sign up in seconds",
              desc: "Just an email. We send you a magic link.",
            },
            {
              step: "2",
              title: "Follow your daily checklist",
              desc: "12 items in Phase 1, building to 21 by Day 61. One-tap tracking.",
            },
            {
              step: "3",
              title: "Log your blood pressure",
              desc: "Watch your numbers trend downward over 90 days.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="bg-[#FDFDF8] rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-[#EB9D2A] text-white flex items-center justify-center font-bold flex-shrink-0">
                {s.step}
              </div>
              <div>
                <h3 className="font-semibold text-[#1D2939]">{s.title}</h3>
                <p className="text-sm text-[#667085] mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-8 max-w-lg mx-auto text-center">
        <div className="bg-[#FDFDF8] rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1D2939] mb-2">
            Ready to start?
          </h2>
          <p className="text-[#667085] mb-6">
            Your 90-day journey begins with one click.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#EB9D2A] text-white font-semibold rounded-xl shadow-[0_2px_0_0_#C4800F] hover:bg-[#D4891F] active:translate-y-[1px] active:shadow-[0_1px_0_0_#C4800F] transition-all"
          >
            Start Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 max-w-lg mx-auto text-center border-t border-gray-200">
        <p className="text-sm text-[#667085]">
          BP Reversal is a free health tracking tool.
          Not medical advice. Consult your doctor before making changes.
        </p>
        <p className="text-sm text-[#667085] mt-2">
          <a
            href="https://buymeacoffee.com/dbutler"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EB9D2A] hover:underline"
          >
            Support this project
          </a>
        </p>
      </footer>
    </div>
  );
}
