import productApi from '../api/productsApi'
import { formatCurrencyNumber } from './format'
import { hideSpinner, showSpinner } from './spinner'

export async function renderListProductSeller(selector) {
  const ulElement = document.querySelector(selector)
  if (!ulElement) return
  try {
    showSpinner()
    const data = await productApi.getAll()
    hideSpinner()
    const listProductApply = data.slice(0, 5)
    if (Array.isArray(listProductApply) && listProductApply.length > 0) {
      listProductApply.forEach((item) => {
        const liElement = document.createElement('li')
        liElement.dataset.id = item.id
        liElement.classList.add('clearfix')
        liElement.innerHTML = `<a href="/product-detail.html?id=${
          item.id
        }" title="" class="thumb fl-left">
        <img src="/public/images/${item.thumb}" alt="${item.name}" />
        </a>
        <div class="info fl-right">
          <a href="/product-detail.html?id=${item.id}" title="" class="product-name">${
          item.name
        }</a>
          <div class="price">
            <span class="new">${formatCurrencyNumber(
              (item.price * (100 - Number.parseInt(item.discount))) / 100,
            )}</span>
            <span class="old">${formatCurrencyNumber(item.price)}</span>
          </div>
          <a href="/checkout.html" title="" class="buy-now">Mua ngay</a>
        </div>`
        ulElement.appendChild(liElement)
      })
    }
  } catch (error) {
    console.log('not data to display', error)
  }
}
