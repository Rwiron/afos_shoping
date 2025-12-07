import { cn } from '@/lib/utils'

type CurrencyProps = {
  amount: number
  className?: string
  showDecimals?: boolean
}

/**
 * Formats and displays currency in Rwandan Franc (Rwf)
 * Format: 1,000,000 Rwf
 */
export function Currency({ amount, className, showDecimals = false }: CurrencyProps) {
  const formatted = new Intl.NumberFormat('en-RW', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount)

  return (
    <span className={cn('whitespace-nowrap', className)}>
      {formatted} Rwf
    </span>
  )
}

/**
 * Utility function to format currency as string
 * Returns: "1,000,000 Rwf"
 */
export function formatCurrency(amount: number, showDecimals = false): string {
  const formatted = new Intl.NumberFormat('en-RW', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount)

  return `${formatted} Rwf`
}
