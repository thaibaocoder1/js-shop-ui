export function setFieldValue(parentElement, selector, value) {
  if (!parentElement) return
  const element = parentElement.querySelector(selector)
  if (element) element.value = value
  return element
}
export function setBackgroundImage(parentElement, selector, imageUrl) {
  if (!parentElement) return
  const element = parentElement.querySelector(selector)
  if (element) {
    element.src = imageUrl
  }
  return element
}
export function getRandomNumber(n) {
  if (n <= 0) return -1
  const random = Math.random() * n
  return Math.round(random)
}
export function getRandomImage() {
  let sourceImage = null
  sourceImage = `https://picsum.photos/id/${getRandomNumber(1000)}/400/400`
  return sourceImage
}
