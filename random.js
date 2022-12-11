export function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randPick(arr) {
  return arr[randBetween(0, arr.length - 1)]
}

export function shuffle(arr) {
  const clonedArr = [...arr]
  const shuffledArr = []
  for (let i = 0; i < arr.length; i++) {
    const randIndex = randBetween(0, clonedArr.length - 1)
    shuffledArr.push(clonedArr.splice(randIndex, 1)[0])
  }
  return shuffledArr
}
