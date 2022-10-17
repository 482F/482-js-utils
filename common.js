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

/**
 * @param {Date} date - 変換対象の Date
 * @param {String} format - 変換規則。下記の規則で変換される
 *  - $yyyy -> 西暦
 *  - $MM   -> 月
 *  - $dd   -> 日
 *  - $HH   -> 時
 *  - $mm   -> 分
 *  - $ss   -> 秒
 *  - $fff  -> ミリ秒
 *  - $a    -> 曜日 (ex. 月)
 *  - $$    -> $ (エスケープ)
 * @return {String} - date を format に従って変換した文字列
 */
export function formatDate(date, format) {
  const p = (num) => num.toString().padStart(2, '0')
  const rules = [
    { target: 'yyyy', converter: (date) => date.getFullYear() },
    { target: 'MM', converter: (date) => p(date.getMonth() + 1) },
    { target: 'dd', converter: (date) => p(date.getDate()) },
    { target: 'HH', converter: (date) => p(date.getHours()) },
    { target: 'mm', converter: (date) => p(date.getMinutes()) },
    { target: 'ss', converter: (date) => p(date.getSeconds()) },
    { target: 'fff', converter: (date) => p(date.getMilliseconds()) },
    { target: 'a', converter: (date) => '日月火水木金土'[date.getDay()] },
  ].map(({ target, converter }) => ({
    target,
    pattern: new RegExp(`(?<!\\$)\\$${target}`, 'g'),
    converter,
  }))
  const results = {}

  return rules
    .reduce((prev, { target, pattern, converter }) => {
      return prev.map((section) => {
        if (!section.match(pattern)) {
          return section
        }

        if (!results[target]) {
          results[target] = converter(date)
        }

        return section.replaceAll(pattern, results[target])
      })
    }, format.split('$$'))
    .join('$')
}
