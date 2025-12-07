import React, { useState } from 'react'
import { CartItem } from '../types'
import { formatCurrency } from './currency'

export type PaymentMethod = 'zigama' | 'momo'

interface CartSidebarProps {
  cart: CartItem[]
  userQuota: number
  onUpdateQuantity: (id: string, delta: number) => void
  onCheckout: (paymentMethod: PaymentMethod) => void
  onRemove: (id: string) => void
  isOpen: boolean
  onClose: () => void
}

const CartSidebar: React.FC<CartSidebarProps> = ({ cart, userQuota, onUpdateQuantity, onCheckout, onRemove, isOpen, onClose }) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('zigama')
  
  // Calculate subtotal (original prices)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  // Calculate total discount from products with discounts
  const totalDiscount = cart.reduce((sum, item) => {
    if (item.discount && item.discount > 0) {
      return sum + (item.price * item.discount / 100) * item.quantity
    }
    return sum
  }, 0)
  
  // Final total (subtotal minus discounts)
  const total = subtotal - totalDiscount

  const content = (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm">
      {/* Header */}
      <div className="p-6 pb-4">
         <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            <span className="text-xs text-gray-400 font-mono">#B12309</span>
         </div>
         <button className="md:hidden text-gray-400" onClick={onClose}>Close</button>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
         {cart.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-center opacity-40">
               <p className="text-gray-500 font-medium text-sm">No items added</p>
            </div>
         ) : (
            <div className="space-y-4">
               {cart.map((item) => {
                  const hasDiscount = item.discount && item.discount > 0
                  const discountedPrice = hasDiscount ? item.price * (1 - item.discount! / 100) : item.price
                  const itemTotal = discountedPrice * item.quantity
                  
                  return (
                  <div key={item.cartId} className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
                     <div className="relative w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        {hasDiscount && (
                           <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded">
                              -{item.discount}%
                           </div>
                        )}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="text-sm font-bold text-gray-900 truncate pr-2">{item.name}</h4>
                           <span className="text-sm font-bold text-[#2b6e2b]">{formatCurrency(itemTotal)}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-xs text-gray-500">{formatCurrency(discountedPrice)}</span>
                           {hasDiscount && (
                              <span className="text-[10px] text-gray-400 line-through">{formatCurrency(item.price)}</span>
                           )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                           {/* Quantity Controls */}
                           <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                              <button 
                                 onClick={() => onUpdateQuantity(item.cartId, -1)}
                                 className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                 </svg>
                              </button>
                              <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                              <button 
                                 onClick={() => onUpdateQuantity(item.cartId, 1)}
                                 className="w-7 h-7 rounded-md bg-[#2b6e2b] shadow-sm flex items-center justify-center text-white hover:bg-[#1e4d1e] transition-colors"
                              >
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                 </svg>
                              </button>
                           </div>
                           
                           {/* Delete Button */}
                           <button onClick={() => onRemove(item.cartId)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                           </button>
                        </div>
                     </div>
                  </div>
               )})}
            </div>
         )}
      </div>

      {/* Footer Section */}
      <div className="p-6 bg-gray-50/50 space-y-4">
         
         {/* Quota Status */}
         <div className={`rounded-xl p-3 ${total > userQuota ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <svg className={`w-5 h-5 ${total > userQuota ? 'text-red-500' : 'text-[#2b6e2b]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Your Quota</span>
               </div>
               <span className={`font-bold ${total > userQuota ? 'text-red-500' : 'text-[#2b6e2b]'}`}>{formatCurrency(userQuota)}</span>
            </div>
            {total > userQuota && (
               <p className="text-xs text-red-500 mt-2">⚠️ Order exceeds your quota by {formatCurrency(total - userQuota)}</p>
            )}
            {total > 0 && total <= userQuota && (
               <p className="text-xs text-gray-500 mt-2">Remaining after purchase: {formatCurrency(userQuota - total)}</p>
            )}
         </div>

         {/* Totals */}
         <div className="space-y-2 pt-2 border-t border-dashed border-gray-200">
            <div className="flex justify-between text-sm">
               <span className="text-gray-500">Subtotal</span>
               <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            {totalDiscount > 0 && (
               <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-bold text-green-500">-{formatCurrency(totalDiscount)}</span>
               </div>
            )}
            <div className="flex justify-between text-base pt-2 border-t border-gray-200">
               <span className="font-bold text-gray-900">Total</span>
               <span className="font-bold text-[#2b6e2b]">{formatCurrency(total)}</span>
            </div>
         </div>

         {/* Payment Method */}
         <div className="space-y-3">
            <span className="text-sm text-gray-600 font-medium">Payment Method</span>
            <div className="grid grid-cols-2 gap-3">
               {/* Zigama Pay */}
               <button 
                  type="button"
                  onClick={() => setSelectedPayment('zigama')}
                  className={`border-2 rounded-xl p-3 flex flex-col items-center gap-2 transition-all
                     ${selectedPayment === 'zigama' ? 'border-[#2b6e2b] bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
               >
                  <div className="w-10 h-10 rounded-full bg-[#2b6e2b] flex items-center justify-center">
                     <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                     </svg>
                  </div>
                  <span className="text-xs font-bold text-gray-900">Zigama Pay</span>
               </button>
               
               {/* Mobile Money */}
               <button 
                  type="button"
                  onClick={() => setSelectedPayment('momo')}
                  className={`border-2 rounded-xl p-3 flex flex-col items-center gap-2 transition-all
                     ${selectedPayment === 'momo' ? 'border-[#2b6e2b] bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
               >
                  <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                     <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                     </svg>
                  </div>
                  <span className="text-xs font-bold text-gray-900">MTN/Airtel</span>
               </button>
            </div>
         </div>

         {/* Savings Info */}
         {totalDiscount > 0 && (
            <div className="border border-green-200 rounded-xl p-3 bg-green-50 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2b6e2b] flex items-center justify-center">
                     <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs font-bold text-[#2b6e2b]">You're saving!</span>
                     <span className="text-[10px] text-gray-500">Discounts applied to your items</span>
                  </div>
               </div>
               <span className="text-sm font-bold text-[#2b6e2b]">{formatCurrency(totalDiscount)}</span>
            </div>
         )}

         <button
            onClick={() => onCheckout(selectedPayment)}
            disabled={cart.length === 0 || total > userQuota}
            className="w-full py-3.5 bg-[#2b6e2b] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#1e4d1e] transition-all disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
         >
            {total > userQuota ? 'Quota Exceeded' : 'Confirm Payment'}
         </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: Static Panel */}
      <aside className="hidden lg:block w-80 xl:w-96 flex-shrink-0 z-10">
        {content}
      </aside>

      {/* Mobile: Drawer */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
         <div 
            className={`absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
         />
         <div 
            className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
         >
            {content}
         </div>
      </div>
    </>
  );
};

export default CartSidebar;