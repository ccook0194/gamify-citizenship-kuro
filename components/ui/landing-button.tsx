'use client'

import { ButtonHTMLAttributes } from 'react'
import Link from 'next/link'
import styles from '@/styles/landing-button.module.css'

interface LandingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href: string
}

export function LandingButton({ 
  children, 
  href,
  className = '',
  ...props 
}: LandingButtonProps) {
  return (
    <Link href={href}>
      <button 
        className={`${styles.landingButton} ${className} [font-family:DynaPuff]`}
        {...props}
      >
        <div className={styles.back} />
        <div className={styles.front}>{children}</div>
      </button>
    </Link>
  )
}
