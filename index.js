const f = {}
f.sleep = async (ms = 10) =>
  await new Promise((resolve) => setTimeout(resolve, ms))
f.wait = async (func, waitTime, timeout) => {
  let timeouted = false
  if (timeout) {
    setTimeout(() => (timeouted = true), timeout)
  }
  let result
  while (!(result = await func()) && !timeouted) {
    await f.sleep(waitTime)
  }
  return result
}

module.exports = {
  ...f,
}
