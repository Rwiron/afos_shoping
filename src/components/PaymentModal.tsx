import React, { useState, useEffect, useRef } from 'react'
import { formatCurrency } from './currency'
import { CartItem } from '../types'

interface PaymentModalProps {
  total: number
  paymentMethod: 'zigama' | 'momo'
  cart: CartItem[]
  userName: string
  userQuota: number
  onClose: () => void
  onSuccess: () => void
  onLogout: () => void
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  total, 
  paymentMethod, 
  cart, 
  userName, 
  userQuota,
  onClose, 
  onSuccess,
  onLogout 
}) => {
  const [step, setStep] = useState<'processing' | 'success' | 'receipt'>('processing')
  const receiptRef = useRef<HTMLDivElement>(null)
  const transactionId = `TXN${Date.now().toString().slice(-8)}`
  const receiptNo = `RCP${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  useEffect(() => {
    // Simulate payment processing
    const processingTimer = setTimeout(() => {
      setStep('success')
    }, 2500)
    return () => clearTimeout(processingTimer)
  }, [])

  useEffect(() => {
    if (step === 'success') {
      const successTimer = setTimeout(() => {
        setStep('receipt')
        // Don't call onSuccess here - wait for user to print receipt
      }, 2000)
      return () => clearTimeout(successTimer)
    }
  }, [step])

  const handlePrint = () => {
    const formattedDate = new Date().toLocaleDateString('en-RW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    const formattedTime = new Date().toLocaleTimeString('en-RW', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const receiptWindow = window.open('', '_blank', 'width=320,height=600')
    if (!receiptWindow) {
      alert('Please allow popups to print the receipt')
      return
    }

    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AFOS Receipt - ${receiptNo}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      background: #f5f5f5;
      padding: 10px;
    }
    
    .receipt {
      width: 280px;
      background: white;
      padding: 20px 15px;
      margin: 0 auto;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .header {
      text-align: center;
      border-bottom: 2px dashed #333;
      padding-bottom: 15px;
      margin-bottom: 15px;
    }
    
    .logo { font-size: 28px; font-weight: 700; letter-spacing: 4px; margin-bottom: 5px; }
    .store-name { font-size: 10px; letter-spacing: 2px; color: #666; margin-bottom: 8px; }
    .branch { font-size: 11px; font-weight: 500; }
    
    .section { margin-bottom: 15px; }
    .section-title { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: #666; margin-bottom: 8px; text-transform: uppercase; }
    
    .info-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px; }
    .info-label { color: #666; }
    .info-value { font-weight: 500; }
    
    .divider { border-top: 1px dashed #ccc; margin: 12px 0; }
    .divider-double { border-top: 2px dashed #333; margin: 15px 0; }
    
    .items-header {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-weight: 700;
      color: #666;
      padding-bottom: 5px;
      border-bottom: 1px solid #eee;
      margin-bottom: 8px;
    }
    
    .item { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 11px; }
    .item-name { flex: 1; padding-right: 10px; }
    .item-qty { width: 30px; text-align: center; }
    .item-price { width: 70px; text-align: right; font-weight: 500; }
    
    .total-section { background: #f8f8f8; padding: 12px; margin: 0 -15px; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
    .total-row.grand { font-size: 16px; font-weight: 700; margin-top: 8px; padding-top: 8px; border-top: 2px solid #333; }
    
    .payment-method { text-align: center; padding: 10px; background: #e8f5e9; margin: 15px -15px; font-weight: 500; color: #2e7d32; }
    
    .quota-box { text-align: center; padding: 10px; border: 2px dashed #2b6e2b; margin-bottom: 15px; }
    .quota-label { font-size: 10px; color: #666; margin-bottom: 3px; }
    .quota-value { font-size: 14px; font-weight: 700; color: #2b6e2b; }
    
    .barcode { text-align: center; margin: 15px 0; font-size: 8px; letter-spacing: 2px; }
    
    .footer { text-align: center; padding-top: 15px; border-top: 2px dashed #333; }
    .thank-you { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
    .footer-text { font-size: 9px; color: #666; line-height: 1.6; }
    
    .receipt-id { font-size: 10px; color: #999; text-align: center; margin-top: 10px; }
    
    @media print {
      body { background: white; padding: 0; }
      .receipt { box-shadow: none; width: 100%; max-width: 280px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <div class="logo">AFOS</div>
      <div class="store-name">ARMED FORCES SHOP</div>
    </div>
    
    <div class="section">
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${formattedDate}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Time:</span>
        <span class="info-value">${formattedTime}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Receipt #:</span>
        <span class="info-value">${receiptNo}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Transaction:</span>
        <span class="info-value">${transactionId}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Customer:</span>
        <span class="info-value">${userName}</span>
      </div>
    </div>
    
    <div class="divider-double"></div>
    
    <div class="section">
      <div class="items-header">
        <span>ITEM</span>
        <span>QTY</span>
        <span>PRICE</span>
      </div>
      ${cart.map(item => {
        const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price
        return `
        <div class="item">
          <span class="item-name">${item.name}${item.discount ? ' (-' + item.discount + '%)' : ''}</span>
          <span class="item-qty">${item.quantity}</span>
          <span class="item-price">${(itemPrice * item.quantity).toLocaleString()}</span>
        </div>
        `
      }).join('')}
    </div>
    
    <div class="total-section">
      <div class="total-row">
        <span>Subtotal</span>
        <span>${total.toLocaleString()} Rwf</span>
      </div>
      <div class="total-row">
        <span>Tax (0%)</span>
        <span>0 Rwf</span>
      </div>
      <div class="total-row grand">
        <span>TOTAL</span>
        <span>${total.toLocaleString()} Rwf</span>
      </div>
    </div>
    
    <div class="payment-method">
      ✓ PAID VIA ${paymentMethod === 'zigama' ? 'ZIGAMA PAY' : 'MOBILE MONEY'}
    </div>
    
    <div class="quota-box">
      <div class="quota-label">REMAINING QUOTA</div>
      <div class="quota-value">${remainingQuota.toLocaleString()} Rwf</div>
    </div>
    
    <div class="barcode">
      <div>||||| |||| ||||| |||| ||||| ||||</div>
      <div>${receiptNo}</div>
    </div>
    
    <div class="footer">
      <div class="thank-you">Thank You!</div>
      <div class="footer-text">
        Serving those who serve<br>
        www.afos.rw<br>
        Customer Care: 0788 000 000
      </div>
    </div>
    
    <div class="receipt-id">
      Generated: ${new Date().toISOString()}
    </div>
  </div>
  
  <div class="no-print" style="text-align: center; margin-top: 20px;">
    <button onclick="window.print()" style="
      padding: 12px 30px;
      font-size: 14px;
      font-weight: bold;
      background: #2b6e2b;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    ">
      🖨️ Print Receipt
    </button>
    <button onclick="window.close()" style="
      padding: 12px 30px;
      font-size: 14px;
      font-weight: bold;
      background: #666;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      margin-left: 10px;
    ">
      Close
    </button>
  </div>
  
  <script>
    setTimeout(() => { window.print(); }, 500);
  </script>
</body>
</html>
    `

    receiptWindow.document.write(receiptHTML)
    receiptWindow.document.close()
        
    // Clear cart and auto logout after printing
    setTimeout(() => {
      onSuccess() // Clear the cart
      onLogout()  // Logout user
    }, 1000)
  }

  const remainingQuota = userQuota - total

  const paymentInfo = {
    zigama: {
      name: 'Zigama Pay',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      bgColor: 'bg-[#2b6e2b]',
      description: 'Military Banking Service',
    },
    momo: {
      name: 'Mobile Money',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: 'bg-yellow-500',
      description: 'MTN / Airtel Money',
    },
  }

  const currentPayment = paymentInfo[paymentMethod]
  const currentDateTime = new Date()

  // Receipt Screen
  if (step === 'receipt') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Receipt Header */}
          <div className="p-4 bg-[#2b6e2b] text-white text-center">
            <h2 className="text-lg font-bold">Payment Receipt</h2>
            <p className="text-white/70 text-sm">Transaction Complete</p>
          </div>

          {/* Printable Receipt Content */}
          <div ref={receiptRef} className="flex-1 overflow-y-auto p-6">
            <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-gray-300">
              <div className="w-12 h-12 bg-[#2b6e2b] rounded-lg flex items-center justify-center mx-auto mb-2 text-white font-bold text-xl">A</div>
              <h3 className="font-bold text-gray-900">AFOS Base Supply</h3>
              <p className="text-xs text-gray-500">Armed Forces Official Shop</p>
              <p className="text-xs text-gray-400 mt-1">{currentDateTime.toLocaleString()}</p>
            </div>

            {/* Customer Info */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Customer:</span>
                <span className="font-medium text-gray-900">{userName}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Receipt No:</span>
                <span className="font-mono text-gray-900">{receiptNo}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono text-gray-900">{transactionId}</span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Items Purchased</h4>
              {cart.map((item) => {
                const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price
                return (
                  <div key={item.cartId} className="flex justify-between text-sm py-1">
                    <div className="flex-1">
                      <span className="text-gray-900">{item.name}</span>
                      <span className="text-gray-400 ml-1">x{item.quantity}</span>
                      {item.discount && (
                        <span className="text-red-500 text-xs ml-1">(-{item.discount}%)</span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{formatCurrency(itemPrice * item.quantity)}</span>
                  </div>
                )
              })}
            </div>

            {/* Totals */}
            <div className="mb-4 pb-4 border-b-2 border-dashed border-gray-300">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900">Total Paid</span>
                <span className="text-[#2b6e2b]">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-medium text-gray-900">{currentPayment.name}</span>
              </div>
            </div>

            {/* Quota Info */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Previous Quota:</span>
                <span className="font-medium text-gray-900">{formatCurrency(userQuota)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Amount Used:</span>
                <span className="font-medium text-red-500">-{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1 pt-2 border-t border-gray-200">
                <span className="text-gray-700 font-medium">Remaining Quota:</span>
                <span className="font-bold text-[#2b6e2b]">{formatCurrency(remainingQuota)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400">
              <p>Thank you for shopping with us!</p>
              <p className="mt-1">Keep this receipt for your records</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handlePrint}
              className="w-full py-3 bg-[#2b6e2b] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#1e4d1e] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Receipt & Finish
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">You will be logged out after printing</p>
          </div>
        </div>
      </div>
    )
  }

  // Success Screen
  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-xl">
        <div className="text-center p-12">
          <div className="w-24 h-24 bg-[#2b6e2b] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30 animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-[#2b6e2b] font-bold text-xl mb-2">{formatCurrency(total)}</p>
          <p className="text-gray-500">via {currentPayment.name}</p>
          <p className="text-gray-400 text-sm mt-4">Preparing receipt...</p>
        </div>
      </div>
    )
  }

  // Processing Screen
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-[#2b6e2b] to-[#1e4d1e] text-white text-center">
          <div className={`w-16 h-16 ${currentPayment.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            {currentPayment.icon}
          </div>
          <h3 className="text-lg font-bold">{currentPayment.name}</h3>
          <p className="text-white/70 text-sm">{currentPayment.description}</p>
        </div>

        {/* Amount */}
        <div className="p-6 text-center border-b border-gray-100">
          <p className="text-gray-500 text-sm mb-1">Amount to Pay</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(total)}</p>
        </div>

        {/* Processing Animation */}
        <div className="p-8 flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#2b6e2b] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Processing Payment</h3>
          <p className="text-gray-500 text-sm text-center">
            {paymentMethod === 'zigama' 
              ? 'Connecting to Zigama Pay...' 
              : 'Waiting for Mobile Money confirmation...'}
          </p>
        </div>

        {/* Cancel Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 text-gray-500 font-medium hover:text-red-500 transition-colors"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal