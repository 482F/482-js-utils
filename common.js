export async function sleep(ms = 10) {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

export async function wait(func, waitTime, timeout) {
  let timeouted = false
  if (timeout) {
    setTimeout(() => (timeouted = true), timeout)
  }
  let result
  while (!(result = await func()) && !timeouted) {
    await sleep(waitTime)
  }
  return result
}

export async function clip(data) {
  const blobs = Object.fromEntries(
    Object.entries(data).map(([type, body]) => [
      type,
      new Blob([body], { type }),
    ])
  )
  const clipboardItem = new ClipboardItem(blobs)
  await navigator.clipboard.write([clipboardItem])
}

export async function clipText(text) {
  return await clip({ 'text/plain': text })
}

export function download(fileName, datum) {
  const a = document.createElement('a')
  a.download = fileName
  const [[type, body]] = Object.entries(datum)
  const url = URL.createObjectURL(new Blob([body], { type }))
  a.href = url
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadText(fileName, text) {
  return download(fileName, { 'text/plain': text })
}

export function toAsyncCallback(func) {
  return new Promise((resolve, reject) => {
    func((err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

