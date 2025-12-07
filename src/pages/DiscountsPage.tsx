import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { MENU_ITEMS } from '../constants'
import { formatCurrency } from '../components/currency'

// Query function to get discounted products
const fetchDiscountedProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return MENU_ITEMS.filter(item => item.discount && item.discount > 0)
}

export default function DiscountsPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeIndex, setActiveIndex] = useState(0)

  const { data: discountedProducts, isLoading } = useQuery({
    queryKey: ['discounted-products'],
    queryFn: fetchDiscountedProducts,
    refetchInterval: 30000,
  })

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!discountedProducts?.length) return
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % discountedProducts.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [discountedProducts?.length])

  const maxDiscount = discountedProducts?.reduce((max, p) => Math.max(max, p.discount || 0), 0) || 0

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 overflow-hidden relative font-sans">
      
      {/* Background Image with Overlay - Clean & Light */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-5 grayscale"
        style={{ backgroundImage: `url('/images/bg1.jpg')` }} 
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-50/95 via-white/80 to-slate-100/95" />

      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scale-gentle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-slideIn { animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .animate-scale-gentle { animation: scale-gentle 4s ease-in-out infinite; }
      `}</style>

      {/* Top Marquee - Announcement at the Top */}
      <div className="relative z-50 bg-[#2b6e2b] text-white py-3 overflow-hidden shadow-lg">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 mx-8">
              <span className="text-sm font-bold tracking-widest uppercase">🏷️ Up to {maxDiscount}% OFF</span>
              <span className="text-sm opacity-50">•</span>
              <span className="text-sm font-bold tracking-widest uppercase">⭐ Exclusive Military Discounts</span>
              <span className="text-sm opacity-50">•</span>
              <span className="text-sm font-bold tracking-widest uppercase">� Armed Forces Official Shop</span>
              <span className="text-sm opacity-50">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 max-w-[1920px] mx-auto p-8 h-[calc(100vh-48px)] flex flex-col">
        
        {/* Header Section */}
        <header className="flex items-center justify-between mb-8 animate-fadeIn">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg shadow-slate-200 border border-slate-100 flex items-center justify-center overflow-hidden">
              <img src="/images/AFSCIRCLE.png" alt="AFOS" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">AFOS</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2b6e2b] animate-pulse"></span>
                <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">Armed Forces Official Shop</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-6xl font-black text-[#2e3086] tabular-nums tracking-tighter leading-none">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              <span className="text-2xl text-[#2e3086]/50 font-bold ml-1">
                 {currentTime.getSeconds().toString().padStart(2, '0')}
              </span>
            </div>
            <p className="text-[#2e3086]/70 font-medium mt-1 uppercase tracking-wider text-sm">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        {/* Content Grid */}
        <div className="flex-1 flex gap-8 min-h-0">
          
          {/* Left Column: Featured Hero Product */}
          <div className="w-5/12 flex flex-col h-full">
            {discountedProducts && discountedProducts[activeIndex] && (
              <div 
                key={discountedProducts[activeIndex].id}
                className="flex-1 bg-[#efd798] rounded-[2.5rem] shadow-2xl shadow-amber-200/50 border border-[#efd798] p-10 flex flex-col animate-slideIn relative overflow-hidden group"
              >
                {/* Background decorative blob */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-1000" />
                
                {/* Badge */}
                <div className="absolute top-8 left-8 z-20">
                  <div className="bg-red-600 text-white px-5 py-2.5 rounded-full shadow-lg shadow-red-500/20 animate-scale-gentle flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <span className="font-bold tracking-wide">FLASH DEAL</span>
                  </div>
                </div>

                {/* Product Image */}
                <div className="flex-1 relative flex items-center justify-center z-10 mt-8">
                  {/* Image Container - Rounded with clipped image */}
                  <div className="relative w-full max-w-[90%]">
                    {/* Image with rounded corners */}
                    <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-100">
                      <img
                        src={discountedProducts[activeIndex].image}
                        alt={discountedProducts[activeIndex].name}
                        className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Discount Sticker - Sticks to bottom-right of image card */}
                    <div className="absolute -bottom-5 -right-5 bg-slate-900 text-white w-24 h-24 rounded-full flex items-center justify-center flex-col shadow-2xl z-20 rotate-12 group-hover:rotate-0 transition-all duration-500 border-4 border-white">
                      <span className="text-2xl font-black leading-none">-{discountedProducts[activeIndex].discount}%</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">OFF</span>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="mt-8 z-10">
                  <p className="text-[#2b6e2b] font-bold uppercase tracking-widest text-xs mb-3">
                    {discountedProducts[activeIndex].category}
                  </p>
                  <h2 className="text-4xl font-black text-slate-900 leading-tight mb-6 line-clamp-2">
                    {discountedProducts[activeIndex].name}
                  </h2>
                  
                  <div className="flex items-end justify-between border-t border-slate-100 pt-6">
                    <div>
                      <p className="text-slate-400 text-sm font-medium mb-1 line-through decoration-red-400">
                        WAS {formatCurrency(discountedProducts[activeIndex].price)}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-[#2b6e2b] tracking-tight">
                          {formatCurrency(discountedProducts[activeIndex].price * (1 - (discountedProducts[activeIndex].discount || 0) / 100))}
                        </span>
                      </div>
                    </div>
                    
                    {/* Digital Signage Indicator */}
                    <div className="px-6 py-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-slate-500 font-bold tracking-wide text-sm uppercase">Available In Store</span>
                    </div>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2 z-20">
                  {discountedProducts.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 rounded-full transition-all duration-500 ${
                        idx === activeIndex ? 'h-8 bg-slate-900' : 'h-2 bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Grid */}
          <div className="w-7/12 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="text-2xl font-bold text-slate-800">More Great Deals</h3>
              <div className="bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100 text-sm font-medium text-slate-500">
                Refreshing in 30s
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 pb-4 scroll-smooth">
               {isLoading ? (
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-pulse">
                        <div className="h-40 bg-slate-100 rounded-xl mb-4" />
                        <div className="h-6 bg-slate-100 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-slate-100 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-5">
                    {discountedProducts?.map((product, idx) => {
                      const isActive = idx === activeIndex
                      const discountedPrice = product.price * (1 - (product.discount || 0) / 100)

                      return (
                        <div
                          key={product.id}
                          className={`group relative bg-[#efd798] rounded-3xl p-5 border transition-all duration-500 flex gap-4 items-center ${
                            isActive 
                              ? 'border-[#2b6e2b] ring-2 ring-[#2b6e2b] shadow-xl shadow-green-900/10 scale-[1.01]' 
                              : 'border-[#efd798] shadow-lg shadow-amber-200/50 hover:border-amber-300'
                          }`}
                        >
                          {/* Image Thumbnail */}
                          <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden">
                             <div className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md z-10">
                              -{product.discount}%
                            </div>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              {product.category}
                            </p>
                            <h4 className="font-bold text-slate-900 text-lg leading-tight truncate mb-3 group-hover:text-[#2b6e2b] transition-colors">
                              {product.name}
                            </h4>
                            
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-black text-[#2b6e2b]">
                                {formatCurrency(discountedPrice)}
                              </span>
                              <div className="flex flex-col leading-none">
                                <span className="text-xs text-slate-400 line-through decoration-red-400">
                                  {formatCurrency(product.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Active Indicator Arrow */}
                          {isActive && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2b6e2b] animate-bounce">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
