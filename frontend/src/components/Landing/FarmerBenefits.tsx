import { Clock, Users, Target, Mountain, ShieldCheck, Cpu, Droplet, ArrowRight } from 'lucide-react';

interface FarmerBenefitsProps {
  onOpenBooking: () => void;
}

export function FarmerBenefits({ onOpenBooking }: FarmerBenefitsProps) {
  const benefits = [
    {
      title: 'Save Critical Farming Time',
      desc: 'Cover an acre in approximately 6 to 8 minutes. Rapid spraying prevents disease outbreaks from spreading across adjacent fields when every hour counts.',
      icon: Clock,
      badge: 'Speed',
    },
    {
      title: 'Reduce Labour Dependency',
      desc: 'Eliminate the struggle of arranging manual labour teams during peak agricultural windows. A single drone service takes care of the whole day’s spraying.',
      icon: Users,
      badge: 'Self-Reliant',
    },
    {
      title: 'Efficient & Uniform Spraying',
      desc: 'Centrifugal atomizing nozzles create fine mist droplets that stick to leaf foliage instead of running off into the soil, maximizing chemical effectiveness.',
      icon: Target,
      badge: 'Consistency',
    },
    {
      title: 'Reach Inaccessible & Tall Terrains',
      desc: 'Effortlessly spray waterlogged paddy mud, dense sugarcane stalks, and tall banana trees where manual labourers simply cannot walk or carry equipment.',
      icon: Mountain,
      badge: 'Accessibility',
    },
    {
      title: 'Eliminate Direct Chemical Exposure',
      desc: 'Keep yourself and family safe. Operators control flights from a safe field perimeter, preventing harmful pesticide skin absorption and vapor inhalation.',
      icon: ShieldCheck,
      badge: 'Health & Safety',
    },
    {
      title: 'Modern Precision Farming',
      desc: 'Bring aerospace precision technology into your everyday farming practices. Controlled application means less chemical wastage and healthier soil biology.',
      icon: Cpu,
      badge: 'Smart AgriTech',
    },
  ];

  return (
    <section className="py-24 bg-stone-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            Real Farmer Advantages
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Designed for Practical <span className="text-emerald-400">Farm Economics</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            Technology that makes immediate sense in the field — saving money on labour, reducing chemical waste, and protecting your health.
          </p>
        </div>

        {/* 6 Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-stone-950/70 border border-stone-800 hover:border-emerald-500/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between group hover:bg-stone-950 transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-stone-950 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-900 border border-emerald-500/20">
                      {benefit.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-emerald-300 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <span>Farmer Verified Value</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
