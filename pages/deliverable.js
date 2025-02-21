import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Deliverable() {
  const router = useRouter()
  const [canAccess, setCanAccess] = useState(false)

  useEffect(() => {
    // Check if the user has completed brand builder
    const isComplete = localStorage.getItem("brandBuilderComplete")

    if (!isComplete) {
      router.push("/brand-builder") // Redirect if not completed
    } else {
      setCanAccess(true)
    }
  }, [])

  if (!canAccess) return null // Prevent render before check

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-3xl font-bold text-gray-900">Your Branding Guide</h1>
      <p className="text-lg text-gray-700 mt-2">This page will generate the branding guide.</p>
    </div>
  )
}