import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeftRight, CheckCircle2, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';

interface BeforeAfterSectionProps {
  onOpenBooking: () => void;
}

export function BeforeAfterSection({ onOpenBooking }: BeforeAfterSectionProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <section id="crop-results" className="py-24 bg-stone-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            Real Crop Impact
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Before vs. After <span className="text-emerald-400">Drone Spraying</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            See the visual difference that uniform micron droplet coverage makes in pest suppression and crop recovery.
          </p>
        </div>

        {/* Draggable Comparison Visual Card */}
        <div className="max-w-4xl mx-auto bg-stone-950 p-4 sm:p-6 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
          {/* Interactive Drag Banner */}
          <div className="flex items-center justify-between text-xs sm:text-sm px-2">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Before: Uneven / Pest Affected
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 text-stone-300 font-semibold text-xs border border-stone-700">
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Drag slider or click image</span>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> After: Uniform Drone Coverage
            </span>
          </div>

          {/* Comparison Container */}
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            onClick={(e) => handleMove(e.clientX)}
            className="relative h-[320px] sm:h-[460px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-stone-700 shadow-inner"
          >
            {/* AFTER Image (Full background layer) */}
            <img
              src="/images/crop-after.jpg"
              alt="After professional drone spraying - healthy vibrant crops"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-xs font-bold shadow-lg backdrop-blur-md">
              After Drone Spraying
            </div>

            {/* BEFORE Image (Clipped overlay layer) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src="/images/crop-before.jpg"
                alt="Before drone spraying - crop pest and disease damage"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
              />
              <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-amber-950/90 text-amber-300 border border-amber-500/40 text-xs font-bold shadow-lg backdrop-blur-md">
                Before Treatment
              </div>
            </div>

            {/* Vertical Divider Line with Drag Knob */}
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-1 h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)]" />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-500 text-stone-950 border-2 border-white shadow-2xl flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5 font-bold" />
              </div>
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
