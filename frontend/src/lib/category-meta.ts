import type { LucideIcon } from 'lucide-react'
import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
} from 'lucide-react'

export const CATEGORY_ICONS = [
  'briefcase-business',
  'car-front',
  'heart-pulse',
  'piggy-bank',
  'shopping-cart',
  'ticket',
  'tool-case',
  'utensils',
  'paw-print',
  'house',
  'gift',
  'dumbbell',
  'book-open',
  'baggage-claim',
  'mailbox',
  'receipt-text',
] as const

export const CATEGORY_COLORS = [
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
] as const

export type CategoryIcon = (typeof CATEGORY_ICONS)[number]
export type CategoryColor = (typeof CATEGORY_COLORS)[number]

export const iconMap: Record<CategoryIcon, LucideIcon> = {
  'briefcase-business': BriefcaseBusiness,
  'car-front': CarFront,
  'heart-pulse': HeartPulse,
  'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart,
  ticket: Ticket,
  'tool-case': ToolCase,
  utensils: Utensils,
  'paw-print': PawPrint,
  house: House,
  gift: Gift,
  dumbbell: Dumbbell,
  'book-open': BookOpen,
  'baggage-claim': BaggageClaim,
  mailbox: Mailbox,
  'receipt-text': ReceiptText,
}

export const colorClasses: Record<
  CategoryColor | 'gray',
  { tag: string; icon: string; swatch: string }
> = {
  blue: {
    tag: 'bg-blue-light text-blue-dark',
    icon: 'bg-blue-light text-blue',
    swatch: 'bg-blue',
  },
  purple: {
    tag: 'bg-purple-light text-purple-dark',
    icon: 'bg-purple-light text-purple',
    swatch: 'bg-purple',
  },
  pink: {
    tag: 'bg-pink-light text-pink-dark',
    icon: 'bg-pink-light text-pink',
    swatch: 'bg-pink',
  },
  red: {
    tag: 'bg-red-light text-red-dark',
    icon: 'bg-red-light text-red',
    swatch: 'bg-red',
  },
  orange: {
    tag: 'bg-orange-light text-orange-dark',
    icon: 'bg-orange-light text-orange',
    swatch: 'bg-orange',
  },
  yellow: {
    tag: 'bg-yellow-light text-yellow-dark',
    icon: 'bg-yellow-light text-yellow',
    swatch: 'bg-yellow',
  },
  green: {
    tag: 'bg-green-light text-green-dark',
    icon: 'bg-green-light text-green',
    swatch: 'bg-green',
  },
  gray: {
    tag: 'bg-gray-200 text-gray-700',
    icon: 'bg-gray-200 text-gray-600',
    swatch: 'bg-gray-400',
  },
}

export function isCategoryIcon(value: string): value is CategoryIcon {
  return (CATEGORY_ICONS as readonly string[]).includes(value)
}

export function isCategoryColor(value: string): value is CategoryColor {
  return (CATEGORY_COLORS as readonly string[]).includes(value)
}
