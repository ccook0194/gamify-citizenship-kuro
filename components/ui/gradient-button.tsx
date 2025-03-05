'use client'

import { ButtonHTMLAttributes } from 'react'
import styles from '@/styles/gradient-button.module.css'

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md'
}

export function GradientButton({ 
  children, 
  size = 'sm',
  className = '',
  ...props 
}: GradientButtonProps) {
  return (
    <button 
      className={`${styles.gradientButton} ${styles[size]} ${className}`}
      {...props}
    >
      <div className={styles.back} />
      <div className={styles.front}>{children}</div>
    </button>
  )
}
