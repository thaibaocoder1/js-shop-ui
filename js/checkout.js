import productApi from './api/productsApi'
import {
  addCartToDom,
  formatCurrencyNumber,
  hideSpinner,
  initFormCheckout,
  showSpinner,
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
      showSpinner()
      const product = await productApi.getById(+item.productID)
      hideSpinner()
      totalPrice += product.discount * item.quantity
      const tableRow = document.createElement('tr')
      tableRow.classList.add('cart-item')
      tableRow.innerHTML = `<td class="product-name">
      ${product.name}<strong class="product-quantity">x ${item.quantity}</strong>
    </td>
    <td class="product-total">${formatCurrencyNumber(item.quantity * product.discount)}</td>`
      tableBodyEl.appendChild(tableRow)
      const totalPriceEl = tableElement.querySelector(idTotalPrice)
      if (totalPriceEl) totalPriceEl.textContent = formatCurrencyNumber(totalPrice)
    })
  } catch (error) {
    console.log('failed to fetch data', error)
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
      infoUserStorage,
      onSubmit: (data) => console.log('data', data),
    })
    displayProductInCart({
      idTable: 'tableCheckout',
      idTotalPrice: '#totalPriceCheckout',
      cart,
    })
  } else {
    console.log('empty cart')
  }
})()
{
  /* <tr class="cart-item">
                  <td class="product-name">
                    Son môi nữ cá tính<strong class="product-quantity">x 1</strong>
                  </td>
                  <td class="product-total">350.000đ</td>
                </tr> */
}
