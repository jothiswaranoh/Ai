import { XCircle, CheckCircle2, Clock, Users, ShieldAlert, ShieldCheck, Droplet, ArrowRight, Zap, Target } from 'lucide-react';

interface ProblemSolutionProps {
  onOpenBooking: () => void;
}

export function ProblemSolution({ onOpenBooking }: ProblemSolutionProps) {
  const problems = [
    {
      title: 'Heavy Manual Backpacks',
      desc: 'Carrying 16-20 litre knapsack tanks under intense heat causes acute physical strain and exhaustion.',
      icon: Users,
    },
    {
      title: 'Long, Exhausting Hours',
      desc: 'Takes 4 to 6 hours of relentless walking per acre, delaying crucial pest treatment across larger farms.',
      icon: Clock,
    },
    {
      title: 'Inaccessible & Muddy Terrain',
      desc: 'Waterlogged paddy, tall sugarcane, and thorny crops are extremely difficult or impossible to spray manually.',
      icon: XCircle,
    },
    {
      title: 'Uneven Droplet Spraying',
      desc: 'Manual hand lances produce erratic droplet sizes, missing hidden pests under dense lower leaves.',
      icon: Target,
    },
    {
      title: 'High Labour Shortages',
      desc: 'Dependence on finding available farm labourers during peak monsoon pest outbreaks causes crop loss.',
      icon: Users,
    },
    {
      title: 'Direct Chemical Exposure',
      desc: 'Labourers and farmers constantly inhale toxic chemical vapors and suffer direct pesticide skin contact.',
      icon: ShieldAlert,
    },
  ];

  const solutions = [
    {
      title: 'Zero Physical Strain',
      desc: 'The drone carries and disperses the entire payload automatically while farmers supervise from safe borders.',
      icon: Zap,
    },
    {
      title: 'Lightning-Fast Speed',
      desc: 'Covers an entire acre in approximately 6 to 8 minutes, completing 20-30 acres in a single morning session.',
      icon: Clock,
    },
    {
      title: 'Complete Terrain Independence',
      desc: 'Flies effortlessly over submerged paddy mud, dense sugarcane canopy, and high banana plantations.',
      icon: CheckCircle2,
    },
    {
      title: 'Downward Propeller Penetration',
      desc: 'Prop wash creates downward vortex, flipping leaves to coat both top and underside surfaces evenly.',
      icon: Target,
    },
    {
      title: 'Instant On-Demand Booking',
      desc: 'One call or WhatsApp to 9080369667 dispatches our certified drone pilot directly to your field.',
      icon: Users,
    },
    {
      title: 'Zero Chemical Contact',
      desc: 'Farmers and operators stay completely outside the spray zone, preventing harmful pesticide inhalation.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="problem-solution" className="py-24 bg-stone-900 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-950/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            The Agricultural Shift
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Traditional Manual Spraying vs.{' '}
            <span className="text-emerald-400">Drone Precision Spraying</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            Compare traditional farm spraying challenges with modern drone operations. See why thousands of Indian farmers are upgrading to drone services.
          </p>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Traditional Manual Spraying Card (The Problem) */}
          <div className="rounded-3xl p-6 sm:p-8 bg-stone-950/80 border border-red-500/30 shadow-2xl relative flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Traditional Manual Spraying</h3>
                    <p className="text-xs text-red-400 font-medium">Outdated, Slow & Exhausting</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-950/60 text-red-300 border border-red-800/40">
                  Manual Knapsack
                </span>
              </div>

              <div className="space-y-4">
                {problems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-start gap-3.5 hover:border-red-500/30 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex-shrink-0 flex items-center justify-center text-red-400 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-200">{item.title}</h4>
                        <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 text-xs text-stone-400 text-center">
              ⚠️ Incurs high chemical wastage, delays pest response, and strains farmer health.
            </div>
          </div>

          {/* Drone Spraying Card (The Solution) */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-emerald-950/50 to-stone-950/90 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-950/40 relative flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Shamuga Drone Spraying</h3>
                    <p className="text-xs text-emerald-400 font-medium">Fast, Uniform & Effortless</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Recommended
                </span>
              </div>

              <div className="space-y-4">
                {solutions.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="p-3.5 rounded-2xl bg-stone-900/80 border border-emerald-500/20 flex items-start gap-3.5 hover:border-emerald-400/40 transition-colors shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex-shrink-0 flex items-center justify-center text-emerald-400 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-800/40">
              <button
                onClick={onOpenBooking}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all cursor-pointer"
              >
                Switch To Drone Spraying Today
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
