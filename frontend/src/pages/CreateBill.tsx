import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { BillForm } from '../components/Bills/BillForm';
import { Button } from '../components/UI/Button';

export function CreateBill() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-stone-950 text-stone-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background matching the rest of the app */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: 'url(/images/hero-drone.jpg)',
            filter: 'brightness(0.3) saturate(1.2)'
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 mb-6 text-stone-300 hover:text-white hover:bg-stone-900 border border-stone-800"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            Back to Dashboard
          </Button>

          {/* Form Container */}
          <div className="bg-stone-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-2xl">
            <h1 className="text-2xl font-bold text-white mb-2">Create New Bill</h1>
            <p className="text-stone-400 text-sm mb-6">
              Enter customer and service details to generate an official invoice.
            </p>

            <BillForm onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBill;
