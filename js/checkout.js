import orderApi from './api/orderApi'
import orderDetailApi from './api/orderDetailApi'
import productApi from './api/productsApi'
import {
  addCartToDom,
  formatCurrencyNumber,
  hideSpinner,
  initFormCheckout,
  showSpinner,
  toast,
} from './utils'

function displayProductInCart({ idTable, idTotalPrice, cart }) {
  const tableElement = document.getElementById(idTable)
  if (!tableElement) return
  const tableBodyEl = tableElement.getElementsByTagName('tbody')[0]
  if (!tableBodyEl) return
  tableBodyEl.textContent = ''
  let totalPrice = 0
  try {
    cart?.forEach(async (item) => {
      if (item.isBuyNow || item.isChecked) {
        showSpinner()
        const product = await productApi.getById(+item.productID)
        hideSpinner()
        totalPrice += product.discount * item.quantity
        const tableRow = document.createElement('tr')
        tableRow.classList.add('cart-item')
        tableRow.innerHTML = `<td class="product-name">${
          product.name
        }<strong class="product-quantity">x ${item.quantity}</strong>
      </td>
      <td class="product-total">${formatCurrencyNumber(item.quantity * product.discount)}</td>`
        tableBodyEl.appendChild(tableRow)
        const totalPriceEl = tableElement.querySelector(idTotalPrice)
        if (totalPriceEl) totalPriceEl.textContent = formatCurrencyNumber(totalPrice)
      }
    })
  } catch (error) {
    console.log('failed to fetch data', error)
  }
}
async function handleAddOrder(orderID, formValues, cart) {
  const orderData = await orderApi.add(formValues)
  orderID = orderData.id
  for (const item of cart) {
    if (item.isChecked || item.isBuyNow) {
      const product = await productApi.getById(item.productID)
      item['orderID'] = orderID
      item['price'] = product.discount
      await orderDetailApi.add(item)
    }
  }
}
async function handleCheckoutFormSubmit(formValues, userID, cart) {
  let orderID = null
  try {
    formValues['userID'] = userID
    formValues['orderDate'] = new Date().getTime()
    formValues['orderStatus'] = 1
    const listOrder = await orderApi.getAll()
    if (Array.isArray(listOrder)) {
      if (listOrder.length === 0) {
        await handleAddOrder(orderID, formValues, cart)
        orderID = null
      } else if (listOrder.length > 0) {
        await handleAddOrder(orderID, formValues, cart)
        orderID = null
      }
    }
    const newCart = cart.filter((item) => !item.isBuyNow && !item.isChecked)
    toast.success('Thanh toán thành công')
    localStorage.setItem('cart', JSON.stringify(newCart))
    setTimeout(() => {
      window.location.assign('/index.html')
    }, 2000)
  } catch (error) {
    console.log('failed to checkout', error)
  }
}
// main
;(() => {
  let cart = localStorage.getItem('cart') !== null ? JSON.parse(localStorage.getItem('cart')) : []
  let infoUserStorage =
    localStorage.getItem('user_info') !== null ? JSON.parse(localStorage.getItem('user_info')) : []
  if (Array.isArray(cart) && cart.length > 0) {
    addCartToDom({
      idListCart: 'listCart',
      cart,
      idNumOrder: 'numOrder',
      idNum: '#num.numDesktop',
      idTotalPrice: 'totalPrice',
    })
    initFormCheckout({
      idForm: '#formCheckout',
      cart,
      infoUserStorage,
      onSubmit: handleCheckoutFormSubmit,
    })
    displayProductInCart({
      idTable: 'tableCheckout',
      idTotalPrice: '#totalPriceCheckout',
      cart,
    })
  } else {
    document.addEventListener('click', function (e) {
      const { target } = e
      if (target.matches('#order-now')) {
        e.preventDefault()
        toast.error('Không có sản phẩm trong giỏ hàng')
      }
    })
  }
})()
