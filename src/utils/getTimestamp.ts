const getTimestamp = () => {
  const today = new Date()
  return today.toLocaleDateString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  })
}

export default getTimestamp
