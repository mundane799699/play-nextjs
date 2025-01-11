import { X } from 'lucide-react'
import Modal from '@/components/Modal'

interface BackgroundDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelectBackground: (background: string) => void
}

const backgrounds = [
  '/backgrounds/bg1.png',
  '/backgrounds/bg2.png',
  '/backgrounds/bg3.png',
  '/backgrounds/bg4.png',
  '/backgrounds/bg5.jpg',
  '/backgrounds/bg6.jpg',
  // 默认背景
  'data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h100v100H0z" fill="none" stroke="%23D2C6B5" stroke-width="0.5"/%3E%3C/svg%3E'
]

export function BackgroundDialog({ isOpen, onClose, onSelectBackground }: BackgroundDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            选择背景
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {backgrounds.map((bg, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectBackground(bg)
                onClose()
              }}
              className="relative aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-[#FF725F] transition-all"
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url("${bg}")`,
                  backgroundColor: '#FAF9F7'
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}
