"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"

export default function DocumentUpload({ clientId, onUploadComplete }) {
  const [sdkReady, setSdkReady] = useState(false)
  const [checkId, setCheckId] = useState(null)

  useEffect(() => {
    const initComplyCube = () => {
      if (window.ComplyCube) {
        setSdkReady(true)
      }
    }

    if (window.ComplyCube) {
      initComplyCube()
    } else {
      window.initComplyCube = initComplyCube
    }
  }, [])

  const startVerification = () => {
    if (sdkReady) {
      const client = new window.ComplyCube.Client({
        clientId: clientId,
      })

      client.on("complete", (event) => {
        setCheckId(event.checkId)
      })

      client.on("error", (error) => {
        console.error("ComplyCube error:", error)
      })

      client.start()
    }
  }

  const handleVerificationComplete = () => {
    if (checkId) {
      onUploadComplete(checkId)
    }
  }

  return (
    <div className="space-y-4">
      <Script
        src="https://sdk.complycube.com/v1/js/complycube.min.js"
        onLoad={() => window.initComplyCube && window.initComplyCube()}
      />
      <div id="complycube-mount"></div>
      {sdkReady && !checkId && <Button onClick={startVerification}>Start Document Verification</Button>}
      {checkId && <Button onClick={handleVerificationComplete}>Complete Verification</Button>}
    </div>
  )
}

