import { useState } from 'react';
import { X, Phone, MessageSquare, CheckCircle, Calendar, MapPin, User, Sprout, ArrowRight } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    farmerName: '',
    phone: '',
    district: '',
    crop: 'Paddy / Rice (நெல்)',
    acres: '',
    preferredDate: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Shamuga Farm Service,\nI would like to book Drone Spraying for my farm:\n\n• Farmer Name: ${formData.farmerName || 'Not specified'}\n• Phone: ${formData.phone || 'Not specified'}\n• District/Village: ${formData.district || 'Tamil Nadu'}\n• Crop: ${formData.crop}\n• Acreage: ${formData.acres ? formData.acres + ' Acres' : 'To be discussed'}\n• Preferred Date: ${formData.preferredDate || 'Earliest available'}\n\nPlease let me know your availability and pricing.`
    );
    window.open(`https://wa.me/919080369667?text=${text}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-stone-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-emerald-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Direct Service Booking • All Over India
          </div>
          <h3 className="text-2xl font-bold text-white">Book Agriculture Drone Spraying</h3>
          <p className="text-emerald-100/80 text-sm mt-1">
            Fill in your farm details below or connect immediately via WhatsApp / Call.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Booking Request Received!</h4>
              <p className="text-stone-300 text-sm mt-2">
                Thank you, <span className="text-emerald-400 font-semibold">{formData.farmerName}</span>. Our agricultural drone coordinator will call you at{' '}
                <span className="text-emerald-400 font-semibold">{formData.phone}</span> shortly to confirm the field schedule.
              </p>
            </div>

            <div className="p-4 bg-emerald-950/60 border border-emerald-500/20 rounded-2xl text-left space-y-2 text-xs text-stone-300">
              <p><strong className="text-white">Crop:</strong> {formData.crop}</p>
              <p><strong className="text-white">Location:</strong> {formData.district}</p>
              {formData.acres && <p><strong className="text-white">Acreage:</strong> {formData.acres} Acres</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleWhatsAppDirect}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-lg shadow-emerald-900/30"
              >
                <MessageSquare className="w-4 h-4" />
                Send via WhatsApp
              </button>
              <a
                href="tel:9080369667"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold border border-stone-700 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                Call 9080369667
              </a>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="text-xs text-stone-400 hover:text-stone-200 underline mt-3 block mx-auto"
            >
              Done & Close Window
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Quick Action Ribbon */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:9080369667"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold border border-stone-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                Call: 9080369667
              </a>
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/70 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                WhatsApp Direct
              </button>
            </div>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-stone-700/60"></div>
              <span className="flex-shrink mx-3 text-stone-400 text-xs uppercase font-medium tracking-wider">or fill details</span>
              <div className="flex-grow border-t border-stone-700/60"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Farmer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.farmerName}
                  onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                  placeholder="e.g. Murugan / Rajesh"
                  className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Mobile Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 block mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Village & District *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Thanjavur / Erode"
                    className="w-full px-3.5 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 block mb-1 flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                    Crop Type
                  </label>
                  <select
                    value={formData.crop}
                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-sm"
                  >
                    <option value="Paddy / Rice (நெல்)">Paddy / Rice (நெல்)</option>
                    <option value="Sugarcane (கரும்பு)">Sugarcane (கரும்பு)</option>
                    <option value="Cotton (பருத்தி)">Cotton (பருத்தி)</option>
                    <option value="Banana (வாழை)">Banana (வாழை)</option>
                    <option value="Vegetables & Chillies (காய்கறிகள்)">Vegetables & Chillies</option>
                    <option value="Groundnut & Pulses (நிலக்கடலை)">Groundnut & Pulses</option>
                    <option value="Coconut (தென்னை)">Coconut (தென்னை)</option>
                    <option value="Maize / Millets (மக்காச்சோளம்)">Maize / Millets</option>
                    <option value="Other Crops">Other Crops</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 block mb-1">
                    Approximate Acres
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={formData.acres}
                    onChange={(e) => setFormData({ ...formData, acres: e.target.value })}
                    placeholder="e.g. 5 Acres"
                    className="w-full px-3.5 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 block mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  Confirm Drone Spraying Request
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-center text-stone-400">
                🔒 Transparent pricing. Fast dispatch across Tamil Nadu & All Over India.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
