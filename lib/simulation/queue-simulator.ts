// Core queue simulation engine with Poisson arrivals and exponential service times

export interface SimulationParams {
  arrivalRate: number // customers per minute
  serviceRate: number // customers per minute per server
  numServers: number
  duration: number // minutes
}

export interface QueueEvent {
  customerId: number
  eventType: "arrival" | "service_start" | "service_end" | "departure"
  eventTime: number // minutes from start
  serverId?: number
  queueLength: number
  waitTime?: number
  serviceTime?: number
}

export interface SimulationResults {
  totalCustomers: number
  avgWaitTime: number
  avgQueueLength: number
  maxQueueLength: number
  serverUtilization: number
  events: QueueEvent[]
}

export interface SimulationProgress {
  currentTime: number
  totalDuration: number
  customersProcessed: number
  currentQueueLength: number
  avgWaitTime: number
  serverUtilization: number
  status: "running" | "completed" | "error"
}

interface Customer {
  id: number
  arrivalTime: number
  serviceStartTime?: number
  serviceEndTime?: number
  serverId?: number
}

interface Server {
  id: number
  busy: boolean
  customer?: Customer
  totalServiceTime: number
}

export class QueueSimulator {
  private params: SimulationParams
  private currentTime = 0
  private customers: Customer[] = []
  private servers: Server[] = []
  private queue: Customer[] = []
  private events: QueueEvent[] = []
  private nextCustomerId = 1
  private queueLengthSum = 0
  private lastQueueLengthUpdateTime = 0
  private progressCallback?: (progress: SimulationProgress) => void

  constructor(params: SimulationParams, progressCallback?: (progress: SimulationProgress) => void) {
    this.params = params
    this.progressCallback = progressCallback
    this.initializeServers()
  }

  private initializeServers(): void {
    this.servers = Array.from({ length: this.params.numServers }, (_, i) => ({
      id: i + 1,
      busy: false,
      totalServiceTime: 0,
    }))
  }

  // Generate random number from exponential distribution
  private exponentialRandom(rate: number): number {
    return -Math.log(1 - Math.random()) / rate
  }

  // Generate next arrival time using Poisson process
  private generateNextArrival(): number {
    return this.exponentialRandom(this.params.arrivalRate)
  }

  // Generate service time using exponential distribution
  private generateServiceTime(): number {
    return this.exponentialRandom(this.params.serviceRate)
  }

  // Update queue length statistics
  private updateQueueLengthStats(): void {
    const timeDiff = this.currentTime - this.lastQueueLengthUpdateTime
    this.queueLengthSum += this.queue.length * timeDiff
    this.lastQueueLengthUpdateTime = this.currentTime
  }

  // Add event to the events list
  private addEvent(event: Omit<QueueEvent, "queueLength">): void {
    this.updateQueueLengthStats()
    this.events.push({
      ...event,
      queueLength: this.queue.length,
    })
  }

  // Find available server
  private findAvailableServer(): Server | null {
    return this.servers.find((server) => !server.busy) || null
  }

  // Process customer arrival
  private processArrival(customer: Customer): void {
    this.customers.push(customer)

    this.addEvent({
      customerId: customer.id,
      eventType: "arrival",
      eventTime: customer.arrivalTime,
    })

    const availableServer = this.findAvailableServer()

    if (availableServer) {
      // Start service immediately
      this.startService(customer, availableServer)
    } else {
      // Add to queue
      this.queue.push(customer)
    }
  }

  // Start service for a customer
  private startService(customer: Customer, server: Server): void {
    const serviceTime = this.generateServiceTime()

    customer.serviceStartTime = this.currentTime
    customer.serviceEndTime = this.currentTime + serviceTime
    customer.serverId = server.id

    server.busy = true
    server.customer = customer
    server.totalServiceTime += serviceTime

    this.addEvent({
      customerId: customer.id,
      eventType: "service_start",
      eventTime: this.currentTime,
      serverId: server.id,
      waitTime: this.currentTime - customer.arrivalTime,
      serviceTime,
    })
  }

  // End service for a customer
  private endService(server: Server): void {
    const customer = server.customer!

    this.addEvent({
      customerId: customer.id,
      eventType: "service_end",
      eventTime: this.currentTime,
      serverId: server.id,
      waitTime: customer.serviceStartTime! - customer.arrivalTime,
      serviceTime: customer.serviceEndTime! - customer.serviceStartTime!,
    })

    this.addEvent({
      customerId: customer.id,
      eventType: "departure",
      eventTime: this.currentTime,
      serverId: server.id,
    })

    // Free the server
    server.busy = false
    server.customer = undefined

    // Start service for next customer in queue
    if (this.queue.length > 0) {
      const nextCustomer = this.queue.shift()!
      this.startService(nextCustomer, server)
    }
  }

