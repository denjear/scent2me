"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_REC_API_BASE || "http://localhost:8000";

const FAMILIES = ["Floral", "Woody", "Citrus", "Oriental", "Gourmand", "Aromatic", "Fresh", "Spicy", "Aquatic"];
const TIMES = ["Morning", "Afternoon", "Evening", "Night"];
const OCCASIONS = ["Daily", "Office", "Date", "Party", "Formal"];
const PERFORMANCE = ["Light", "Moderate", "Strong"];

type FormState = {
  gender: string;                 // "Male" | "Female" | "Unisex"
  families: string[];             // multi-select
  timeOfDay: string;              // Morning | ...
  occasion: string;               // Daily | ...
  performance: string;            // Light | Moderate | Strong
  notes: string;                  // comma-separated "rose, vanilla"
};

export default function RecommendationsPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    gender: "",
    families: [],
    timeOfDay: "",
    occasion: "",
    performance: "",
    notes: "",
  });

  const [budget, setBudget] = useState({ lowest: "", highest: "" });
  const [loading, setLoading] = useState(false);

  // new state: show disclaimer modal
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // utils
  const tok = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ");
  const splitNotes = (s: string) =>
    s
      .split(",")
      .map((x) => tok(x))
      .filter(Boolean);

  // handlers
  const toggleFamily = (fam: string) => {
    setForm((prev) => {
      const exists = prev.families.includes(fam);
      const families = exists ? prev.families.filter((f) => f !== fam) : [...prev.families, fam];
      return { ...prev, families };
    });
  };

  const validate = () => {
    if (!form.gender) return "Select a gender.";
    if (!form.families.length) return "Pick at least one fragrance family.";
    if (!form.timeOfDay) return "Select time of day.";
    return null;
  };

  // actual submit logic extracted so modal can confirm first
  const doSubmit = async () => {
    const msg = validate();
    if (msg) {
      toast.error(msg);
      return;
    }
    setLoading(true);

    const payload = {
      gender: tok(form.gender),                                // "male|female|unisex"
      families: form.families.map(tok),                        // ["floral","woody",...]
      time_of_day: tok(form.timeOfDay),                        // "morning|..."
      occasion: form.occasion ? tok(form.occasion) : undefined,
      performance: tok(form.performance || "moderate"),        // "light|moderate|strong"
      notes: form.notes ? splitNotes(form.notes) : undefined,  // ["rose","vanilla"]
      min_price: budget.lowest ? Number(budget.lowest) : undefined,
      max_price: budget.highest ? Number(budget.highest) : undefined,
      top_k: 12,
    };

    try {
      const res = await fetch(`${API_BASE}/recommend/preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);

      localStorage.setItem("s2m_last_query", JSON.stringify(json.query ?? payload));
      localStorage.setItem("s2m_last_results", JSON.stringify(json.results || []));

      toast.success("Recommendation generated successfully ✨");
      router.push("/recommendations/results");
    } catch (e: any) {
      toast.error(e?.message || "Failed to fetch recommendations 😢");
    } finally {
      setLoading(false);
    }
  };

  // opens disclaimer modal before proceeding
  const openDisclaimer = () => {
    // run validation first; if invalid show toast and do NOT open disclaimer
    const msg = validate();
    if (msg) {
      toast.error(msg);
      return;
    }
    setShowDisclaimer(true);
  };
  const closeDisclaimer = () => setShowDisclaimer(false);

  const clearAll = () => {
    setForm({ gender: "", families: [], timeOfDay: "", occasion: "", performance: "", notes: "" });
    setBudget({ lowest: "", highest: "" });
  };

  // UI
  const Btn = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      type="button"
      className={`px-4 py-2 rounded-lg border transition cursor-pointer ${
        active ? "bg-[#c6d3c1] border-[#9fb79a]" : "bg-white border-gray-300 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#f8f6ef] flex flex-col text-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f8f6ef] via-[#f0ede6] to-[#e9e4dc] py-20">
        <div className="absolute inset-0 bg-[url('/images/parfum_bg_pattern.png')] opacity-5 bg-repeat bg-center"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-6 bg-gradient-to-r from-[#2D2D2D] via-[#4B4B4B] to-[#2D2D2D] bg-clip-text text-transparent tracking-tight">
            Create Your Perfect Scent
          </h1>
          <p className="text-lg md:text-xl text-[#5A5A5A] max-w-3xl mx-auto leading-relaxed font-light">
            Discover fragrances that match your personality, mood, and lifestyle through our personalized recommendation system
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="flex-1 py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#4B4B4B] mb-4">Tell us about your preferences</h2>
              <p className="text-[#6B6B6B] max-w-2xl mx-auto">
                Answer a few questions to get personalized fragrance recommendations tailored just for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* LEFT COLUMN */}
              <div className="space-y-8">
                {/* Gender Selection */}
                <div className="neu-soft rounded-2xl p-6 hover-lift transition-all duration-300">
                  <h3 className="text-lg font-bold text-[#4B4B4B] mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#A3B899] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    Gender Preference
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {["Male", "Female", "Unisex"].map((g) => (
                      <Btn key={g} active={form.gender === g} onClick={() => setForm({ ...form, gender: g })}>
                        {g}
                      </Btn>
                    ))}
                  </div>
                </div>

                {/* Fragrance Families */}
                <div className="neu-soft rounded-2xl p-6 hover-lift transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#4B4B4B] flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#A3B899] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      Fragrance Families
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Select up to 3–4 families you like most</p>
                  <div className="flex flex-wrap gap-3">
                    {FAMILIES.map((f) => (
                      <Btn key={f} active={!!form.families.find((x) => x === f)} onClick={() => toggleFamily(f)}>
                        {f}
                      </Btn>
                    ))}
                  </div>
                </div>

                {/* Performance */}
                <div className="neu-soft rounded-2xl p-6 hover-lift transition-all duration-300">
                  <h3 className="text-lg font-bold text-[#4B4B4B] mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#A3B899] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    Scent Longevity
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {PERFORMANCE.map((p) => (
                      <Btn key={p} active={form.performance === p} onClick={() => setForm({ ...form, performance: p })}>
                        {p}
                      </Btn>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-8">
                {/* Time of Day */}
                <div className="neu-soft rounded-2xl p-6 hover-lift transition-all duration-300">
                  <h3 className="text-lg font-bold text-[#4B4B4B] mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#A3B899] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">4</span>
                    </div>
                    Time of Day
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {TIMES.map((t) => (
                      <Btn key={t} active={form.timeOfDay === t} onClick={() => setForm({ ...form, timeOfDay: t })}>
                        {t}
                      </Btn>
                    ))}
                  </div>
                </div>

                {/* Occasion */}
                <div className="neu-soft rounded-2xl p-6 hover-lift transition-all duration-300">
                  <h3 className="text-lg font-bold text-[#4B4B4B] mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#A3B899] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">5</span>
                    </div>
                    Occasion
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {OCCASIONS.map((o) => (
                      <Btn key={o} active={form.occasion === o} onClick={() => setForm({ ...form, occasion: o })}>
                        {o}
                      </Btn>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="neu-soft rounded-2xl p-6 hover-lift transition-all duration-300">
                  <h3 className="text-lg font-bold text-[#4B4B4B] mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#A3B899] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">6</span>
                    </div>
                    Favorite Notes
                  </h3>
                  <input
                    type="text"
                    placeholder="e.g., rose, vanilla, amber, sandalwood"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="neu-input w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#A3B899] transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">Separate multiple notes with commas (optional)</p>
                </div>

                {/* Budget */}
                <div className="neu-soft rounded-2xl p-6 hover-lift transition-all duration-300">
                  <h3 className="text-lg font-bold text-[#4B4B4B] mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#A3B899] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">7</span>
                    </div>
                    Budget Range
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[#6B6B6B] font-medium">Rp</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={budget.lowest}
                        onChange={(e) => setBudget({ ...budget, lowest: e.target.value })}
                        className="neu-input w-32 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3B899] transition-all"
                      />
                    </div>
                    <span className="text-[#6B6B6B] font-medium">to</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#6B6B6B] font-medium">Rp</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={budget.highest}
                        onChange={(e) => setBudget({ ...budget, highest: e.target.value })}
                        className="neu-input w-32 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3B899] transition-all"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Leave empty to see all price ranges</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-6 mt-16">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={openDisclaimer} /* show modal first */
                  disabled={loading}
                  className="neu-button hover-lift px-8 py-4 text-white font-bold rounded-2xl transition-all duration-300 disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Finding your scent...
                    </>
                  ) : (
                    "Get Recommendation"
                  )}
                </button>
                <button
                  onClick={clearAll}
                  type="button"
                  className="neu-button-secondary hover-lift px-8 py-4 text-[#4B4B4B] font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 bg-white/50 backdrop-blur-sm border-t border-white/20">
        <div className="container mx-auto text-center">
          <p className="text-sm text-gray-600">Scent2Me © 2025 All Rights Reserved.</p>
        </div>
      </footer>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40 transition-opacity"
            onClick={closeDisclaimer}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-xl mx-auto p-6 shadow-lg z-10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-[#f3eadf] p-3">
                  {/* triangle alert icon from lucide-react */}
                  <AlertTriangle size={28} className="text-[#9DBE9C]" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">Disclaimer — Please read</h3>
                <p className="mt-2 text-sm text-gray-600">
                  These perfume recommendations are generated based on similarity analysis and may not fully represent the actual scent experience.
                  Fragrance perception varies between individuals, so please make sure you understand your own scent preferences and the characteristics of each perfume before making a decision.
                </p>
                <p className="mt-3 text-sm text-gray-500">
                  By clicking "I Agree" you acknowledge this and allow the system to proceed with generating recommendations.
                </p>

                <div className="mt-5 flex justify-end gap-3">
                  <button
                    onClick={() => { closeDisclaimer(); }}
                    className="px-4 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      closeDisclaimer();
                      await doSubmit();
                    }}
                    className="px-4 py-2 rounded-md bg-[#9DBE9C] text-white font-medium hover:bg-[#8caf8c] transition cursor-pointer"
                  >
                    I Agree
                  </button>
                </div>
              </div>
            </div>

            {/* close icon */}
            <button
              aria-label="Close"
              onClick={closeDisclaimer}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
