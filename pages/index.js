// import { useCallback, useEffect, useState } from 'react'
// import ClickCount from '../components/ClickCount'
// import styles from '../styles/home.module.css'
// import ColorPalette from '../components/ColorPalette'
import Link from "next/link"
import { Button } from "@radix-ui/themes"
import Image from "next/image"
function throwError() {
  console.log(
    // The function body() is not defined
    document.body()
  )
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#161719]">
      <main className="text-center text-[#f5f0ea]">
        <div className="display-block overflow-auto">
          <h1 className="text-4xl font-bold mb-4 inline-flex items-center">
            Welcome to
            <Image
              src="/images/icon.svg"
              width={225}
              height={100}
              alt="Pallet*Flow"
              className="ml-2"
            />
          </h1>
        </div>
        <p className="text-xl mb-8">Streamline your website design process</p>
        <Link href="/brand-builder">
          <Button size="lg">Start Building Your Brand Identity</Button>
        </Link>
      </main>
    </div>
  )
}