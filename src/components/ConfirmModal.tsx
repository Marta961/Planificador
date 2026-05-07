import type { ReactNode } from 'react'
import { Button, Modal, type ModalProps } from './ui'

export interface ConfirmModalProps {
  open: boolean
  title: string
  description?: string
  /** Contenido adicional bajo la descripción del encabezado (opcional). */
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'primary' | 'danger'
  loading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
  size?: ModalProps['size']
}

export const ConfirmModal = ({
  open,
  title,
  description,
  children = null,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmVariant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
  size = 'sm',
}: ConfirmModalProps) => (
  <Modal
    open={open}
    title={title}
    description={description}
    onClose={onCancel}
    size={size}
    footer={
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} loading={loading} onClick={() => void onConfirm()}>
          {confirmLabel}
        </Button>
      </div>
    }
  >
    {children}
  </Modal>
)