  // Emit progress updates
  private emitProgress(): void {
    if (!this.progressCallback) return

    const completedCustomers = this.customers.filter((c) => c.serviceEndTime !== undefined)
    const totalWaitTime = completedCustomers.reduce((sum, c) => sum + (c.serviceStartTime! - c.arrivalTime), 0)
    const avgWaitTime = completedCustomers.length > 0 ? totalWaitTime / completedCustomers.length : 0

    const totalServiceTime = this.servers.reduce((sum, s) => sum + s.totalServiceTime, 0)
    const serverUtilization = this.currentTime > 0 ? totalServiceTime / (this.params.numServers * this.currentTime) : 0

    const progress: SimulationProgress = {
      currentTime: this.currentTime,
      totalDuration: this.params.duration,
      customersProcessed: completedCustomers.length,
      currentQueueLength: this.queue.length,
      avgWaitTime,
      serverUtilization,
      status: "running",
    }

    this.progressCallback(progress)
  }

  // Run the complete simulation
  public async simulate(): Promise<SimulationResults> {
    console.log("[QBS] Starting queue simulation with params:", this.params)

    this.emitProgress()

    // Generate all arrivals for the simulation period
    const arrivals: number[] = []
    let nextArrivalTime = this.generateNextArrival()

    while (nextArrivalTime < this.params.duration) {
      arrivals.push(nextArrivalTime)
      nextArrivalTime += this.generateNextArrival()
    }

    console.log("[QBS] Generated", arrivals.length, "customer arrivals")

    // Create event timeline
    const eventTimeline: Array<{ time: number; type: "arrival" | "service_end"; data: any }> = []

    // Add arrival events
    arrivals.forEach((arrivalTime, index) => {
      eventTimeline.push({
        time: arrivalTime,
        type: "arrival",
        data: { id: this.nextCustomerId++, arrivalTime },
      })
    })

    let lastProgressUpdate = 0
    const progressInterval = this.params.duration / 100 // Update progress 100 times during simulation

    // Process events in chronological order
    while (eventTimeline.length > 0 || this.servers.some((s) => s.busy)) {
      // Find next event time
      let nextEventTime = this.params.duration

      if (eventTimeline.length > 0) {
        nextEventTime = Math.min(nextEventTime, eventTimeline[0].time)
      }

      // Check for service completions
      for (const server of this.servers) {
        if (server.busy && server.customer?.serviceEndTime) {
          nextEventTime = Math.min(nextEventTime, server.customer.serviceEndTime)
        }
      }

      // Stop if we've reached the end of simulation
      if (nextEventTime >= this.params.duration) {
        break
      }

      this.currentTime = nextEventTime

      if (this.currentTime - lastProgressUpdate >= progressInterval) {
        this.emitProgress()
        lastProgressUpdate = this.currentTime
        // Add small delay to make progress visible
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      // Process service completions first
      for (const server of this.servers) {
        if (server.busy && server.customer?.serviceEndTime === this.currentTime) {
          this.endService(server)
        }
      }

      // Process arrivals
      while (eventTimeline.length > 0 && eventTimeline[0].time === this.currentTime) {
        const event = eventTimeline.shift()!
        if (event.type === "arrival") {
          this.processArrival(event.data)
        }
      }

      // Sort remaining events by time
      eventTimeline.sort((a, b) => a.time - b.time)
    }

    const results = this.calculateResults()
    if (this.progressCallback) {
      this.progressCallback({
        currentTime: this.params.duration,
        totalDuration: this.params.duration,
        customersProcessed: results.totalCustomers,
        currentQueueLength: 0,
        avgWaitTime: results.avgWaitTime,
        serverUtilization: results.serverUtilization,
        status: "completed",
      })
    }

    return results
  }

  private calculateResults(): SimulationResults {
    const completedCustomers = this.customers.filter((c) => c.serviceEndTime !== undefined)
    const totalWaitTime = completedCustomers.reduce((sum, c) => sum + (c.serviceStartTime! - c.arrivalTime), 0)

    const avgWaitTime = completedCustomers.length > 0 ? totalWaitTime / completedCustomers.length : 0
    const avgQueueLength = this.params.duration > 0 ? this.queueLengthSum / this.params.duration : 0
    const maxQueueLength = Math.max(...this.events.map((e) => e.queueLength), 0)

    const totalServiceTime = this.servers.reduce((sum, s) => sum + s.totalServiceTime, 0)
    const serverUtilization = totalServiceTime / (this.params.numServers * this.params.duration)

    console.log("[QBS] Simulation completed:", {
      totalCustomers: this.customers.length,
      completedCustomers: completedCustomers.length,
      avgWaitTime,
      avgQueueLength,
      maxQueueLength,
      serverUtilization,
    })

    return {
      totalCustomers: this.customers.length,
      avgWaitTime,
      avgQueueLength,
      maxQueueLength,
      serverUtilization,
      events: this.events,
    }
  }
}
