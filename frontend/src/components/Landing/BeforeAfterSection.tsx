import { useState, useRef } from 'react';
import { Sparkles, ArrowLeftRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export function BeforeAfterSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section id="crop-results" className="py-24 bg-stone-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Field Proven Crop Health
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            See the Difference: <span className="text-emerald-400">Before & After Drone Spray</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            Drag the slider across the crop field below to observe the impact of uniform micron droplet coverage on pest eradication and vigorous foliar growth.
          </p>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div
            ref={containerRef}
            className="relative h-[320px] sm:h-[450px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl select-none cursor-ew-resize border border-emerald-500/30 bg-stone-950"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* Background Image: After (Right/Healthy View) */}
            <img
              src="/images/crop-after.jpg"
              alt="Healthy vibrant crop canopy after precision drone spraying treatment"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Badge for After */}
            <div className="absolute top-4 right-4 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>After Drone Spray (Healthy Canopy)</span>
            </div>

            {/* Foreground Clipped Image: Before (Left/Distressed View) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src="/images/crop-before.jpg"
                alt="Pest infested or yellowed crop field before precision drone spraying"
                className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                }}
              />
              {/* Badge for Before */}
              <div className="absolute top-4 left-4 bg-stone-950/90 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Before (Untreated / Pest Damage)</span>
              </div>
            </div>

            {/* Slider Dividing Bar & Handle */}
            <div
              className="absolute inset-y-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-500 border-2 border-white text-stone-950 flex items-center justify-center shadow-xl">
                <ArrowLeftRight className="w-5 h-5 text-stone-950" />
              </div>
            </div>

            {/* Instructions overlay at the bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-stone-950/80 backdrop-blur-md text-stone-300 text-xs px-4 py-1.5 rounded-full border border-stone-800 pointer-events-none hidden sm:block">
              ↔ Drag or swipe horizontally to compare crop foliage
            </div>
          </div>

          {/* Before & After Characteristic Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-amber-500/20 space-y-2">
              <h4 className="text-amber-400 font-bold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Before Drone Treatment
              </h4>
              <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
                <li>Irregular manual spray leaves dry spots for insects to survive</li>
                <li>Excess chemical pooling on top leaves causing foliar scorch</li>
                <li>Delayed spray timing due to worker shortage allows pest spread</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
              <h4 className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> After Drone Treatment
              </h4>
              <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
                <li>Uniform micro-droplets coat upper and lower leaf surfaces</li>
                <li>Fast timely intervention suppresses pest cycles across the entire block</li>
                <li>Balanced nutrient uptake promoting greener, healthier foliage</li>
              </ul>
            </div>
          </div>

          {/* Honest Disclaimer */}
          <div className="p-3 rounded-xl bg-stone-900/50 border border-stone-800 text-[11px] text-stone-400 text-center">
            ℹ️ <strong className="text-stone-300">Agricultural Note:</strong> Visual representation illustrating crop response under uniform spray coverage. Actual field recovery varies based on crop variety, soil fertility, climate, and agro-inputs applied.
          </div>
        </div>
      </div>
    </section>
  );
}
