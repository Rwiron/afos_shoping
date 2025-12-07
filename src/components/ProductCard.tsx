import React from 'react'
import { MenuItem } from '../types'
import { formatCurrency } from './currency'

interface ProductCardProps {
  item?: MenuItem
  onAdd?: (item: MenuItem) => void
  loading?: boolean
  cartQuantity?: number
  remainingQuota?: number // User's remaining quota after current cart
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onAdd, loading, cartQuantity = 0, remainingQuota = Infinity }) => {
  if (loading || !item) {
    return (
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 h-full flex flex-col animate-pulse">
        <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3"></div>
        <div className="h-4 bg-gray-100 w-3/4 rounded mb-2"></div>
        <div className="h-4 bg-gray-100 w-1/4 rounded mb-auto"></div>
        <div className="mt-3 h-10 w-full bg-gray-100 rounded-lg"></div>
      </div>
    )
  }

  const isAvailable = item.stock > 0
  const hasDiscount = item.discount && item.discount > 0
  const discountedPrice = hasDiscount ? item.price * (1 - item.discount! / 100) : item.price
  const exceedsQuota = discountedPrice > remainingQuota

  return (
    <div className="bg-white rounded-xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col h-full group hover:shadow-md transition-shadow">
      {/* Image Area */}
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-gray-50">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-sm">
              -{item.discount}%
            </span>
          </div>
        )}
        
        {/* Stock Badge */}
        <div className="absolute top-2 left-2">
          {exceedsQuota && isAvailable ? (
            <span className="px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm bg-orange-500 text-white">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Over Quota
            </span>
          ) : (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm
              ${isAvailable ? 'bg-[#2b6e2b] text-white' : 'bg-gray-500 text-white'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              {isAvailable ? 'In Stock' : 'Out of Stock'}
            </span>
          )}
        </div>
        
        {/* Add to Cart Icon Button - disabled if exceeds quota */}
        {isAvailable && !exceedsQuota && (
          <button 
            onClick={() => onAdd && onAdd(item)}
            className={`absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95
              ${cartQuantity > 0 
                ? 'bg-white border-2 border-[#2b6e2b] text-[#2b6e2b]' 
                : 'bg-[#2b6e2b] text-white hover:bg-[#1e4d1e]'}`}
          >
            {cartQuantity > 0 ? (
              <span className="text-sm font-bold">{cartQuantity}</span>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        )}
        
        {/* Disabled button indicator for over quota */}
        {isAvailable && exceedsQuota && (
          <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 text-gray-500 cursor-not-allowed">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{item.name}</h3>
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{item.description}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2b6e2b] text-lg">{formatCurrency(discountedPrice)}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">{formatCurrency(item.price)}</span>
            )}
          </div>
          {!isAvailable && (
            <span className="text-xs text-red-500 font-medium">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard