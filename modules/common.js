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

f.filteringByHistory = (list, historyName, converter = (i) => i) => {
  const fs = require('fs')
  fs.appendFileSync(historyName, '', 'utf8')
  const histories = fs.readFileSync(historyName, 'utf8').split('\n')
  const filteredList = []
  let appendText = ''

  for (const item of list) {
    const convertedItem = converter(item).replaceAll(/[\r\n]/g, '')
    if (histories.includes(convertedItem)) {
      continue
    } else {
      filteredList.push(item)
      appendText += convertedItem + '\n'
    }
  }
  fs.appendFileSync(historyName, appendText, 'utf8')
  return filteredList
}

f.clip = async (data) => {
  const blobs = Object.fromEntries(
    Object.entries(data).map(([type, body]) => [
      type,
      new Blob([body], { type }),
    ])
  )
  const clipboardItem = new ClipboardItem(blobs)
  await navigator.clipboard.write([clipboardItem])
}

f.clipText = async (text) => f.clip({ 'text/plain': text })

f.download = (fileName, datum) => {
  const a = document.createElement('a')
  a.download = fileName
  const [[type, body]] = Object.entries(datum)
  const url = URL.createObjectURL(new Blob([body], { type }))
  a.href = url
  a.click()
  URL.revokeObjectURL(url)
}

f.downloadText = (fileName, text) =>
  f.download(fileName, { 'text/plain': text })

export default { ...f }
