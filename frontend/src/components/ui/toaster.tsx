import { CircleCheck, X } from 'lucide-react'
import { Toaster as Sonner } from 'sonner'
import 'sonner/dist/styles.css'

export function Toaster() {
  return (
    <Sonner
      theme="light"
      position="top-right"
      offset={{ top: 85, right: 24 }}
      duration={3500}
      closeButton
      gap={12}
      visibleToasts={3}
      icons={{
        success: (
          <span className="flex size-8 items-center justify-center rounded-lg bg-green-light text-success">
            <CircleCheck size={16} strokeWidth={2.25} />
          </span>
        ),
        close: <X size={12} />,
      }}
    />
  )
}
