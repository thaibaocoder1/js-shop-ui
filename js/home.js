import productApi from './api/productsApi'
import {
  formatCurrencyNumber,
  hideSpinner,
  showSpinner,
  renderListCategory,
  addCartToDom,
  addProductToCart,
  sweetAlert,
  displaySwiper,
  toast,
} from './utils'
import { renderListProductSeller } from './utils'

async function renderListProductWithName({ idElement, tagName }) {
  const ulElement = document.querySelector(idElement)
  if (!ulElement) return
  ulElement.textContent = ''
  try {
    showSpinner()
    const data = await productApi.getAll()
    hideSpinner()
    let listData
    switch (tagName) {
      case 'phone':
        listData = data.filter((item) => Number.parseInt(item.category_id) === 1).slice(0, 8)
        break
      case 'laptop':
        listData = data.filter((item) => Number.parseInt(item.category_id) === 2).slice(0, 8)
        break
      default:
        break
    }
    if (listData) {
      listData.forEach((item) => {
        const liElement = document.createElement('li')
        liElement.dataset.id = item.id
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
  } catch (error) {
    console.log('failed to fetch data', error)
  }
}

// main
;(() => {
  // get cart from localStorage
  let cart = localStorage.getItem('cart') !== null ? JSON.parse(localStorage.getItem('cart')) : []
  if (Array.isArray(cart) && cart.length > 0) {
    addCartToDom({
      idListCart: 'listCart',
      cart,
      idNumOrder: 'numOrder',
      idNum: '#num.numDesktop',
      idTotalPrice: 'totalPrice',
    })
  }
  renderListCategory('#listCategory')
  renderListProductSeller('#listItemSeller')
  displaySwiper('.swiper-wrapper')
  renderListProductWithName({
    idElement: '#listProductPhone',
    tagName: 'phone',
  })
  renderListProductWithName({
    idElement: '#listProductLaptop',
    tagName: 'phone',
  })
  // event delegations
  document.addEventListener('click', function (e) {
    const { target } = e
    if (target.matches('.add-cart')) {
      e.preventDefault()
      const infoUserStorage = localStorage.getItem('user_info')
      if (infoUserStorage) {
        const productID = +target.parentElement.parentElement.dataset.id
        if (productID) {
          sweetAlert.success('Tuyệt vời!')
          cart = addProductToCart(productID, cart, infoUserStorage)
        }
      } else {
        toast.error('Please login to add product')
        setTimeout(() => {
          window.location.assign('/login.html')
        }, 2000)
      }
    }
  })
})()