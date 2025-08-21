"use client"

import { useState, useCallback, useRef } from "react"

interface SimulationProgress {
  currentTime: number
  totalDuration: number
  customersProcessed: number
  currentQueueLength: number
  avgWaitTime: number
  serverUtilization: number
  status: "running" | "completed" | "error"
}

interface SimulationResult {
  simulationId: string
  results: {
    totalCustomers: number
    avgWaitTime: number
    avgQueueLength: number
    maxQueueLength: number
    serverUtilization: number
  }
  events?: any[]
}

interface UseSimulationStreamReturn {
  isStreaming: boolean
  progress: SimulationProgress | null
  result: SimulationResult | null
  error: string | null
  startSimulation: (params: any) => void
  stopSimulation: () => void
}

export function useSimulationStream(): UseSimulationStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false)
  const [progress, setProgress] = useState<SimulationProgress | null>(null)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  const stopSimulation = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const startSimulation = useCallback(async (params: any) => {
    setIsStreaming(true)
    setProgress(null)
    setResult(null)
    setError(null)

    try {
      // First, start the simulation via POST to get the stream
      const response = await fetch("/api/simulation/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error("Failed to start simulation")
      }

      // Create EventSource from the response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      const decoder = new TextDecoder()
      let buffer = ""

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6))

                  if (line.includes("event: progress")) {
                    setProgress(data)
                  } else if (line.includes("event: complete")) {
                    setResult(data)
                    setIsStreaming(false)
                  } else if (line.includes("event: error")) {
                    setError(data.error || "Simulation failed")
                    setIsStreaming(false)
                  }
                } catch (parseError) {
                  console.error("[QBS] Error parsing SSE data:", parseError)
                }
              }
            }
          }
        } catch (streamError) {
          console.error("[QBS] Stream processing error:", streamError)
          setError("Stream processing failed")
          setIsStreaming(false)
        }
      }

      processStream()
    } catch (err) {
      console.error("[QBS] Simulation stream error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      setIsStreaming(false)
    }
  }, [])

  return {
    isStreaming,
    progress,
    result,
    error,
    startSimulation,
    stopSimulation,
  }
}
