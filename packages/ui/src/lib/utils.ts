import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sliceWord = (word: string, visibleFrontLetters = 5, visibleLastLetters = 5) => {
  if (word && word.length <= visibleFrontLetters + visibleLastLetters) return word
  return (
    word?.slice(0, visibleFrontLetters) +
    '...' +
    word?.slice(word.length - visibleLastLetters, word.length)
  )
}
