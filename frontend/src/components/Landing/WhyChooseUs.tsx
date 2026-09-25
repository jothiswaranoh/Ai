import { ShieldCheck, Sparkles, CheckCircle2, Phone, Award, Clock, HeartHandshake, FileText } from 'lucide-react';

export function WhyChooseUs() {
  const points = [
    {
      icon: Award,
      title: 'DGCA Certified Drone Operators',
      desc: 'Our pilots are fully trained, certified, and compliant with Indian civil aviation remote pilot guidelines for safe aerial agro-chemical operations.',
    },
    {
      icon: Clock,
      title: 'Prompt Scheduling & Rapid Dispatch',
      desc: 'Pest infestations don’t wait. We coordinate swift field response across rural districts to treat fields before irreversible foliar damage occurs.',
    },
    {
      icon: Sparkles,
      title: 'High-Precision Atomization Tech',
      desc: 'Uniform micron-level droplets provide 360-degree foliar coating while conserving water by up to 90% compared to traditional manual lances.',
    },
    {
      icon: FileText,
      title: 'Transparent Digital Farmer Billing',
      desc: 'Clear GPS-verified flight logs with transparent acreage billing and digital receipts, keeping farm records accurate and straightforward.',
    },
    {
      icon: ShieldCheck,
      title: 'Zero Chemical Health Exposure',
      desc: 'Prioritizing farmer health. Farmers observe from safe shaded ridges while the drone executes precise canopy coverage autonomously.',
    },
    {
      icon: HeartHandshake,
      title: 'Deep Farmer Trust & Support',
      desc: 'Built by farmers, for farmers. We take personal pride in every acre treated, helping rural families achieve higher crop yield and peace of mind.',
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-stone-950 relative overflow-hidden border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Reliable Agricultural Aviation
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Why Farmers Across India <span className="text-emerald-400">Trust Shamuga</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            We deliver reliable, professional agricultural drone services backed by certified pilots and transparent billing.
          </p>
        </div>

        {/* 6 Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="bg-stone-900/60 border border-stone-800 hover:border-emerald-500/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between group hover:bg-stone-900/90 transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-stone-950 transition-all duration-300 shadow-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-emerald-300 transition-colors">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {point.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Verified Field Standard
                </div>
              </div>
            );
          })}
        </div>

        {/* Service Area Ribbon */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">Serving Across Tamil Nadu & All Over India</h4>
              <p className="text-xs sm:text-sm text-stone-400">
                On-call dispatch available for paddy delta belts, sugarcane clusters, cotton tracts, and vegetable farms.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href="tel:9080369667"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs sm:text-sm border border-stone-700 transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              9080369667
            </a>
            <a
              href="https://wa.me/919080369667?text=Hello%20Shamuga%20Farm%20Service,%20I%20would%20like%20to%20know%20more%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-colors whitespace-nowrap text-center"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
