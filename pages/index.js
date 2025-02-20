// import { useCallback, useEffect, useState } from 'react'
// import ClickCount from '../components/ClickCount'
// import styles from '../styles/home.module.css'
// import ColorPalette from '../components/ColorPalette'
import Link from "next/link"
import Button from '../components/Button'


function throwError() {
  console.log(
    // The function body() is not defined
    document.body()
  )
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <main className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to PaletteFlow</h1>
        <p className="text-xl text-white mb-8">Streamline your website design process</p>
        <Link href="/brand-builder">
          <Button size="lg">Start Building Your Brand Identity</Button>
        </Link>
      </main>
    </div>
  )
}