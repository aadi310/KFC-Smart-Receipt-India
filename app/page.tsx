"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  History,
  Instagram,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Star,
  User2,
  ThumbsUp,
  Share2,
  Facebook,
  Sparkles,
  MapPin,
  ShoppingBagIcon,
} from "lucide-react"

interface Receipt {
  id: string
  date: string
  time: string
  associate: string
  items: Array<{
    id: number
    name: string
    description: string
    price: number
    quantity: number
    category?: string
    taxApplicable?: boolean
    baseAmount?: number
    tax?: number
    itemCode?: string
    size?: string
    color?: string
    material?: string
  }>
  subtotal: number
  tax: number
  total: number
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showTerms, setShowTerms] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [expandedProducts, setExpandedProducts] = useState<number[]>([])
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: string[] }>({})
  const [currentReceiptId, setCurrentReceiptId] = useState("current")
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [showReferModal, setShowReferModal] = useState(false)
  const [showStoreLocation, setShowStoreLocation] = useState(false)
  const receiptContainerRef = useRef<HTMLDivElement>(null)
  const [feedback, setFeedback] = useState({
    service: 0,
    quality: 0,
    style: 0,
    pricing: 0,
    store: 0,
    comments: "",
  })
  const [profile, setProfile] = useState({
    mobile: "",
    name: "",
    email: "",
    gender: "",
  })
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")

  const customerName = "Ahmad"

  // Carousel refs and APIs
  const [promoApi, setPromoApi] = useState<CarouselApi>()
  const feedbackButtonRef = useRef<HTMLButtonElement>(null)
  const historyButtonRef = useRef<HTMLButtonElement>(null)
  const referButtonRef = useRef<HTMLButtonElement>(null)

  // Auto-play effect for promo carousel
  useEffect(() => {
    if (!promoApi) return
    const interval = setInterval(() => {
      promoApi.scrollNext()
    }, 4000)
    return () => clearInterval(interval)
  }, [promoApi])

  // Simple auto-height for WordPress iframe
  useEffect(() => {
    const postHeight = () => {
      const marker = document.getElementById("height-marker")
      if (marker && window.parent) {
        const rect = marker.getBoundingClientRect()
        const newHeight = Math.ceil(rect.top + rect.height + window.scrollY)
        window.parent.postMessage({ frameHeight: newHeight }, "*")
      }
    }

    // Run on load
    postHeight()

    // Observe changes to the DOM
    const ro = new ResizeObserver(postHeight)
    ro.observe(document.body)

    // Re-run on resize
    window.addEventListener("resize", postHeight)

    return () => {
      ro.disconnect()
      window.removeEventListener("resize", postHeight)
    }
  }, [])

  // Update current slide when carousel changes
  useEffect(() => {
    if (!promoApi) return
    promoApi.on("select", () => {
      setCurrentSlide(promoApi.selectedScrollSnap())
    })
  }, [promoApi])

  const receipts = {
  current: {
    id: "KFC-PLAZA-SING-71922864",
    date: "07-11-2025",
    time: "19:22:18",
    associate: "Nurul Aziz",
    branch: "Plaza Singapura",
    items: [
      {
        id: 0,
        name: "2-pc Chicken Variety Box",
        size: "Standard Box", // Portioned for 1 pax
        description: "2pcs Chicken (OR/HS), 1 Reg Whipped Potato, 1 Reg Coleslaw, 1 Pepsi Black",
        price: 10.95,
        quantity: 1,
        category: "Meals",
        taxApplicable: true,
        baseAmount: 10.05,
        tax: 0.90,
        itemCode: "BOX001",
        type: "Original Recipe",
      },
      {
        id: 1,
        name: "Zinger Burger",
        size: "Single Patty", // Standard burger size
        description: "Signature spicy chicken thigh burger with lettuce and mayo",
        price: 6.95,
        quantity: 1,
        category: "Burgers",
        taxApplicable: true,
        baseAmount: 6.38,
        tax: 0.57,
        itemCode: "B001",
        type: "Spicy",
      },
      {
        id: 2,
        name: "BBQ Cheese Fries",
        size: "Regular", // Standard side portion
        description: "Signature golden fries topped with cheese sauce and BBQ sauce",
        price: 5.20,
        quantity: 1,
        category: "Sides",
        taxApplicable: true,
        baseAmount: 4.77,
        tax: 0.43,
        itemCode: "S005",
        flavor: "BBQ Cheese",
      },
    ],
    subtotal: 21.19,
    tax: 1.91,
    total: 23.10,
  },
  hist1: {
    id: "KFC-VIVO-CITY-86448317",
    date: "20-10-2025",
    time: "14:22:18",
    associate: "Aisha Rahman",
    branch: "VivoCity",
    items: [
      {
        id: 0,
        name: "5-pc Chicken Bucket",
        size: "5-Piece Bucket", // Quantity based size
        description: "5 pieces of Chicken (Original Recipe / Hot & Crispy)",
        price: 18.50,
        quantity: 1,
        category: "Sharing",
        taxApplicable: true,
        baseAmount: 16.97,
        tax: 1.53,
        itemCode: "SHR005",
        type: "Mixed",
      },
      {
        id: 1,
        name: "Egg Tart",
        size: "4-pc Pack", // Multi-pack size
        description: "KFC Signature buttery, flaky crust Portuguese egg tart",
        price: 1.50,
        quantity: 4,
        category: "Dessert",
        taxApplicable: true,
        baseAmount: 5.50,
        tax: 0.50,
        itemCode: "D001",
        flavor: "Original",
      },
    ],
    subtotal: 22.45,
    tax: 2.05,
    total: 24.50,
  },
  hist2: {
    id: "KFC-TAMPINES-86448316",
    date: "15-10-2025",
    time: "12:45:33",
    associate: "Budi Hartono",
    branch: "Tampines Mall",
    items: [
      {
        id: 0,
        name: "Zinger Stacker Meal",
        size: "Medium Meal", // Refers to Fries and Drink size
        description: "Zinger Stacker Burger, Fries, and Pepsi",
        price: 12.10,
        quantity: 1,
        category: "Meals",
        taxApplicable: true,
        baseAmount: 11.10,
        tax: 1.00,
        itemCode: "MEAL009",
      },
      {
        id: 1,
        name: "6-pc Nuggets",
        size: "6-Piece", // Standard snack count
        description: "Golden brown chicken nuggets",
        price: 4.80,
        quantity: 2,
        category: "Snacks",
        taxApplicable: true,
        baseAmount: 8.81,
        tax: 0.79,
        itemCode: "SNK002",
        sauce: "BBQ Sauce",
      },
    ],
    subtotal: 19.91,
    tax: 1.79,
    total: 21.70,
  },
};

  const currentReceipt = receipts[currentReceiptId]

  const totalSlides = 2

  const transactionHistory = [
    {
      id: "current",
      date: "07-11-2025",
      branch: "KFC",
      amount: currentReceiptId === "current" ? receipts.current.subtotal + receipts.current.tax : 23.10,
    },
    { id: "hist1", date: "20-10-2025", branch: "KFC", amount: 24.50 },
    { id: "hist2", date: "15-10-2025", branch: "KFC", amount: 21.70 },
  ]

  const toggleProductExpansion = (productId: number) => {
    setExpandedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleProfileUpdate = () => {
    setProfileUpdateSuccess(true)
    setTimeout(() => setProfileUpdateSuccess(false), 3000)
  }

  const getModalPositionRelativeToContainer = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    if (!buttonRef.current || !receiptContainerRef.current) {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
    }

    const button = buttonRef.current
    const container = receiptContainerRef.current

    const buttonRect = button.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    // Calculate position relative to container
    const relativeTop = buttonRect.top - containerRect.top
    const relativeLeft = buttonRect.left - containerRect.left

    // Modal dimensions (approximate)
    const modalWidth = Math.min(400, containerRect.width - 32)
    const modalHeight = 400

    // Calculate ideal top position (above button, with offset)
    let top = Math.max(16, relativeTop - modalHeight - 8)

    // If modal would go off top, place it below button
    if (top < 16) {
      top = relativeTop + buttonRect.height + 8
    }

    // If still too high, center it vertically
    if (top + modalHeight > containerRect.height) {
      top = Math.max(16, (containerRect.height - modalHeight) / 2)
    }

    // Calculate ideal left position (centered on button)
    let left = relativeLeft + buttonRect.width / 2 - modalWidth / 2

    // Keep modal within horizontal bounds
    left = Math.max(16, Math.min(left, containerRect.width - modalWidth - 16))

    return {
      position: "absolute" as const,
      top: `${top}px`,
      left: `${left}px`,
      width: `${modalWidth}px`,
      maxHeight: "85vh",
    }
  }

  const handleFeedbackModalOpen = () => {
    setShowFeedbackModal(true)
  }

  const handleTransactionHistoryOpen = () => {
    setShowTransactionHistory(true)
  }

  const handleReferModalOpen = () => {
    setShowReferModal(true)
  }

  const handleFeedbackSubmit = () => {
    setFeedbackSubmitted(true)
    setShowFeedbackModal(false)
    setTimeout(() => setFeedbackSubmitted(false), 5000)
  }

  const handleShare = () => {
    handleReferModalOpen()
  }

  const handleEmailReceipt = () => {
    window.open(`mailto:?subject=Receipt from KFC Singapore&body=Receipt ID: ${currentReceipt.id}`)
  }

  const handleDownloadReceipt = () => {
    const receiptContent = `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>KFC Singapore Receipt</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.4; color: #000; background: #fff; width: 800px; margin: 0 auto; padding: 20px; }
    
    /* KFC Branding Colors */
    .receipt-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #E4002B; }
    
    .company-info h1 { font-size: 32px; color: #E4002B; font-weight: 900; margin-bottom: 4px; font-style: italic; }
    .company-info p { font-size: 12px; color: #333; line-height: 1.3; font-weight: 500; }
    
    .bill-info { text-align: right; font-size: 12px; }
    .bill-info div { margin-bottom: 4px; }
    .bill-id { font-weight: bold; color: #E4002B; }
    
    .customer-section { background: #fff5f5; padding: 15px; margin-bottom: 20px; border-left: 4px solid #E4002B; border-radius: 0 8px 8px 0; }
    .customer-section h3 { color: #E4002B; font-size: 16px; margin-bottom: 2px; font-weight: 700; }
    .customer-section p { font-size: 12px; font-weight: 500; color: #555; }

    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .items-table th { background: #E4002B; color: white; padding: 12px 8px; text-align: left; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
    .items-table td { padding: 12px 8px; border-bottom: 1px solid #f0f0f0; font-size: 12px; vertical-align: top; }
    
    .item-name { font-weight: 700; color: #000; margin-bottom: 3px; font-size: 13px; }
    .item-desc { font-size: 11px; color: #666; line-height: 1.3; }
    .item-specs { font-size: 10px; color: #E4002B; margin-top: 4px; font-weight: 600; text-transform: uppercase; }
    
    .totals-section { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 0 10px; }
    .pieces-purchased { font-size: 14px; font-weight: 700; color: #333; }
    
    .totals-table { text-align: right; min-width: 200px; }
    .totals-table div { margin-bottom: 6px; font-size: 13px; font-weight: 500; }
    .net-total { font-weight: 800; font-size: 18px; color: #E4002B; border-top: 2px solid #E4002B; padding-top: 8px; margin-top: 8px; }
    
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px dashed #ccc; font-size: 12px; color: #444; }
    .footer strong { color: #E4002B; }
    .powered-by { margin-top: 15px; font-size: 10px; font-weight: 700; color: #999; text-transform: uppercase; }
    
    @media print { body { -webkit-print-color-adjust: exact; width: 100%; padding: 0; } }
  </style>
</head>
<body>
  <div class="receipt-header">
    <div class="logo-section">
      <div class="company-info">
        <h1>KFC</h1>
        <p><strong>Kentucky Fried Chicken Management Pte Ltd</strong><br>
        10 Jalan Ahmad Ibrahim, Singapore 628965<br>
        Phone: +65 6222 3333<br>
        GST Reg No: M2-0021281-1</p>
      </div>
    </div>
    <div class="bill-info">
      <div><strong>Receipt ID:</strong> <span class="bill-id">KFC-PLAZA-SING-71922864</span></div>
      <div><strong>Date:</strong> 07-11-2026 19:22:18</div>
      <div><strong>Counter Associate:</strong> Nurul Aziz</div>
    </div>
  </div>

  <div class="customer-section">
    <h3>Guest: ${customerName}</h3>
    <p>It was a pleasure serving you. Finger Lickin' Good!</p>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th style="width: 50%;">Menu Item</th>
        <th style="width: 10%;">Qty</th>
        <th style="width: 15%;">Size</th>
        <th style="width: 12%;">Price</th>
        <th style="width: 13%;">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="item-name">2-pc Chicken Variety Box</div>
          <div class="item-desc">2pcs Chicken (OR/HS), Reg Whipped Potato, Reg Coleslaw, Pepsi Black</div>
          <div class="item-specs">Type: Original Recipe | Drink: Pepsi Black</div>
        </td>
        <td>1</td>
        <td>Standard Box</td>
        <td>S$10.95</td>
        <td><strong>S$10.95</strong></td>
      </tr>
      <tr>
        <td>
          <div class="item-name">Zinger Burger</div>
          <div class="item-desc">Signature spicy chicken thigh burger with lettuce and mayo</div>
          <div class="item-specs">Flavor: Spicy</div>
        </td>
        <td>1</td>
        <td>Single Patty</td>
        <td>S$6.95</td>
        <td><strong>S$6.95</strong></td>
      </tr>
      <tr>
        <td>
          <div class="item-name">BBQ Cheese Fries</div>
          <div class="item-desc">Golden fries topped with cheese and BBQ sauce</div>
          <div class="item-specs">Flavor: BBQ Cheese</div>
        </td>
        <td>1</td>
        <td>Regular</td>
        <td>S$5.20</td>
        <td><strong>S$5.20</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="totals-section">
    <div class="pieces-purchased">
      Items Ordered: 3
    </div>
    <div class="totals-table">
      <div>Subtotal: <strong>S$21.19</strong></div>
      <div>GST (9%): <strong>S$1.91</strong></div>
      <div class="net-total">Total: <strong>S$23.10</strong></div>
    </div>
  </div>

  <div class="footer">
    <p><strong>Thank you for dining with KFC Singapore!</strong></p>
    <p>Follow us on Instagram @kfc_sg or visit www.kfc.com.sg</p>
    <div class="powered-by">Powered by RDEP</div>
  </div>
</body>
</html>
    `

    const blob = new Blob([receiptContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "KFC_Receipt_SK251107001.html"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleWhatsApp = () => {
    window.open("https://wa.me/+919620921294", "_blank")
  }

  const handleCall = () => {
    window.open("tel:+919620921294", "_blank")
  }

  const handleEmail = () => {
    window.open("mailto:sagar.p@proenx.com", "_blank")
  }

  const handleSocialLink = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div
        id="receipt-root"
        ref={receiptContainerRef}
        className="w-full max-w-md mx-auto bg-white shadow-lg relative overflow-hidden"
      >
        <div className="flex flex-col w-full gap-3 pb-4 px-3">
          {/* Top Section - Row 1: Logo left, QR right */}
<div className="bg-white rounded-lg border border-gray-200 p-4 mt-3 font-poppins">
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      {/* Increased height from h-14 to h-24 for a much bolder presence */}
      <img 
        src="https://logowik.com/content/uploads/images/674_kfc.jpg" 
        alt="KFC" 
        className="h-24 w-auto object-contain" 
      />
    </div>
    <div className="bg-gray-100 p-2 rounded-md border border-gray-200">
      <Image
        src="/images/design-mode/800px-QR_code_for_mobile_English_Wikipedia.svg.png"
        alt="QR Code"
        width={64}
        height={64}
        className="object-contain"
      />
    </div>
  </div>

  <div className="flex items-center justify-between mt-6">
    <div className="bg-[#E4002B] px-5 py-2.5 rounded-full flex items-center shadow-md">
      <User2 className="h-5 w-5 mr-2 text-white" />
      <span className="text-sm font-bold text-white tracking-tight">Hello {customerName}!</span>
    </div>

    <div className="bg-white border-2 border-[#E4002B] px-4 py-2 rounded-xl text-right">
      <div className="text-[10px] font-semibold text-gray-400 uppercase leading-none mb-1">Total Paid</div>
      <div className="text-sm font-bold text-[#E4002B] leading-none">
        S${currentReceipt.total.toFixed(2)}
      </div>
    </div>
  </div>

  {/* Top Section - Row 3: Receipt ID and Date & Time */}
  <div className="grid grid-cols-2 gap-4 mt-5">
    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
      <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Receipt ID</div>
      <div className="text-xs font-mono font-bold text-gray-800 tracking-tight">{currentReceipt.id}</div>
    </div>
    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
      <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Date & Time</div>
      <div className="text-xs font-bold text-gray-800">
        {currentReceipt.date} <span className="text-gray-300 mx-1">|</span> {currentReceipt.time}
      </div>
    </div>
  </div>
</div>
          {/* Purchase Details */}
<div className="bg-white rounded-lg border border-gray-200 p-3 font-poppins">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-base font-semibold flex items-center text-[#E4002B]">
      <ShoppingBagIcon className="mr-2 h-4 w-4" />
      Order Details
    </h3>
    <Badge variant="outline" className="text-[10px] border-[#E4002B]/30 text-[#E4002B] font-medium">
      {currentReceipt.items.length} Items
    </Badge>
  </div>

  <div className="space-y-2">
    {currentReceipt.items.map((product) => (
      <div key={product.id} className="border border-gray-100 rounded-lg overflow-hidden">
        <div
          className="flex items-center justify-between p-2.5 bg-gray-50/50 cursor-pointer"
          onClick={() => toggleProductExpansion(product.id)}
        >
          <div className="flex items-center flex-1">
            <ChevronRight
              className={`h-3 w-3 mr-2 text-[#E4002B] transition-transform duration-200 ${
                expandedProducts.includes(product.id) ? "rotate-90" : ""
              }`}
            />
            <div className="flex-1">
              <span className="font-semibold text-sm text-gray-900">{product.name}</span>
              <div className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">{product.category}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-right">
            <div className="text-xs font-medium text-gray-500">x{product.quantity}</div>
            <div className="font-bold text-sm text-gray-900">
              S${(product.price * product.quantity).toFixed(2)}
            </div>
          </div>
        </div>
        
        {expandedProducts.includes(product.id) && (
          <div className="bg-white p-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px] font-medium text-gray-600">
              <div className="flex justify-between border-b border-gray-50 pb-1">
                <span className="text-gray-400">Code:</span> <span>{product.itemCode}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-1">
                <span className="text-gray-400">Size:</span> <span>{product.size}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-1">
                <span className="text-gray-400">Base:</span> <span>S${product.baseAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-1">
                <span className="text-gray-400">Tax:</span> <span>S${product.tax?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    ))}
  </div>

  <div className="mt-4 space-y-1.5 border-t border-dashed pt-4">
    <div className="flex justify-between text-xs font-medium text-gray-500">
      <span>Subtotal</span>
      <span>S${currentReceipt.subtotal.toFixed(2)}</span>
    </div>
    <div className="flex justify-between text-xs font-medium text-gray-500">
      <span>GST (9%)</span>
      <span>S${currentReceipt.tax.toFixed(2)}</span>
    </div>
    <div className="flex justify-between text-base font-bold border-t border-gray-100 pt-2 mt-1">
      <span className="text-gray-900">Total Paid</span>
      <span className="text-[#E4002B]">S${currentReceipt.total.toFixed(2)}</span>
    </div>
  </div>

  <div className="pt-3">
    {/* KFC Branded Payment method */}
    <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center mr-3 border border-gray-100">
            <svg className="w-4 h-4 text-[#E4002B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeWidth="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10" strokeWidth="2"></line>
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">Credit/Debit Card</div>
            <div className="text-[10px] font-medium text-gray-400">Ending in •••• 4532</div>
          </div>
        </div>
        <div className="text-sm font-bold text-gray-900">S${currentReceipt.total.toFixed(2)}</div>
      </div>
    </div>
  </div>
</div>

          {/* KFC Rewards Loyalty Section */}
<div className="bg-white rounded-lg border border-gray-200 p-3 font-poppins">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-base font-semibold flex items-center text-[#E4002B]">
      <div className="bg-[#E4002B] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] mr-2 shadow-sm">
        🍗
      </div>
      KFC Rewards
    </h3>
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Singapore</span>
  </div>

  <div className="grid grid-cols-3 gap-3 mb-4">
    {/* Points Earned from this order */}
    <div className="text-center p-2 bg-gray-50 rounded-xl border border-gray-100">
      <div className="text-lg font-bold text-gray-900">{Math.floor(currentReceipt.total)}</div>
      <div className="text-[10px] font-medium text-gray-500 uppercase">Points Gained</div>
    </div>
    
    {/* Total Balance Milestone */}
    <div className="text-center p-2 bg-[#E4002B]/5 rounded-xl border border-[#E4002B]/10">
      <div className="text-lg font-bold text-[#E4002B]">1,250</div>
      <div className="text-[10px] font-medium text-[#E4002B] uppercase">Total Balance</div>
    </div>

    {/* Reward Progress */}
    <div className="text-center p-2 bg-gray-50 rounded-xl border border-gray-100">
      <div className="text-lg font-bold text-gray-900">15</div>
      <div className="text-[10px] font-medium text-gray-500 uppercase">Expiring Soon</div>
    </div>
  </div>

  {/* KFC Singapore Program Rules Summary */}
  <div className="space-y-2">
    <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="absolute top-0 left-0 h-full bg-[#E4002B] w-3/4 rounded-full" />
    </div>
    <div className="flex justify-between items-center px-1">
      <span className="text-[10px] font-medium text-gray-400">Next Reward: 200 pts</span>
      <span className="text-[10px] font-bold text-[#E4002B]">75% to Free Zinger</span>
    </div>
  </div>

  <div className="mt-4 grid grid-cols-2 gap-2">
    <div className="flex items-center text-[10px] font-medium text-gray-600 bg-gray-50 px-2 py-1.5 rounded-md">
      <span className="text-[#E4002B] mr-1.5 text-xs">✓</span> S$1 = 1 Point
    </div>
    <div className="flex items-center text-[10px] font-medium text-gray-600 bg-gray-50 px-2 py-1.5 rounded-md">
      <span className="text-[#E4002B] mr-1.5 text-xs">✓</span> Birthday Deals
    </div>
    <div className="flex items-center text-[10px] font-medium text-gray-600 bg-gray-50 px-2 py-1.5 rounded-md">
      <span className="text-[#E4002B] mr-1.5 text-xs">✓</span> Skip the Queue
    </div>
    <div className="flex items-center text-[10px] font-medium text-gray-600 bg-gray-50 px-2 py-1.5 rounded-md">
      <span className="text-[#E4002B] mr-1.5 text-xs">✓</span> App-only Offers
    </div>
  </div>
</div>
          {/* Full Width Banner Section */}
<div className="bg-white rounded-lg border border-gray-200 overflow-hidden font-poppins relative">
  <Carousel 
    className="w-full" 
    setApi={setPromoApi}
    opts={{
      loop: true,
    }}
  >
    <CarouselContent>
      {/* Banner 1: Junior Party */}
      <CarouselItem>
        <a 
          href="https://www.kfc.com.sg/kfc-party-celebrations" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <div className="relative w-full aspect-[2/1]">
            <Image
              src="https://static.kfc.com.sg/images/web/lg/JuniorParty_WhatsNewContentBanner.jpg"
              alt="KFC Junior Party"
              fill
              className="object-contain" // Prevents cutting/cropping
              priority
            />
          </div>
        </a>
      </CarouselItem>

      {/* Banner 2: Double Dip */}
      <CarouselItem>
        <a 
          href="https://www.kfc.com.sg/whats-new/KFCDoubleDip" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <div className="relative w-full aspect-[2/1]">
            <Image
              src="https://static.kfc.com.sg/images/web/lg/KFC_DouDip.jpg?v=0.1"
              alt="KFC Double Dip"
              fill
              className="object-contain" // Prevents cutting/cropping
            />
          </div>
        </a>
      </CarouselItem>
    </CarouselContent>

    {/* Dots Navigation */}
    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
      {[0, 1].map((index) => (
        <button
          key={index}
          onClick={() => promoApi?.scrollTo(index)}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            currentSlide === index ? "w-5 bg-[#E4002B]" : "w-1.5 bg-gray-300"
          }`}
        />
      ))}
    </div>
  </Carousel>
</div>
          {/* Profile Update Section */}
<div className="bg-white rounded-lg border border-gray-200 p-4 font-poppins">
  {profileUpdateSuccess ? (
    <div className="text-center py-4 bg-green-50/50 rounded-xl border border-green-100">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <div className="text-sm font-bold text-gray-900 mb-1">Profile Updated!</div>
      <div className="text-[11px] font-medium text-green-700 uppercase tracking-wider">
        +100 KFC Rewards Points Earned
      </div>
    </div>
  ) : (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center">
          <div className="bg-[#E4002B] p-1.5 rounded-lg mr-2.5">
            <User2 className="h-4 w-4 text-white" />
          </div>
          Complete Profile
        </h3>
        <Badge className="text-[10px] font-bold bg-[#E4002B] text-white hover:bg-[#E4002B] border-none px-2 py-0.5">
          +100 PTS
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="mobile" className="text-[11px] font-bold text-gray-400 uppercase tracking-tight ml-1">
              Mobile Number
            </Label>
            <Input
              id="mobile"
              placeholder="+65 ...."
              value={profile.mobile}
              onChange={(e) => setProfile((prev) => ({ ...prev, mobile: e.target.value }))}
              className="h-10 text-xs border-gray-200 focus:border-[#E4002B] focus:ring-[#E4002B] rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[11px] font-bold text-gray-400 uppercase tracking-tight ml-1">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Your Name"
              value={profile.name}
              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              className="h-10 text-xs border-gray-200 focus:border-[#E4002B] focus:ring-[#E4002B] rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[11px] font-bold text-gray-400 uppercase tracking-tight ml-1">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={profile.email}
            onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
            className="h-10 text-xs border-gray-200 focus:border-[#E4002B] focus:ring-[#E4002B] rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="gender" className="text-[11px] font-bold text-gray-400 uppercase tracking-tight ml-1">
            Gender
          </Label>
          <Select
            value={profile.gender}
            onValueChange={(value) => setProfile((prev) => ({ ...prev, gender: value }))}
          >
            <SelectTrigger className="h-10 text-xs border-gray-200 focus:border-[#E4002B] rounded-lg">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male" className="text-xs">Male</SelectItem>
              <SelectItem value="female" className="text-xs">Female</SelectItem>
              <SelectItem value="other" className="text-xs">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full bg-[#E4002B] hover:bg-[#c30025] text-white h-11 text-xs font-bold rounded-xl shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
          onClick={handleProfileUpdate}
        >
          Update & Claim 100 Points
        </Button>
      </div>
    </>
  )}
</div>

          {/* Quick Actions - Feedback Section */}
<div className="bg-white rounded-lg border border-gray-200 p-4 font-poppins">
  {feedbackSubmitted ? (
    <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
      <div className="w-12 h-12 bg-[#E4002B] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-100">
        <ThumbsUp className="h-6 w-6 text-white" />
      </div>
      <div className="text-sm font-bold text-gray-900 mb-1">Finger Lickin' Good!</div>
      <div className="text-xs font-medium text-gray-500">
        Thank you for sharing your feedback with us.
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Rate Your Experience</h3>
        <span className="text-[10px] font-bold text-[#E4002B] bg-red-50 px-2 py-1 rounded">GUEST SURVEY</span>
      </div>

      {/* Star Rating Selection */}
      <div className="flex justify-center gap-3 py-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="transition-transform active:scale-90"
          >
            <Star
              className={`h-8 w-8 ${
                star <= rating ? "fill-[#E4002B] text-[#E4002B]" : "text-gray-200"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Inline Feedback Box */}
      <div className="space-y-2">
        <Label htmlFor="comments" className="text-[11px] font-bold text-gray-400 uppercase tracking-tight ml-1">
          Tell us more (Optional)
        </Label>
        <textarea
          id="comments"
          rows={3}
          placeholder="How was your chicken? Was the service fast?"
          className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#E4002B] focus:border-[#E4002B] outline-none transition-all resize-none"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        />
      </div>

      <Button
        className="w-full bg-[#E4002B] hover:bg-[#c30025] text-white h-10 text-xs font-bold rounded-xl transition-all"
        onClick={handleFeedbackSubmit}
        disabled={!rating}
      >
        Submit Feedback
      </Button>
      
      <p className="text-[10px] text-center text-gray-400 font-medium">
        Your feedback helps us serve you better!
      </p>
    </div>
  )}
</div>

          {/* KFC App Exclusive Deals */}
<div className="bg-white rounded-lg border border-gray-200 p-4 font-poppins relative overflow-hidden">
  {/* Decorative Red Stripes (KFC Branding) */}
  <div className="absolute top-0 right-0 flex gap-1 opacity-10 rotate-12 -mr-4 -mt-2">
    <div className="w-2 h-20 bg-[#E4002B]"></div>
    <div className="w-2 h-20 bg-[#E4002B]"></div>
    <div className="w-2 h-20 bg-[#E4002B]"></div>
  </div>

  <div className="flex items-center justify-between mb-4">
    <h3 className="text-base font-bold text-gray-900 flex items-center">
      <Sparkles className="mr-2 h-4 w-4 text-[#E4002B]" />
      Deals Just for You
    </h3>
    <span className="text-[10px] font-bold text-[#E4002B] uppercase tracking-tighter">App Exclusives</span>
  </div>

  <div className="space-y-3">
    {/* Deal 1: The Zinger Upgrade */}
    <div className="group relative bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:border-[#E4002B]/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-[#E4002B] text-[9px] font-bold px-1.5 py-0 h-4">HOT</Badge>
            <h4 className="text-sm font-bold text-gray-900">Zinger Combo Upgrade</h4>
          </div>
          <p className="text-[11px] font-medium text-gray-500 leading-tight">
            Flash this receipt to upgrade your next Zinger meal to a Box for only <span className="text-[#E4002B] font-bold">S$2.50</span>.
          </p>
        </div>
        <div className="ml-3 w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xl">
          🍔
        </div>
      </div>
    </div>

    {/* Deal 2: Cheese Fries Special */}
    <div className="group relative bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:border-[#E4002B]/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0 h-4">SNACK</Badge>
            <h4 className="text-sm font-bold text-gray-900">S$3.00 Cheese Fries</h4>
          </div>
          <p className="text-[11px] font-medium text-gray-500 leading-tight">
            Add-on a regular Cheese Fries with any purchase above S$15.00. 
          </p>
        </div>
        <div className="ml-3 w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xl">
          🍟
        </div>
      </div>
    </div>

    {/* Deal 3: Delivery Promo */}
    <div className="group relative bg-[#E4002B]/5 border border-[#E4002B]/10 rounded-xl p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0 h-4">CODE</Badge>
            <h4 className="text-sm font-bold text-[#E4002B]">FREE DELIVERY</h4>
          </div>
          <p className="text-[11px] font-medium text-gray-700 leading-tight">
            Use code <span className="font-bold underline">KFCSG5</span> for free delivery on your next app order.
          </p>
        </div>
        <div className="ml-3 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl shadow-inner">
          🛵
        </div>
      </div>
    </div>
  </div>

  <p className="mt-4 text-[9px] text-center text-gray-400 font-medium italic">
    *T&Cs apply. Valid at all KFC Singapore outlets except Zoo and Jewel.
  </p>
</div>
          {/* Receipt Actions (2) */}
<div className="bg-white rounded-lg border border-gray-200 p-3 font-poppins">
  <div className="flex justify-center space-x-4">
    <Button
      ref={historyButtonRef}
      variant="ghost"
      size="sm"
      className="text-[#E4002B] hover:bg-red-50 font-medium"
      onClick={handleTransactionHistoryOpen}
    >
      <History className="h-4 w-4 mr-1" />
      <span className="text-xs">History</span>
    </Button>
    
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-[#E4002B] hover:bg-red-50 font-medium" 
      onClick={handleEmailReceipt}
    >
      <Mail className="h-4 w-4 mr-1" />
      <span className="text-xs">Email</span>
    </Button>
    
    <Button
      variant="ghost"
      size="sm"
      className="text-[#E4002B] hover:bg-red-50 font-medium"
      onClick={handleDownloadReceipt}
    >
      <Download className="h-4 w-4 mr-1" />
      <span className="text-xs">Download</span>
    </Button>
  </div>
</div>
          {/* Need Help */}
<div className="bg-white rounded-lg border border-gray-200 p-3 font-poppins">
  <h3 className="text-sm font-semibold text-[#E4002B] mb-3 flex items-center">
    <Send className="mr-2 h-4 w-4" />
    Need Help?
  </h3>
  <div className="grid grid-cols-3 gap-2">
    {/* WhatsApp / Chat */}
    <button
      onClick={handleWhatsApp}
      className="bg-gray-50 border border-gray-100 rounded-lg p-2 flex flex-col items-center hover:bg-red-50 transition-colors group"
    >
      <MessageSquare className="h-4 w-4 text-gray-600 group-hover:text-[#E4002B] mb-1" />
      <span className="text-[11px] font-medium text-gray-700">Chat</span>
    </button>

    {/* Call Support */}
    <button
      onClick={handleCall}
      className="bg-gray-50 border border-gray-100 rounded-lg p-2 flex flex-col items-center hover:bg-red-50 transition-colors group"
    >
      <Phone className="h-4 w-4 text-gray-600 group-hover:text-[#E4002B] mb-1" />
      <span className="text-[11px] font-medium text-gray-700">Call</span>
    </button>

    {/* Email Support */}
    <button
      onClick={handleEmail}
      className="bg-gray-50 border border-gray-100 rounded-lg p-2 flex flex-col items-center hover:bg-red-50 transition-colors group"
    >
      <Mail className="h-4 w-4 text-gray-600 group-hover:text-[#E4002B] mb-1" />
      <span className="text-[11px] font-medium text-gray-700">Email</span>
    </button>
  </div>
</div>

      {/* Social Media & Store Address */}
<div className="bg-white rounded-lg border border-gray-200 p-3 font-poppins">
  <div className="flex justify-center space-x-6 mb-3">
    <button
      onClick={() => handleSocialLink("https://www.instagram.com/kfc_sg/")}
      className="flex flex-col items-center"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center mb-1">
        <Instagram className="h-4 w-4 text-white" />
      </div>
      <span className="text-xs font-medium">Instagram</span>
    </button>
    <button
      onClick={() => handleSocialLink("https://www.facebook.com/KFC.SG/")}
      className="flex flex-col items-center"
    >
      <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center mb-1">
        <Facebook className="h-4 w-4 text-white" />
      </div>
      <span className="text-xs font-medium">Facebook</span>
    </button>
    <button
      onClick={() => handleSocialLink("https://www.kfc.com.sg")}
      className="flex flex-col items-center"
    >
      <div className="w-8 h-8 rounded-full bg-[#E4002B] flex items-center justify-center mb-1">
        <ExternalLink className="h-4 w-4 text-white" />
      </div>
      <span className="text-xs font-medium">Website</span>
    </button>
  </div>

  {/* Collapsible Store Location */}
  <div className="text-xs text-gray-600 text-center mb-3 bg-gray-50 p-3 rounded-lg">
    <button
      onClick={() => setShowStoreLocation(!showStoreLocation)}
      className="w-full flex items-center justify-center mb-2 hover:text-[#E4002B] transition-colors"
    >
      <MapPin className="h-3 w-3 mr-1 text-[#E4002B]" />
      <span className="font-semibold text-[#E4002B]">KFC Singapore HQ {showStoreLocation ? "▲" : "▼"}</span>
    </button>

    {showStoreLocation && (
      <div className="space-y-0.5">
        <p className="font-bold text-gray-900">Kentucky Fried Chicken Management Pte Ltd</p>
        <p>10 Jalan Ahmad Ibrahim</p>
        <p>Singapore 628965</p>
        <p className="mt-2 text-[10px]">GST Reg No: M2-0021281-1</p>
        <p className="mt-1 text-[#E4002B] font-semibold">Manager on Duty: {currentReceipt.associate}</p>
      </div>
    )}
  </div>

  {/* Compact Terms */}
  <Button
    variant="ghost"
    size="sm"
    className="w-full text-xs text-gray-500 hover:text-[#E4002B] h-6 font-medium"
    onClick={() => setShowTerms(!showTerms)}
  >
    Terms & Conditions {showTerms ? "▲" : "▼"}
  </Button>
  {showTerms && (
    <div className="text-[11px] text-gray-500 mt-2 space-y-1 px-2 font-medium">
      <p>• Rewards points valid for 6 months from issue date.</p>
      <p>• Prices include 9% GST. For feedback: kfc.com.sg/contact-us.</p>
      <p>• Finger Lickin' Good! All rights reserved.</p>
    </div>
  )}

  {/* Powered by RDEP */}
  <div className="text-center mt-2 pt-2 border-t border-gray-100">
    <div className="flex items-center justify-center space-x-1">
      <span className="text-xs text-gray-400 font-medium">Powered by</span>
      <Image
        src="/images/design-mode/RDEP%20cropped.png"
        alt="RDEP"
        width={60}
        height={16}
        className="object-contain"
      />
    </div>
  </div>
</div>
          <div id="height-marker" style={{ height: "1px" }} />
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div
            style={getModalPositionRelativeToContainer(feedbackButtonRef)}
            className="bg-white rounded-lg w-full overflow-hidden shadow-xl z-[9999] max-w-sm"
          >
            <div className="flex justify-between items-center p-4 border-b bg-blue-700 text-white">
              <h3 className="text-lg font-semibold">How was your shopping experience?</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white"
                onClick={() => setShowFeedbackModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>

            <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
              {[
                { key: "service", label: "Service Quality" },
                { key: "quality", label: "Product Quality" },
                { key: "style", label: "Shoe Style/Design" },
                { key: "pricing", label: "Value for Money" },
                { key: "store", label: "Store Ambiance" },
              ].map((category) => (
                <div key={category.key} className="flex items-center justify-between">
                  <span className="text-sm">{category.label}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          setFeedback((prev) => ({
                            ...prev,
                            [category.key as keyof typeof feedback]: star,
                          }))
                        }
                      >
                        <Star
                          className={`h-5 w-5 ${
                            feedback[category.key as keyof typeof feedback] >= star
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              ))}

              <Textarea
                placeholder="Please share your feedback about your purchase (optional)"
                className="mt-2"
                value={feedback.comments}
                onChange={(e) => setFeedback((prev) => ({ ...prev, comments: e.target.value }))}
              />
            </div>

            <div className="p-4 border-t">
              <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white" onClick={handleFeedbackSubmit}>
                Submit Feedback
              </Button>
            </div>
          </div>
        )}

        {/* Transaction History Modal */}
{showTransactionHistory && (
  <div
    style={getModalPositionRelativeToContainer(historyButtonRef)}
    className="bg-white rounded-lg w-full overflow-hidden shadow-2xl z-[9999] max-w-sm border border-gray-100 font-poppins"
  >
    {/* Header - KFC Red */}
    <div className="flex justify-between items-center p-4 bg-[#E4002B] text-white">
      <h3 className="text-base font-bold flex items-center uppercase tracking-tight">
        <History className="h-5 w-5 mr-2" />
        Order History
      </h3>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-white hover:bg-[#c30025] rounded-full"
        onClick={() => setShowTransactionHistory(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </Button>
    </div>

    {/* Transaction List */}
    <div className="max-h-80 overflow-y-auto p-3 bg-gray-50/50">
      <div className="space-y-2">
        {transactionHistory.map((transaction) => (
          <button
            key={transaction.id}
            onClick={() => {
              setCurrentReceiptId(transaction.id)
              setShowTransactionHistory(false)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="w-full flex items-center p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-[#E4002B] transition-all cursor-pointer group"
          >
            <div className="bg-red-50 p-2 rounded-lg mr-3 group-hover:bg-[#E4002B] transition-colors">
              <FileText className="h-5 w-5 text-[#E4002B] group-hover:text-white" />
            </div>
            <div className="flex-grow text-left">
              <div className="font-bold text-sm text-gray-900 leading-none mb-1">
                KFC
              </div>
              <div className="text-gray-400 text-[11px] font-medium uppercase tracking-tighter">
                {transaction.date}
              </div>
            </div>
            <div className="font-bold text-[#E4002B]">
              S${transaction.amount.toFixed(2)}
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* Footer Section */}
    <div className="p-3 border-t bg-white">
      <Button
        className="w-full bg-gray-900 hover:bg-black text-white font-bold h-10 rounded-xl transition-all"
        onClick={() => setShowTransactionHistory(false)}
      >
        Close History
      </Button>
    </div>
  </div>
)}
        {/* Refer & Earn Modal */}
        {showReferModal && (
          <div
            style={getModalPositionRelativeToContainer(referButtonRef)}
            className="bg-white rounded-lg w-full overflow-hidden shadow-xl z-[9999] max-w-sm"
          >
            <div className="flex justify-between items-center p-4 border-b bg-blue-700 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Refer & Earn
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-600"
                onClick={() => setShowReferModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="h-8 w-8 text-blue-700" />
                </div>
                <h4 className="text-lg font-semibold text-blue-700 mb-2">Share & Earn RM50!</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Refer friends to Skechers and both of you get RM50 off your next purchase!
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-xs font-medium text-blue-800 mb-1">Your Referral Code</div>
                <div className="text-lg font-bold text-blue-700 text-center">SKECH{customerName.toUpperCase()}50</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Try Skechers! Use code SKECH${customerName.toUpperCase()}50 for RM50 off!`,
                    )
                    setShowReferModal(false)
                  }}
                >
                  Copy Code
                </Button>
                <Button
                  className="bg-blue-700 hover:bg-blue-800 text-white"
                  onClick={() => {
                    window.open(
                      `https://wa.me/60362032728?text=Try Skechers Malaysia! Use my code SKECH${customerName.toUpperCase()}50 for RM50 off your next purchase!`,
                    )
                    setShowReferModal(false)
                  }}
                >
                  Share Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
