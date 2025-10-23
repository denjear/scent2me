"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

  const handleSubmit = async () => {
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

  const clearAll = () => {
    setForm({ gender: "", families: [], timeOfDay: "", occasion: "", performance: "Moderate", notes: "" });
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
      className={`px-4 py-2 rounded-lg border transition ${
        active ? "bg-[#c6d3c1] border-[#9fb79a]" : "bg-white border-gray-300 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#f8f6ef] flex flex-col items-center py-10 text-gray-800">
      <section className="w-full max-w-5xl px-6">
        <h1 className="text-3xl font-semibold mb-8 text-center">Create your potion</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Gender */}
            <div>
              <h2 className="font-semibold mb-2">Gender</h2>
              <div className="flex flex-wrap gap-3">
                {["Male", "Female", "Unisex"].map((g) => (
                  <Btn key={g} active={form.gender === g} onClick={() => setForm({ ...form, gender: g })}>
                    {g}
                  </Btn>
                ))}
              </div>
            </div>

            {/* Fragrance Families (multi) */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold mb-2">Fragrance Families</h2>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, families: [] })}
                  className="text-xs text-gray-500 underline"
                >
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-2">Select up to 3–4 families you like.</p>
              <div className="flex flex-wrap gap-3">
                {FAMILIES.map((f) => (
                  <Btn key={f} active={!!form.families.find((x) => x === f)} onClick={() => toggleFamily(f)}>
                    {f}
                  </Btn>
                ))}
              </div>
            </div>

            {/* Performance */}
            <div>
              <h2 className="font-semibold mb-2">Performance</h2>
              <div className="flex flex-wrap gap-3">
                {PERFORMANCE.map((p) => (
                  <Btn key={p} active={form.performance === p} onClick={() => setForm({ ...form, performance: p })}>
                    {p}
                  </Btn>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Time of Day */}
            <div>
              <h2 className="font-semibold mb-2">Time of Day</h2>
              <div className="flex flex-wrap gap-3">
                {TIMES.map((t) => (
                  <Btn key={t} active={form.timeOfDay === t} onClick={() => setForm({ ...form, timeOfDay: t })}>
                    {t}
                  </Btn>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <h2 className="font-semibold mb-2">Occasion</h2>
              <div className="flex flex-wrap gap-3">
                {OCCASIONS.map((o) => (
                  <Btn key={o} active={form.occasion === o} onClick={() => setForm({ ...form, occasion: o })}>
                    {o}
                  </Btn>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h2 className="font-semibold mb-2">Favorite Notes (optional)</h2>
              <input
                type="text"
                placeholder="e.g., rose, vanilla, amber"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#9fb79a]"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple notes with commas.</p>
            </div>

            {/* Budget */}
            <div>
              <h2 className="font-semibold mb-2">Budget</h2>
              <div className="flex items-center gap-3">
                <span>Rp</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={budget.lowest}
                  onChange={(e) => setBudget({ ...budget, lowest: e.target.value })}
                  className="w-28 border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#9fb79a]"
                />
                <span>–</span>
                <span>Rp</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={budget.highest}
                  onChange={(e) => setBudget({ ...budget, highest: e.target.value })}
                  className="w-28 border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#9fb79a]"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Leave empty to ignore price filtering.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-[#a8bfa5] text-white rounded-xl hover:bg-[#90a88d] transition disabled:opacity-60"
          >
            {loading ? "Finding your scent..." : "Get Recommendation"}
          </button>
          <button
            onClick={clearAll}
            type="button"
            className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition"
          >
            Clear All
          </button>
        </div>

        <footer className="text-center mt-12 text-sm text-gray-500">Scent2Me © 2025 All Rights Reserved.</footer>
      </section>
    </main>
  );
}
