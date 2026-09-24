import { Sprout, Check } from 'lucide-react';

interface CropsGridProps {
  onOpenBooking: () => void;
}

export function CropsGrid({ onOpenBooking }: CropsGridProps) {
  const crops = [
    {
      name: 'Paddy / Rice',
      tamilName: 'நெல்',
      desc: 'Uniform micron-mist treatment over submerged delta mud. Effective for blast disease, stem borer, and timely foliar nutrition.',
      image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?q=80&w=800',
      badge: 'Major Crop',
    },
    {
      name: 'Sugarcane',
      tamilName: 'கரும்பு',
      desc: 'High-altitude aerial spraying over impenetrable, 10-foot dense sugarcane stalks where manual knapsack spraying cannot reach.',
      image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?q=80&w=800',
      badge: 'Tall Crop Reach',
    },
    {
      name: 'Cotton',
      tamilName: 'பருத்தி',
      desc: 'Targeted bollworm and whitefly suppression. Downward propeller vortex drives mist through heavy lower leaf foliage.',
      image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800',
      badge: 'Precision Swath',
    },
    {
      name: 'Banana Plantations',
      tamilName: 'வாழை',
      desc: 'Top-canopy spraying covering wide, broad leaves. Ideal for Sigatoka leaf spot, pseudostem weevil, and micro-nutrient sprays.',
      image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=800',
      badge: 'High Canopy',
    },
    {
      name: 'Vegetables & Chillies',
      tamilName: 'காய்கறிகள் & மிளகாய்',
      desc: 'Gentle, calibrated droplet dispersion on sensitive crops like tomato, chilli, and brinjal without mechanical leaf bruising.',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?q=80&w=800',
      badge: 'Delicate Care',
    },
    {
      name: 'Groundnut & Pulses',
      tamilName: 'நிலக்கடலை & பயறு',
      desc: 'Thorough, low-profile soil-level canopy coverage for tikka leaf spot and pod borer protection with minimal wheel trampling.',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800',
      badge: 'Zero Trampling',
    },
    {
      name: 'Coconut Groves',
      tamilName: 'தென்னை தோப்புகள்',
      desc: 'Targeted crown spraying for rhinoceros beetle, red palm weevil, and bud rot disease without dangerous tree climbing.',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800',
      badge: 'Vertical Reach',
    },
    {
      name: 'Maize & Millets',
      tamilName: 'மக்காச்சோளம் & சிறுதானியங்கள்',
      desc: 'Rapid intervention against Fall Armyworm during critical vegetative stages, safeguarding yields across extensive fields.',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=800',
      badge: 'Fast Response',
    },
  ];

  return (
    <section id="crops" className="py-24 bg-stone-950 relative overflow-hidden border-t border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            Agricultural Versatility
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Crops We Protect <span className="text-emerald-400">Across India</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            Our multi-rotor agricultural drones are calibrated to treat every major Indian and South Indian crop canopy with zero plant damage.
          </p>
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {crops.map((crop, index) => (
            <div
              key={index}
              className="group relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 hover:border-emerald-500/50 shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between"
            >
              {/* Image Container with Gradient Overlay */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter brightness-[0.75] group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md">
                  {crop.badge}
                </span>
              </div>

              {/* Text Body */}
              <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {crop.name}
                    </h3>
                    <span className="text-xs font-semibold text-emerald-400">
                      {crop.tamilName}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {crop.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Calibrated Dosage
                  </span>
                  <button
                    onClick={onOpenBooking}
                    className="text-xs text-white hover:text-emerald-300 font-bold underline"
                  >
                    Book for this crop
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Crop Callout */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-stone-900/60 border border-stone-800 max-w-2xl mx-auto space-y-3">
          <p className="text-sm text-stone-300">
            Have a specialized horticultural or plantation crop not listed here?
          </p>
          <button
            onClick={onOpenBooking}
            className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 underline"
          >
            Contact our drone coordinator for custom crop spray parameters &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
