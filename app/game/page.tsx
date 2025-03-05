'use client'

import WorldView from '@/components/WorldView'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import styles from '@/styles/back-button.module.css'
import withAuth from '@/hoc/withAuth'

const GamePage = () => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute bottom-[3%] left-[3%] z-50">
        <div className="rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_0_black]">
          <Link href="/" className={styles.backButton}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
      <WorldView />
    </div>
  )
}

export default withAuth(GamePage)