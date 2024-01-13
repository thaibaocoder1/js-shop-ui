import productApi from './api/productsApi'
import { formatCurrencyNumber, hideSpinner, showSpinner, sweetAlert } from './utils'

async function addCartToDom({ idListCart, cart, idNumOrder, idNum, idTotalPrice }) {
  const listCartElement = document.getElementById(idListCart)
  const idNumOrderEl = document.getElementById(idNumOrder)
  const idNumEl = document.querySelector(idNum)
  const idTotalPriceEl = document.getElementById(idTotalPrice)
  if (!listCartElement || !idNumOrderEl || !idNumEl || !idTotalPriceEl) return
  listCartElement.textContent = ''
  let totalQuantity = 0
  let totalPrice = 0
  try {
    const listProduct = await productApi.getAll()
    cart.forEach((item) => {
      totalQuantity += item.quantity
      const liElement = document.createElement('li')
      liElement.classList.add('clearfix')
      const productIndex = listProduct.findIndex((x) => +x.id === item.productID)
      const productInfo = listProduct[productIndex]
      liElement.innerHTML = `<a href="" title="" class="thumb fl-left">
      <img src="public/images/${productInfo.thumb}" alt="${productInfo.name}" />
    </a>
    <div class="info fl-right">
      <a href="" title="" class="product-name">${productInfo.name}</a>
      <p class="price">${formatCurrencyNumber(productInfo.discount)}</p>
      <p class="qty">Số lượng: <span>${item.quantity}</span></p>
    </div>`
      listCartElement.appendChild(liElement)
      totalPrice = totalPrice + item.quantity * productInfo.discount
    })
    idNumOrderEl.innerHTML = `Có <span>${totalQuantity} sản phẩm</span> trong giỏ hàng`
    idNumEl.textContent = totalQuantity
    idTotalPriceEl.innerHTML = `${formatCurrencyNumber(totalPrice)}`
  } catch (error) {
    console.log('error', error)
  }
}

async function renderListProductInCart({ idTable, cart, idTotalPrice, userInfoStorage }) {
  const tableElement = document.getElementById(idTable)
  if (!tableElement) return
  const tableBodyElement = tableElement.getElementsByTagName('tbody')[0]
  if (tableBodyElement) {
    showSpinner()
    const products = await productApi.getAll()
    hideSpinner()
    cart?.forEach((item) => {
      if (+item.userID === +userInfoStorage.user_id) {
        const tableRowElement = document.createElement('tr')
        const productIndex = products.findIndex((x) => +x.id === item.productID)
        const productInfo = products[productIndex]
        tableRowElement.innerHTML = `
        <td>
        <input type="checkbox" name="product" class="checkbox2" value="${productInfo.discount}" />
        </td>
        <td>${productInfo.code}</td>
        <td>
          <a href="" title="" class="thumb">
            <img src="public/images/${productInfo.thumb}" alt="${productInfo.name}" />
          </a>
        </td>
        <td>
          <a href="" title="" class="name-product">${productInfo.name}</a>
        </td>
        <td>${formatCurrencyNumber(productInfo.discount)}</td>
        <td>
          <input type="text" name="num-order" value="${item.quantity}" class="num-order" />
        </td>
        <td id="priceProduct">${formatCurrencyNumber(productInfo.discount * item.quantity)}</td>
        <td>
          <a href="" title="" class="del-product"><i class="fa fa-trash-o"></i></a>
        </td>`
        tableBodyElement.appendChild(tableRowElement)
      }
    })
    // event delegations after render dom
    const listCheckbox = tableBodyElement.querySelectorAll("input[name='product']")
    if (listCheckbox) {
      let totalTemp = 0
      listCheckbox.forEach((checkbox) => {
        checkbox.addEventListener('click', () => {
          const priceProduct = +checkbox.value
          totalTemp += priceProduct
          document.getElementById(
            idTotalPrice,
          ).innerHTML = `Tổng thanh toán: <span>${formatCurrencyNumber(totalTemp)}</span>`
        })
      })
    }
  }
}

// main
;(() => {
  // get cart from storage
  let cart = localStorage.getItem('cart') !== null ? JSON.parse(localStorage.getItem('cart')) : []
  let userInfoStorage = JSON.parse(localStorage.getItem('user_info'))
  if (Array.isArray(cart) && cart.length > 0) {
    addCartToDom({
      idListCart: 'listCart',
      cart,
      idNumOrder: 'numOrder',
      idNum: '#num.numDesktop',
      idTotalPrice: 'totalPrice',
    })
    renderListProductInCart({
      idTable: 'tableCart',
      cart,
      idTotalPrice: 'total-price',
      userInfoStorage,
    })
  }
  document.addEventListener('click', function (e) {
    if (e.target.matches('#btn-buy-product')) {
      window.location.assign('/products.html')
    } else if (e.target.matches('#btn-remove-product')) {
      cart?.forEach((item) => {
        if (+item.userID === +userInfoStorage.user_id) {
          localStorage.removeItem('cart')
          sweetAlert.error('Xoá toàn bộ giỏ hàng?')
          setTimeout(() => {
            window.location.assign('/cart.html')
          }, 5000)
        }
      })
    }
  })
})()
