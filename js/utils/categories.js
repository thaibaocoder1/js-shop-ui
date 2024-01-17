import productApi from '../api/productsApi'
import categoryApi from '../api/categoryApi'
import { formatCurrencyNumber } from './format'
import { showSpinner, hideSpinner } from './spinner'
export async function renderListCategory(selector) {
  const ulElement = document.querySelector(selector)
  if (!ulElement) return
  ulElement.textContent = ''
  const endpoint = 'http://localhost:3001/categories'
  const res = await fetch(endpoint)
  const results = await res.json()
  if (Array.isArray(results) && results.length > 0) {
    results.forEach((item) => {
      const liElement = document.createElement('li')
      liElement.innerHTML = `<a href="/products.html?catID=${item.id}" title="${item.title}">${item.title}</a>`
      ulElement.appendChild(liElement)
    })
  }
}
export async function renderListProductWithCateID({
  selector,
  selectorCount,
  productHeading,
  categoryID,
}) {
  const ulElement = document.querySelector(selector)
  const countProductEl = document.querySelector(selectorCount)
  const productHeadingEl = document.querySelector(productHeading)
  if (!ulElement || !productHeadingEl || !countProductEl) return
  try {
    showSpinner()
    const data = await productApi.getAll()
    const categories = await categoryApi.getAll()
    hideSpinner()
    categories.forEach((category) => {
      if (Number.parseInt(category.id) === categoryID) {
        productHeadingEl.innerText = category.title
      }
    })
    const listProductApply = data.filter((item) => +item.category_id === categoryID)
    if (Array.isArray(listProductApply) && listProductApply.length > 0) {
      listProductApply.forEach((item) => {
        const liElement = document.createElement('li')
        liElement.dataset.id = item.id
        liElement.innerHTML = `<a href="/product-detail.html?id=${item.id}" title="" class="thumb">
        <img src="public/images/${item.thumb}" alt="${item.name}" />
        </a>
        <a href="/product-detail.html" title="" class="product-name">${item.name}</a>
        <div class="price">
          <span class="new">${formatCurrencyNumber(
            (item.price * (100 - Number.parseInt(item.discount))) / 100,
          )}</span>
          <span class="old">${formatCurrencyNumber(item.price)}</span>
        </div>
        <div class="action clearfix">
          <a href="/cart.html" title="Thêm giỏ hàng" class="add-cart fl-left">Thêm giỏ hàng</a>
          <a href="/checkout.html" title="Mua ngay" class="buy-now fl-right">Mua ngay</a>
        </div>`
        ulElement.appendChild(liElement)
      })
      countProductEl.innerHTML = `Hiển thị ${listProductApply.length} trên ${data.length} sản phẩm`
    }
  } catch (error) {
    console.log('not data to display', error)
  }
}
