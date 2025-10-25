import type { KeyboardEvent } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowUp, Paperclip, X } from 'lucide-react'
import { Button } from '@hpulse/ui/components/button'

export type ChatFormData = {
  prompt: string
  attachments?: File[]
}

type Props = {
  onSubmit: (data: ChatFormData) => void
  disabled?: boolean
}

const MultiModalInput = ({ onSubmit, disabled = false }: Props) => {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>()
  const [attachments, setAttachments] = useState<File[]>([])

  const submit = handleSubmit((data) => {
    reset({ prompt: '' })
    onSubmit({ ...data, attachments })
    setAttachments([])
  })

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <form
      onSubmit={submit}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
    >
      {attachments.length > 0 && (
        <div className="w-full flex flex-wrap gap-2 mb-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm"
            >
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <textarea
        {...register('prompt', {
          required: true,
          validate: (data) => data.trim().length > 0,
        })}
        autoFocus
        className="w-full border-0 text-base focus:outline-0 resize-none"
        placeholder="Ask anything"
        maxLength={1000}
        disabled={disabled}
      />
      <div className="flex items-center gap-2">
        <label htmlFor="file-upload" className="cursor-pointer">
          <Paperclip className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <Button disabled={!formState.isValid || disabled} className="rounded-full w-9 h-9">
          <ArrowUp />
        </Button>
      </div>
    </form>
  )
}

export default MultiModalInput
