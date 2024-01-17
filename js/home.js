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
    }
  } catch (error) {
    console.log('failed to fetch data', error)
  }
}

// main
;(() => {
  // get cart from localStorage
  let cart = localStorage.getItem('cart') !== null ? JSON.parse(localStorage.getItem('cart')) : []
  let infoUserStorage =
    localStorage.getItem('user_info') !== null ? JSON.parse(localStorage.getItem('user_info')) : []
  let isCartAdded = false

  if (Array.isArray(cart) && cart.length > 0) {
    cart.forEach((item) => {
      if (item.userID === infoUserStorage.user_id && !isCartAdded) {
        addCartToDom({
          idListCart: 'listCart',
          cart,
          userID: infoUserStorage.user_id,
          idNumOrder: 'numOrder',
          idNum: '#num.numDesktop',
          idTotalPrice: 'totalPrice',
        })
        isCartAdded = true
      }
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
  document.addEventListener('click', async function (e) {
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
        toast.error('Đăng nhập để mua sản phẩm')
        setTimeout(() => {
          window.location.assign('/login.html')
        }, 2000)
      }
    } else if (target.matches('.buy-now')) {
      e.preventDefault()
      const infoUserStorage = localStorage.getItem('user_info')
      if (infoUserStorage) {
        const productID = +target.parentElement.parentElement.dataset.id
        showSpinner()
        const product = await productApi.getById(productID)
        const priceProduct = (product.price * (100 - Number.parseInt(product.discount))) / 100
        hideSpinner()
        if (productID) {
          cart = addProductToCart(productID, cart, infoUserStorage, 1)
          // set status buy now for product if user click buy now button in ui
          for (const item of cart) {
            if (+item.productID === productID) {
              item['isBuyNow'] = true
              item['isChecked'] = true
              item['price'] = priceProduct
            }
          }
          localStorage.setItem('cart', JSON.stringify(cart))
          window.location.assign('/checkout.html')
        }
      } else {
        toast.error('Đăng nhập để mua sản phẩm')
        setTimeout(() => {
          window.location.assign('/login.html')
        }, 2000)
      }
    }
  })
})()
