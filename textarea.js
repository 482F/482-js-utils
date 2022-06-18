export function getPosition(textarea, { index, row, column }) {
  if ([null, undefined].includes(index)) {
    column ??= 0
    row ??= 0
    const lines = textarea.value.split('\n')
    if (row < 0) {
      row = lines.length - row - 1
    }
    if (column < 0) {
      row += 1
    }
    index =
      lines
        .map((line) => line + ' ')
        .slice(0, row)
        .join('').length + column
  } else {
    let lengthSum = 0
    const lines = textarea.value.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      lengthSum += line.length + 1
      if (index < lengthSum) {
        row ??= i
        column ??= index - lengthSum + line.length + 1
        break
      }
    }
  }
  return {
    index,
    row,
    column,
  }
}

export function getSelection(textarea) {
  const index = textarea.selectionStart
  return getPosition(textarea, { index })
}

export function scrollToPosition(textarea, position) {
  const { row } = getPosition(textarea, position)
  const { clientHeight, scrollHeight } = textarea
  const lines = textarea.value.split('\n')
  const lineHeight = scrollHeight / lines.length
  const targetHeight = lineHeight * (row + 1)
  const delta = targetHeight - clientHeight / 2
  textarea.scrollTo(0, delta)
}

export function setPosition(textarea, position) {
  const { index, row } = getPosition(textarea, position)
  textarea.selectionStart = index
  textarea.selectionEnd = index
  scrollToPosition(textarea, { row })
}

export function spliceText(
  textarea,
  startPosition,
  deleteCount,
  text,
  returnCursor = true
) {
  const { index } = getPosition(textarea, startPosition)
  const { index: baseIndex } = getSelection(textarea)
  const value = textarea.value
  const newText =
    value.slice(0, index) +
    text +
    value.slice(index + deleteCount, value.length)
  textarea.value = newText
  const targetIndex =
    baseIndex < index ? baseIndex : baseIndex + text.length - deleteCount
  if (returnCursor) {
    setPosition(textarea, { index: targetIndex })
  }
}

export function getRow(textarea, position) {
  const { row } = getPosition(textarea, position)
  return textarea.value.split('\n')[row]
}

export function spliceRow(
  textarea,
  { row },
  deleteRowCount,
  text,
  returnCursor = true
) {
  if ([undefined, null].includes(row)) {
    throw new Error('row is undefined')
  }
  const { index: deleteStart } = getPosition(textarea, { row })
  const { index: deleteEnd } = getPosition(textarea, {
    row: row + deleteRowCount - 1,
    column: -1,
  })
  const deleteCount = deleteEnd - deleteStart
  spliceText(textarea, { index: deleteStart }, deleteCount, text, returnCursor)
}
