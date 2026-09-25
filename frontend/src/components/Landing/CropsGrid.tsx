import { Check, ArrowRight, Sprout } from 'lucide-react';

export function CropsGrid() {
  const crops = [
    {
      name: 'Paddy / Rice (நெல்)',
      stage: 'Nursery to Panicle Initiation',
      waterSaved: '85-90%',
      desc: 'Protects against leaf folder, stem borer, and blast without trampling tender flooded roots.',
      tag: 'Highest Demand',
    },
    {
      name: 'Sugarcane (கரும்பு)',
      stage: 'Tillering & Grand Growth',
      waterSaved: '90%',
      desc: 'Sprays over 10-14 feet tall impenetrable stalks effortlessly where manual workers cannot enter.',
      tag: 'Tall Crop Spec',
    },
    {
      name: 'Cotton (பருத்தி)',
      stage: 'Square formation to Boll dev',
      waterSaved: '85%',
      desc: 'Downward prop wash coats underside of leaves to wipe out whitefly and bollworm colonies.',
      tag: 'Pest Sensitive',
    },
    {
      name: 'Banana (வாழை)',
      stage: 'Vegetative to Bunch emergence',
      waterSaved: '80%',
      desc: 'High canopy clearance reaches tall pseudostems for Sigatoka leaf spot and aphid protection.',
      tag: 'Horticulture',
    },
    {
      name: 'Chilli & Vegetables (மிளகாய் & காய்கறிகள்)',
      stage: 'Flowering & Fruiting',
      waterSaved: '90%',
      desc: 'Micron mist delivers micro-nutrients and pesticides evenly across bushy vegetable branches.',
      tag: 'High Value',
    },
    {
      name: 'Groundnut & Pulses (வேர்க்கடலை & பயறு)',
      stage: 'Pegging to Pod Formation',
      waterSaved: '85%',
      desc: 'Fast uniform application covers broad ground surfaces in minutes for leaf miner control.',
      tag: 'Fast Coverage',
    },
  ];

  return (
    <section id="crops" className="py-24 bg-stone-950 relative overflow-hidden border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <Sprout className="w-4 h-4 text-emerald-400" />
            Field Tested Indian Crops
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Crops Optimized For <span className="text-emerald-400">Drone Precision Spraying</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            Calibrated spray patterns, droplet size, and flight speed configured specifically for Indian agricultural staples and high-value cash crops.
          </p>
        </div>

        {/* Crops 6 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {crops.map((crop, idx) => (
            <div
              key={idx}
              className="bg-stone-900/60 border border-stone-800 hover:border-emerald-500/40 rounded-3xl p-6 flex flex-col justify-between group hover:bg-stone-900/90 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Header Tag & Metric */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    {crop.tag}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    💧 {crop.waterSaved} Water Saved
                  </span>
                </div>

                {/* Crop Name */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {crop.name}
                </h3>

                {/* Stage Info */}
                <div className="text-xs text-stone-400 mb-3">
                  <span className="font-semibold text-stone-300">Optimal Stage:</span> {crop.stage}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
                  {crop.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Calibrated Dosage
                </span>
                <a
                  href={`https://wa.me/919080369667?text=${encodeURIComponent(`Hello Shamuga Farm Service, I want to enquire about drone spraying for ${crop.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-stone-300 hover:text-emerald-300 font-medium underline flex items-center gap-1"
                >
                  <span>Enquire</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Crop Callout */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-stone-900/60 border border-stone-800 max-w-2xl mx-auto space-y-3">
          <p className="text-sm text-stone-300">
            Have a specialized horticultural or plantation crop not listed here?
          </p>
          <a
            href="https://wa.me/919080369667?text=Hello%20Shamuga%20Farm%20Service,%20I%20have%20a%20specialized%20crop%20for%20drone%20spraying."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 underline"
          >
            Contact our drone coordinator for custom crop spray parameters &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
