import React, { useState, useMemo, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { MENU_ITEMS } from './constants'
import { MenuItem, Category, CartItem, UserProfile } from './types'
import ProductCard from './components/ProductCard'
import CartSidebar, { PaymentMethod } from './components/CartSidebar'
import PaymentModal from './components/PaymentModal'
import AuthScreen from './components/AuthScreen'
import Scanner from './components/Scanner'
import { formatCurrency } from './components/currency'

const CATEGORIES: Category[] = [
  'All',
  'Food & Groceries',
  'Cooking & Gas',
  'Hygiene & Care',
  'Kitchen Items',
  'Appliances',
  'Household',
]

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('zigama')
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false)

  // Date State
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsLoadingProducts(true);
    const timer = setTimeout(() => {
      setIsLoadingProducts(false);
    }, 400); 
    return () => clearTimeout(timer);
  }, [selectedCategory, user]);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, cartId: `${item.id}-${Date.now()}` }];
    });
  };

  const handleScanItem = (item: MenuItem) => {
    addToCart(item);
    setIsScannerOpen(false);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckoutSuccess = () => {
    setCart([]);
    setIsPaymentOpen(false);
  };

  const getItemQuantity = (itemId: string) => {
     return cart.find(i => i.id === itemId)?.quantity || 0;
  };

  // Calculate current cart total and remaining quota
  const cartTotal = cart.reduce((sum, item) => {
    const discountedPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price
    return sum + discountedPrice * item.quantity
  }, 0)
  const remainingQuota = user ? user.balance - cartTotal : 0

  if (!user) {
    return <AuthScreen onAuthenticated={setUser} />;
  }

  return (
    <div className="flex h-screen bg-[#f3f4f6] text-gray-900 font-sans overflow-hidden p-4 gap-4">
      
      {/* Left Sidebar (Navigation) */}
      <aside className="w-64 bg-white rounded-2xl shadow-sm flex-col py-6 hidden md:flex z-20">
         <div className="px-6 mb-10 flex items-center gap-3">
             <div className="w-8 h-8 bg-[#2b6e2b] rounded-lg flex items-center justify-center text-white font-bold">A</div>
             <div>
                <h1 className="font-bold text-gray-900 leading-none">AFOS POS</h1>
                <p className="text-xs text-gray-400">Armed Forces Shop</p>
             </div>
         </div>

         <nav className="flex-1 px-4 space-y-1">
            <button onClick={() => setSelectedCategory('All')} className="w-full">
              <NavItem icon={<MenuIcon />} label="All Products" active={selectedCategory === 'All'} />
            </button>
            
            {/* Discounts Link */}
            <Link to="/discounts" className="w-full block">
              <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all bg-gradient-to-r from-red-50 to-orange-50 text-red-600 hover:from-red-100 hover:to-orange-100 border border-red-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Special Discounts</span>
                <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">Hot</span>
              </div>
            </Link>
            
            <div className="pt-6 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</div>
            <button onClick={() => setSelectedCategory('Food & Groceries')} className="w-full">
              <NavItem icon={<GroceryIcon />} label="Food & Groceries" active={selectedCategory === 'Food & Groceries'} />
            </button>
            <button onClick={() => setSelectedCategory('Cooking & Gas')} className="w-full">
              <NavItem icon={<GasIcon />} label="Cooking & Gas" active={selectedCategory === 'Cooking & Gas'} />
            </button>
            <button onClick={() => setSelectedCategory('Hygiene & Care')} className="w-full">
              <NavItem icon={<HygieneIcon />} label="Hygiene & Care" active={selectedCategory === 'Hygiene & Care'} />
            </button>
            <button onClick={() => setSelectedCategory('Kitchen Items')} className="w-full">
              <NavItem icon={<KitchenIcon />} label="Kitchen Items" active={selectedCategory === 'Kitchen Items'} />
            </button>
            <button onClick={() => setSelectedCategory('Appliances')} className="w-full">
              <NavItem icon={<ApplianceIcon />} label="Appliances" active={selectedCategory === 'Appliances'} />
            </button>
            <button onClick={() => setSelectedCategory('Household')} className="w-full">
              <NavItem icon={<HomeIcon />} label="Household" active={selectedCategory === 'Household'} />
            </button>
         </nav>

         <div className="px-4 mt-auto space-y-1">
            <NavItem icon={<CogIcon />} label="Settings" />
            <button onClick={() => setUser(null)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors">
               <LogoutIcon />
               <span>Logout</span>
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Top Header */}
        <header className="px-8 py-4 bg-white border-b border-gray-100 flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="md:hidden">
                 {/* Mobile Menu Button */}
                 <button className="p-2 -ml-2"><MenuIcon /></button>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full border border-gray-100">
                  <div className="w-7 h-7 rounded-full bg-[#2b6e2b] overflow-hidden flex items-center justify-center text-white text-xs font-bold">
                     {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <span className="text-sm font-bold text-gray-700">{user.name}</span>
              </div>
              {/* Quota Display */}
              <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                  <svg className="w-4 h-4 text-[#2b6e2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-sm font-bold text-[#2b6e2b]">Quota: {formatCurrency(user.balance)}</span>
              </div>
           </div>

           <div className="flex items-center gap-4">
               <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-sm font-medium text-gray-600">
                  <CalendarIcon />
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })} at {currentDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
               </div>
               
               <button onClick={() => setIsScannerOpen(true)} className="p-2 hover:bg-gray-50 rounded-lg border border-gray-200 text-gray-600">
                  <ScanIcon />
               </button>
               
               <button onClick={() => setIsMobileCartOpen(!isMobileCartOpen)} className="lg:hidden p-2 hover:bg-gray-50 rounded-lg border border-gray-200 text-gray-600 relative">
                  <ShoppingBagIcon />
                  {cart.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
               </button>
           </div>
        </header>

        {/* Filters & Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
           {/* Filter Bar */}
           <div className="px-8 py-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex items-center gap-3 overflow-x-auto w-full pb-2 md:pb-0 hide-scrollbar">
                 <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm font-bold text-gray-700 whitespace-nowrap">
                    <BookIcon />
                    Products
                 </div>
                 <div className="h-6 w-px bg-gray-300 mx-2"></div>
                 
                 {CATEGORIES.map(cat => (
                    <button
                       key={cat}
                       onClick={() => setSelectedCategory(cat)}
                       className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2
                       ${selectedCategory === cat 
                          ? 'bg-[#2b6e2b] text-white shadow-md' 
                          : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-300'}`}
                    >
                       {cat}
                       <span className={`text-[10px] py-0.5 px-1.5 rounded-md ${selectedCategory === cat ? 'bg-[#1e4d1e] text-white' : 'bg-gray-100 text-gray-500'}`}>
                          {cat === 'All' ? MENU_ITEMS.length : MENU_ITEMS.filter(i => i.category === cat).length}
                       </span>
                    </button>
                 ))}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                 <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">
                    <RefreshIcon />
                    Refresh
                 </button>
                 <div className="flex-1 md:w-64 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                       <SearchIcon />
                    </div>
                    <input 
                       type="text" 
                       placeholder="Search Products" 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-gray-400"
                    />
                 </div>
              </div>
           </div>

           {/* Grid */}
           <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar bg-gray-50/50">
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 pt-2">
                  {isLoadingProducts 
                     ? Array.from({ length: 8 }).map((_, idx) => <ProductCard key={idx} loading={true} />)
                     : filteredItems.map(item => (
                        <ProductCard 
                           key={item.id} 
                           item={item} 
                           onAdd={addToCart} 
                           cartQuantity={getItemQuantity(item.id)}
                           remainingQuota={remainingQuota}
                        />
                     ))
                  }
               </div>
           </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <CartSidebar 
         cart={cart}
         userQuota={user.balance}
         onUpdateQuantity={updateQuantity}
         onCheckout={(paymentMethod) => {
           setSelectedPaymentMethod(paymentMethod)
           setIsPaymentOpen(true)
         }}
         onRemove={(id) => updateQuantity(id, -1000)}
         isOpen={isMobileCartOpen} 
         onClose={() => setIsMobileCartOpen(false)}
      />

      {isPaymentOpen && (
        <PaymentModal 
          total={cart.reduce((sum, item) => {
            const discountedPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price
            return sum + discountedPrice * item.quantity
          }, 0)}
          paymentMethod={selectedPaymentMethod}
          cart={cart}
          userName={user.name}
          userQuota={user.balance}
          onClose={() => setIsPaymentOpen(false)}
          onSuccess={handleCheckoutSuccess}
          onLogout={() => setUser(null)}
        />
      )}

      {isScannerOpen && (
        <Scanner 
          onScan={handleScanItem} 
          onClose={() => setIsScannerOpen(false)} 
        />
      )}
    </div>
  );
};

// --- Icons Components for cleanliness ---
const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
   <div className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-xl
      ${active ? 'text-[#2b6e2b] bg-green-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
      <span className={active ? 'text-[#2b6e2b]' : 'text-gray-400'}>{icon}</span>
      <span>{label}</span>
      {active && <span className="ml-auto w-2 h-2 bg-[#2b6e2b] rounded-full"></span>}
   </div>
);

const MenuIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const GroceryIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const GasIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>;
const HygieneIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const KitchenIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const ApplianceIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const HomeIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CogIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const CalendarIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ScanIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>;
const ShoppingBagIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const BookIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const RefreshIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
const SearchIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

export default App;