import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onAuthenticated: (user: UserProfile) => void;
}

const BACKGROUND_IMAGES = [
  '/images/images2.png',
  '/images/images15.png',
  '/images/shopping.png',
  '/images/shop2.png',
  '/images/image 3.png',
  '/images/images12.png',
  '/images/iamges13.png',
];

// Demo access keys - in production, these would be validated against a backend
const VALID_ACCESS_KEYS = [
  'AFOS2024',
  'DEMO1234',
  'ACCESS99',
];

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [accessCode, setAccessCode] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Sliding background effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Modal entrance animation
  useEffect(() => {
    setTimeout(() => setIsModalVisible(true), 300);
  }, []);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate against allowed access keys
    if (!VALID_ACCESS_KEYS.includes(accessCode.toUpperCase())) {
      setError('Invalid access key. Please check with reception.');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId.trim()) {
      setError('Please enter your service number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuthenticated({
        name: 'Wiron R',
        rank: '',
        unit: '',
        balance: 200000,
        serviceNumber: serviceId
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      {/* Sliding Background Images */}
      {BACKGROUND_IMAGES.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={img}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-[#2b6e2b]/40" />

      {/* Top Bar - Hidden on mobile, visible on tablet+ */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-8 py-4 sm:py-6 hidden sm:flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 overflow-hidden">
            <img src="/images/AFSCIRCLE.png" alt="AFOS" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg sm:text-xl tracking-wide">AFOS</h1>
            <p className="text-white/60 text-xs">Armed Forces Official Shop</p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="text-right hidden md:block">
          <p className="text-white font-medium text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-white/60 text-xs mt-0.5">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • POS System
          </p>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-8 z-10 flex gap-2">
        {BACKGROUND_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white w-8' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Login Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 z-20">
        <div 
          className={`w-full max-w-md transform transition-all duration-500 ease-out ${
            isModalVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* CSS for animations */}
            <style>{`
              @keyframes slowBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
            `}</style>

            {/* Modal Header - Clean white with logo */}
            <div className="pt-6 sm:pt-10 pb-4 sm:pb-6 px-5 sm:px-8 text-center bg-gradient-to-b from-gray-50 to-white">
              {/* AFOS Logo with slow bounce animation */}
              <div 
                className="w-16 h-16 sm:w-24 sm:h-24 bg-[#2b6e2b] rounded-xl sm:rounded-[1.25rem] flex items-center justify-center mx-auto mb-4 sm:mb-8 shadow-xl shadow-green-900/20"
                style={{ animation: 'slowBounce 3s ease-in-out infinite' }}
              >
                <img 
                  src="/images/AFSCIRCLE.png" 
                  alt="AFOS" 
                  className="w-12 h-12 sm:w-20 sm:h-20 object-contain"
                />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {step === 1 ? 'Secure Access' : 'Welcome Back'}
              </h2>
              <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base px-2">
                {step === 1 
                  ? 'Enter the access key provided at reception' 
                  : 'Enter your service number to continue'}
              </p>

              {/* Step Indicator - Modern pill style */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-8">
                <button 
                  className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    step === 1 
                      ? 'bg-[#2b6e2b] text-white shadow-lg shadow-green-900/20' 
                      : 'bg-green-50 text-green-700'
                  }`}
                >
                  {step === 2 && <span className="mr-1">✓</span>}
                  Access Key
                </button>
                <div className="w-6 sm:w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full bg-[#2b6e2b] rounded-full transition-all duration-500 ease-out ${step === 2 ? 'w-full' : 'w-0'}`} />
                </div>
                <button 
                  className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    step === 2 
                      ? 'bg-[#2b6e2b] text-white shadow-lg shadow-green-900/20' 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  Service ID
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-5 sm:px-8 py-5 sm:py-8">
              {step === 1 ? (
                <form onSubmit={handleCodeSubmit} className="space-y-4 sm:space-y-6">
                  {/* Input with icon */}
                  <div className="relative group">
                    <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2b6e2b] transition-colors">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => { setAccessCode(e.target.value.toUpperCase()); setError(''); }}
                      className="w-full bg-white border-2 border-gray-200 text-gray-900 pl-12 sm:pl-14 pr-4 sm:pr-5 py-4 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg font-mono tracking-[0.15em] sm:tracking-[0.2em] text-center focus:border-[#2b6e2b] focus:ring-4 focus:ring-green-50 outline-none transition-all placeholder-gray-300"
                      placeholder="Enter Access Key"
                      autoFocus
                    />
                  </div>
                  
                  {error && (
                    <div className="flex items-center justify-center gap-2 text-red-500 text-xs sm:text-sm bg-red-50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !accessCode}
                    className="w-full bg-[#2b6e2b]/90 hover:bg-[#2b6e2b] text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-green-900/20 hover:shadow-green-900/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 sm:gap-3 group"
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Access Key</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleIdSubmit} className="space-y-4 sm:space-y-6">
                  {/* Success badge */}
                  <div className="flex justify-center mb-2 sm:mb-4">
                    <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-green-50 text-green-700 rounded-full text-xs sm:text-sm font-semibold border border-green-100">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Access Key Verified
                    </div>
                  </div>

                  {/* Input with icon */}
                  <div className="relative group">
                    <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2b6e2b] transition-colors">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={serviceId}
                      onChange={(e) => { setServiceId(e.target.value); setError(''); }}
                      className="w-full bg-white border-2 border-gray-200 text-gray-900 pl-12 sm:pl-14 pr-4 sm:pr-5 py-4 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg font-mono text-center focus:border-[#2b6e2b] focus:ring-4 focus:ring-green-50 outline-none transition-all placeholder-gray-300"
                      placeholder="Service Number"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="flex items-center justify-center gap-2 text-red-500 text-xs sm:text-sm bg-red-50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !serviceId}
                    className="w-full bg-[#2b6e2b]/90 hover:bg-[#2b6e2b] text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-green-900/20 hover:shadow-green-900/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 sm:gap-3 group"
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Starting Session...</span>
                      </>
                    ) : (
                      <>
                        <span>Start Shopping</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep(1); setAccessCode(''); setError(''); }}
                    className="w-full text-gray-400 text-xs sm:text-sm hover:text-gray-600 transition-colors py-2"
                  >
                    ← Use different access key
                  </button>
                </form>
              )}
            </div>

            {/* Modal Footer - Clean and minimal */}
            <div className="px-5 sm:px-8 py-4 sm:py-5 bg-gray-50/80 border-t border-gray-100">
              <p className="text-center text-xs sm:text-sm text-gray-400">
                Need access? Visit the reception desk for your access key
              </p>
            </div>
          </div>
        </div>
      </div>

      </div>
  );
};

export default AuthScreen;