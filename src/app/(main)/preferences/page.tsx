"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Preferences() {
    const router = useRouter();

    type SelectedOptions = {
        gender: string;
        fragranceFamily: string;
        fragrancePyramid: string;
        contextualFactor: string;
        longevity: string;
    };

    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
        gender: "",
        fragranceFamily: "",
        fragrancePyramid: "",
        contextualFactor: "",
        longevity: "",
    });

    const [budget, setBudget] = useState({
        lowest: "",
        highest: "",
    });

    const toggleSelection = (category: keyof SelectedOptions, value: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [category]: prev[category] === value ? "" : value,
        }));
    };

    const handleSubmit = () => {
        router.push("/recommendations");
    };

    return (
        <main className="min-h-screen bg-[#f8f6ef] flex flex-col items-center py-10 text-gray-800">
            <section className="w-full max-w-5xl px-6">
                {/* Title */}
                <h1 className="text-3xl font-semibold mb-8 text-center">Create your potion</h1>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side */}
                    <div className="space-y-6">
                        {/* Gender */}
                        <div>
                            <h2 className="font-semibold mb-2">Gender</h2>
                            <div className="flex flex-wrap gap-3">
                                {["Male", "Female", "Unisex"].map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => toggleSelection("gender", g)}
                                        className={`px-4 py-2 rounded-lg border transition ${selectedOptions.gender === g
                                                ? "bg-[#c6d3c1] border-[#9fb79a]"
                                                : "bg-white border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Fragrance Family */}
                        <div>
                            <h2 className="font-semibold mb-2">Fragrance Family</h2>
                            <div className="flex flex-wrap gap-3">
                                {["Floral", "Woody", "Citrus", "Oriental", "Gourmand"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => toggleSelection("fragranceFamily", f)}
                                        className={`px-4 py-2 rounded-lg border transition ${selectedOptions.fragranceFamily === f
                                                ? "bg-[#c6d3c1] border-[#9fb79a]"
                                                : "bg-white border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Fragrance Pyramid */}
                        <div>
                            <h2 className="font-semibold mb-2">Fragrance Pyramid</h2>
                            <div className="flex flex-wrap gap-3">
                                {["Top Notes", "Middle Notes", "Base Notes"].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => toggleSelection("fragrancePyramid", p)}
                                        className={`px-4 py-2 rounded-lg border transition ${selectedOptions.fragrancePyramid === p
                                                ? "bg-[#c6d3c1] border-[#9fb79a]"
                                                : "bg-white border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-6">
                        {/* Contextual Factor */}
                        <div>
                            <h2 className="font-semibold mb-2">Contextual Factor</h2>
                            <div className="flex flex-wrap gap-3">
                                {["Morning", "Afternoon", "Evening", "Night"].map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => toggleSelection("contextualFactor", c)}
                                        className={`px-4 py-2 rounded-lg border transition ${selectedOptions.contextualFactor === c
                                                ? "bg-[#c6d3c1] border-[#9fb79a]"
                                                : "bg-white border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Longevity */}
                        <div>
                            <h2 className="font-semibold mb-2">Longevity</h2>
                            <div className="flex flex-wrap gap-3">
                                {["Projection", "Sillage", "Longevity"].map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => toggleSelection("longevity", l)}
                                        className={`px-4 py-2 rounded-lg border transition ${selectedOptions.longevity === l
                                                ? "bg-[#c6d3c1] border-[#9fb79a]"
                                                : "bg-white border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Budget */}
                        <div>
                            <h2 className="font-semibold mb-2">Budget</h2>
                            <div className="flex items-center gap-3">
                                <span>Rp</span>
                                <input
                                    type="number"
                                    placeholder="Lowest"
                                    value={budget.lowest}
                                    onChange={(e) => setBudget({ ...budget, lowest: e.target.value })}
                                    className="w-24 border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#9fb79a]"
                                />
                                <span>–</span>
                                <span>Rp</span>
                                <input
                                    type="number"
                                    placeholder="Highest"
                                    value={budget.highest}
                                    onChange={(e) => setBudget({ ...budget, highest: e.target.value })}
                                    className="w-24 border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#9fb79a]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-10">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-[#a8bfa5] text-white rounded-xl hover:bg-[#90a88d] transition"
                    >
                        Get Recommendation
                    </button>
                </div>

                {/* Footer */}
                <footer className="text-center mt-12 text-sm text-gray-500">
                    Scent2Me © 2025 All Rights Reserved.
                </footer>
            </section>
        </main>
    );
}
