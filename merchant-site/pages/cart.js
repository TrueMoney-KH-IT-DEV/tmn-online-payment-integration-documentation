import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCart } from 'react-use-cart'
import { loadStripe } from '@stripe/stripe-js'

import Button from '@/components/ui/button'
import {
  ChevronDownSmallIcon,
  ChevronUpSmallIcon,
  XSmallIcon
} from '@/components/icons'
import { formatCurrencyValue } from '@/utils/format-currency-value'
import getPageData from '@/lib/get-page-data'
import SEO from '@/components/seo'
import { useSettingsContext } from '@/context/settings'
import useSubmissionState from 'hooks/use-form-submission'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function Cart() {
  const {
    cartTotal,
    isEmpty,
    items,
    removeItem,
    updateItemQuantity
  } = useCart()
  const router = useRouter()
  const { activeCurrency } = useSettingsContext()
  const {
    setSubmissionError,
    setSubmissionLoading,
    submissionError,
    submissionLoading,
    submissionState
  } = useSubmissionState()

  const decrementItemQuantity = (item) =>
    updateItemQuantity(item.id, item.quantity - 1)

  const incrementItemQuantity = (item) =>
    updateItemQuantity(item.id, item.quantity + 1)

  const handleClick = async () => {
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJYNmh3U0VHNU1fWGZvN19LNmJsNDQ2QU50TDlpNjdYZnNTWDBYMjFEbS1NIn0.eyJleHAiOjE2Mzk0NTcwNTcsImlhdCI6MTYzOTQ1MzQ1NywianRpIjoiNGI3YzlmZmUtMDBmNS00MmUwLWI4YTktYjAzMjBiYTY1YTVlIiwiaXNzIjoiaHR0cHM6Ly9sb2NhbC1jaGFubmVsLWdhdGV3YXktc3RhZ2luZy5wdWJsaWMuYXNjZW5kbW9uZXktZGV2LmludGVybmFsL2F1dGgvcmVhbG1zL21tcyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJhZTU3NGJkZi1kMDc5LTQ5N2YtYjAyZi1jOTAxM2YyNDU3ZWQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJtZXJjaGFudC1uaGFtMjQiLCJzZXNzaW9uX3N0YXRlIjoiMDIzMmJmZTctNDM1NC00MjEyLWJlNjYtZWVhZWY2NDk0N2Y5IiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJhcGlfZnVsbFJlZnVuZFRyYW5zYWN0aW9uIiwib2ZmbGluZV9hY2Nlc3MiLCJhcGlfY2FuY2VsVHJhbnNhY3Rpb24iLCJhcGlfY3JlYXRlUVJDb2RlIiwiYXBpX2NhbmNlbE9yUmVmdW5kT3JkZXIiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImNsaWVudF9tZXJjaGFudCIsImFwaV9nZXRUcmFuc2FjdGlvblN0YXR1cyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiY3JlYXRlIiwiY2xpZW50SWQiOiJtZXJjaGFudC1uaGFtMjQiLCJjbGllbnRIb3N0IjoiMTAuMTQuMzAuMSIsImNsaWVudEFkZHJlc3MiOiIxMC4xNC4zMC4xIn0.d00EHTkYIvkU-zl2RfkjnXxx6gjQHYSq5WjNRuEw8RJAf8ZZG6jMZg3iON4ynIF50vbY-2JmK6_MDUe8D_Jj4jFCz71FTpLB6sEAwtHuuJYUKHx_g6r3qVt5sThOisDAuuxwNjDcSBGM0T40TDX4sdVkCTQ0TZxJIi3aybfJhlCV0o6GelBjUaQbtxv33WJDmPAOeaIDCK7f3hPKodgjQVg7JTs4OKs0CEz7R6ZRxJuT_2s37QCqwrjm2o3Ee3NZOB_yQlnkk2BXLN-LRTSL59RHo6nqym1m__R0qI9G1N0Bq15-fDsTDIS5FOySj86fJbOQsRHVM7lejTX53ke1NA'
    const payment_info = ''
    const singature = ''
    window.location.href = `https://local-channel-gateway-staging.dev.truemoney.com.kh/retail-payment/view/paymentcode?client_id=merchant-nham24&access_token=${token}&payment_info=%7B%22external_ref_id%22%3A%22TM_0000001%22,%22amount%22%3A1,%22currency%22%3A%22USD%22,%22user_type%22%3A%22CUSTOMER%22,%22description%22%3A%22UAT%22,%22metadata%22%3A%7B%22store_id%22%3A%2257%22,%22terminal_type%22%3A%22POS%22,%22terminal_id%22%3A%221%22%7D%7D&signature=algorithm%3Drsa-sha256%3BkeyVersion%3D1%3Bsignature%3DLmAk9peyLsdnBEGKVH8Hu0moxfZUiRkzSxLxuyB8vCKWvWDymJePzc2BbzuwOTuU%2FclvFKhBubm8J8%2FvJghnkulDobu0kCDd6vhCXSEOjWJSpp%2Bx8sa9p7fzGHpHExzduFfdq6x%2BfOlxHxygUkJjG%2Fg6QMxPtVBq05fHhoNMFgo%3D&timestamp=1637134468`
    console.log("Call webview here")
  }

  if (isEmpty) return <p>Your cart is empty</p>

  return (
    <React.Fragment>
      <SEO title="Cart" />
      {items.map((item) => {
        return (
          <div
            className="md:bg-gray-50 md:rounded-lg flex items-center py-3 md:py-6 md:px-6 md:mb-3"
            key={item.id}
          >
            <div className="w-3/5 flex flex-grow items-center">ß
              <div className="h-16 md:h-20 w-16 md:w-20 mr-4 bg-gray-50 p-1 rounded-lg">
                <Image
                  src={item.image.url}
                  width={item.image.width}
                  height={item.image.height}
                />
              </div>
              <div>
                <Link href={`/products/${item[router.locale].slug}`}>
                  <a className="text-gray-800 font-medium text-sm md:text-base">
                    {item[router.locale].name}
                  </a>
                </Link>
                <button
                  className="text-gray-400 hover:text-indigo-600 text-xs flex items-center focus:outline-none"
                  onClick={() => removeItem(item.id)}
                  disabled={submissionLoading}
                >
                  <XSmallIcon className="h-3 w-3" />
                  Remove
                </button>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-center ml-auto">
              <button
                className="text-gray-400 hover:text-indigo-600 focus:outline-none p-1"
                onClick={() => incrementItemQuantity(item)}
                disabled={submissionLoading}
              >
                <ChevronUpSmallIcon className="h-4 w-4" />
              </button>
              <span className="mx-3 md:mx-6 p-1">{item.quantity}</span>
              <button
                className="text-gray-400 hover:text-indigo-600 focus:outline-none p-1"
                onClick={() => decrementItemQuantity(item)}
                disabled={submissionLoading}
              >
                <ChevronDownSmallIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="text-right md:w-1/5">
              <p className="font-medium text-gray-800">
                {formatCurrencyValue({
                  currency: activeCurrency,
                  value: item.itemTotal
                })}
              </p>
              {item.quantity > 1 && (
                <p className="text-gray-400 text-sm">
                  {formatCurrencyValue({
                    currency: activeCurrency,
                    value: item.price
                  })}{' '}
                  each
                </p>
              )}
            </div>
          </div>
        )
      })}
      <div className="mt-3 md:mt-6 py-3 md:py-6 border-t-2 border-gray-50">
        <div className="flex flex-col items-end">
          <div className="flex flex-col items-end mb-3">
            <span className="text-gray-700">Sub total</span>
            <span className="text-xl font-bold text-indigo-600">
              {formatCurrencyValue({
                currency: activeCurrency,
                value: cartTotal
              })}
            </span>
          </div>
          <Button onClick={handleClick} disabled={submissionLoading}>
            Checkout
          </Button>
        </div>
      </div>
    </React.Fragment>
  )
}

export async function getStaticProps({ locale }) {
  const pageData = await getPageData({ locale })

  return {
    props: {
      ...pageData
    }
  }
}

export default Cart
