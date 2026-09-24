import React, { useState } from 'react';
import { Phone, MessageSquare, Send, CheckCircle2, ShieldCheck, MapPin, Calendar, Sprout, Clock } from 'lucide-react';

interface BookingSectionProps {
  onOpenModal?: () => void;
  onOpenBooking?: () => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ onOpenModal, onOpenBooking }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    crop: 'Paddy (நெல்)',
    acres: '',
    preferredDate: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const crops = [
    'Paddy (நெல்)',
    'Sugarcane (கரும்பு)',
    'Cotton (பருத்தி)',
    'Banana (வாழை)',
    'Vegetables & Chillies (காய்கறிகள் & மிளகாய்)',
    'Groundnut (வேர்க்கடலை)',
    'Coconut (தென்னை)',
    'Maize / Corn (மக்காச்சோளம்)',
    'Other Crops (பிற பயிர்கள்)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.acres) {
      alert('Please fill in Farmer Name, Phone Number, and Total Acres.');
      return;
    }

    const message = `*🚜 New Drone Spraying Enquiry - Shamuga Farm Service*%0A%0A` +
      `*Farmer Name:* ${encodeURIComponent(formData.name)}%0A` +
      `*Phone Number:* ${encodeURIComponent(formData.phone)}%0A` +
      `*Village/District:* ${encodeURIComponent(formData.district || 'Not specified')}%0A` +
      `*Crop:* ${encodeURIComponent(formData.crop)}%0A` +
      `*Area:* ${encodeURIComponent(formData.acres)} Acres%0A` +
      `*Preferred Date:* ${encodeURIComponent(formData.preferredDate || 'Earliest available')}%0A` +
      (formData.notes ? `*Notes:* ${encodeURIComponent(formData.notes)}%0A` : '') +
      `%0A_Sent via Shamuga Farm Service Online Booking_`;

    const whatsappUrl = `https://wa.me/919080369667?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="book" className="py-24 bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-950 text-white relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <Sprout className="w-4 h-4 text-emerald-400" />
                Schedule Your Flight Today
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 tracking-tight leading-tight">
                Ready to Upgrade Your Farm Spraying?
              </h2>
              <p className="text-stone-300 text-lg mt-4 leading-relaxed font-sans">
                Experience ultra-fast, high-precision spraying that protects your crops and saves you precious time and water. Contact our team directly or submit a booking enquiry below.
              </p>
            </div>

            {/* Quick Contact Buttons */}
            <div className="space-y-4">
              <a
                href="tel:9080369667"
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-stone-400 font-medium">Direct Phone Call</div>
                    <div className="text-xl font-bold text-white tracking-wide font-mono">+91 90803 69667</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800">
                  Call Now
                </span>
              </a>

              <a
                href="https://wa.me/919080369667?text=Hello%20Shamuga%20Farm%20Service,%20I%20would%20like%20to%20enquire%20about%20drone%20spraying%20service."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-emerald-300 font-medium">WhatsApp Booking Support</div>
                    <div className="text-xl font-bold text-white tracking-wide font-mono">90803 69667</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-white bg-emerald-600 px-3 py-1.5 rounded-lg group-hover:bg-emerald-500 transition-colors">
                  Chat on WhatsApp
                </span>
              </a>
            </div>

            {/* Trust commitments */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-stone-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Pan-India fleet capability with swift South India field response</span>
              </div>
              <div className="flex items-center gap-3 text-stone-300 text-sm">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Quick turnaround — typical morning & evening flight slots</span>
              </div>
              <div className="flex items-center gap-3 text-stone-300 text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>No upfront advance required before field inspection and alignment</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl relative">
              <div className="border-b border-stone-800 pb-6 mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Send className="w-6 h-6 text-emerald-400" />
                  Book Drone Spraying Service
                </h3>
                <p className="text-stone-400 text-sm mt-1">
                  Fill in your agricultural details. We will confirm slot availability immediately.
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">Enquiry Received!</h4>
                  <p className="text-stone-300 max-w-md mx-auto text-sm">
                    Thank you, {formData.name}. Our flight team has received your request and will call you on{' '}
                    <span className="font-semibold text-emerald-400 font-mono">{formData.phone}</span> shortly to schedule the operation.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        district: '',
                        crop: 'Paddy (நெல்)',
                        acres: '',
                        preferredDate: '',
                        notes: '',
                      });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-medium transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-2 uppercase tracking-wider">
                        Farmer Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-stone-950/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-2 uppercase tracking-wider">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile (e.g. 9876543210)"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-stone-950/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        Village & District
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Thanjavur / Pollachi"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full bg-stone-950/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-2 uppercase tracking-wider">
                        Crop Type
                      </label>
                      <select
                        value={formData.crop}
                        onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                        className="w-full bg-stone-950/80 border border-stone-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-colors"
                      >
                        {crops.map((c) => (
                          <option key={c} value={c} className="bg-stone-900 text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-2 uppercase tracking-wider">
                        Total Land Area (Acres) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        required
                        placeholder="e.g. 5"
                        value={formData.acres}
                        onChange={(e) => setFormData({ ...formData, acres: e.target.value })}
                        className="w-full bg-stone-950/80 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full bg-stone-950/80 border border-stone-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-colors [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-2 uppercase tracking-wider">
                      Additional Notes / Spray Chemical Requirements (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Need pest control spray for paddy blast, morning timing preferred"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-stone-950/80 border border-stone-700 rounded-xl px-4 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-base shadow-xl shadow-emerald-950/60 hover:shadow-emerald-900/80 transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
                  >
                    <Send className="w-5 h-5" />
                    Confirm & Send Booking Request via WhatsApp
                  </button>

                  <p className="text-center text-xs text-stone-400">
                    By submitting, your enquiry details will open directly in WhatsApp with our operational dispatch desk at <strong className="text-stone-300 font-mono">9080369667</strong>.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
