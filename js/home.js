import productApi from './api/productsApi'
import { formatCurrencyNumber, renderListCategory } from './utils'

async function renderListProductWithName(selector, tag) {
  const ulElement = document.querySelector(selector)
  if (!ulElement) return
  ulElement.textContent = ''
  const data = await productApi.getAll()
  let listData
  if (tag === 'phone') {
    listData = data.filter((item) => Number.parseInt(item.category_id) === 1).slice(0, 8)
  } else if (tag === 'laptop') {
    listData = data.filter((item) => Number.parseInt(item.category_id) === 2).slice(0, 8)
  }
  if (listData) {
    listData.forEach((item) => {
      const liElement = document.createElement('li')
      liElement.innerHTML = `<a href="/product-detail.html?id=${item.id}" title="" class="thumb">
      <img src="public/images/${item.thumb}" alt="${item.name}" />
    </a>
    <a href="/product-detail.html" title="" class="product-name">${item.name}</a>
    <div class="price">
      <span class="new">${formatCurrencyNumber(item.discount)}</span>
      <span class="old">${formatCurrencyNumber(item.price)}</span>
    </div>
    <div class="action clearfix">
      <a href="/cart.html" title="Thêm giỏ hàng" class="add-cart fl-left">Thêm giỏ hàng</a>
      <a href="/checkout.html" title="Mua ngay" class="buy-now fl-right">Mua ngay</a>
    </div>`
      ulElement.appendChild(liElement)
    })
  }
}
// main
;(() => {
  renderListCategory('#listCategory')
  renderListProductWithName('#listProductPhone', 'phone')
  renderListProductWithName('#listProductLaptop', 'laptop')
})()
