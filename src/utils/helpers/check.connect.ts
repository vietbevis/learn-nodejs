import mongoose from 'mongoose'
import os from 'os'
import process from 'process'

const _SECOND = 5000

// Count connection
const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log('🚀 ~ countConnect ~ numConnection:', numConnection)
}

// Check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCore = os.cpus().length
    const memoryUsage = process.memoryUsage().rss

    console.log('🚀 ~ numConnection:', numConnection)

    console.log('🚀 ~ memoryUsage:', memoryUsage / 1024 / 1024, 'MB')

    // Giả sử sức chịu tải mỗi core là 5 connection
    const maxConnection = numCore * 5

    if (numConnection > maxConnection) {
      console.warn('🚀 ~ checkOverload ~ Warning: Connection overload detected')
    }
  }, _SECOND) // Monitor every 5 seconds
}

export { countConnect, checkOverload }
