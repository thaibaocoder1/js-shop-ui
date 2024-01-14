import productApi from './api/productsApi'
import {
  formatCurrencyNumber,
  handleChangeQuantity,
  hideSpinner,
  showSpinner,
  sweetAlert,
  toast,
} from './utils'

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
  tableBodyElement.textContent = ''
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
        <input type="checkbox" name="product" class="checkbox2" data-id="${
          item.productID
        }" value="${productInfo.discount * item.quantity}" ${
          item.isChecked === true ? 'checked' : ''
        } />
        </td>
        <td>${productInfo.code}</td>
        <td>
          <a href="" title="" class="thumb">
            <img src="public/images/${productInfo.thumb}" alt="${productInfo.name}" />
          </a>
        </td>
        <td>
          <a href="/product-detail.html?id=${productInfo.id}" title="" class="name-product">${
          productInfo.name
        }</a>
        </td>
        <td>${formatCurrencyNumber(productInfo.discount)}</td>
        <td>
          <input min="1" data-id="${item.productID}" type="number" name="num-order" value="${
          item.quantity
        }" class="num-order" />
        </td>
        <td id="priceProduct">${formatCurrencyNumber(productInfo.discount * item.quantity)}</td>
        <td>
          <a href="" data-id="${
            item.productID
          }" title="" class="del-product"><i class="fa fa-trash-o"></i></a>
        </td>`
        tableBodyElement.appendChild(tableRowElement)
      }
    })
    // event delegations after render dom
    let checkedProducts = cart.filter((item) => item.isChecked)
    let totalTemp = checkedProducts.reduce((total, item) => {
      return total + item.quantity * item.price
    }, 0)
    document.getElementById(
      idTotalPrice,
    ).innerHTML = `Tổng thanh toán: <span>${formatCurrencyNumber(totalTemp)}</span>`
    const listCheckbox = tableBodyElement.querySelectorAll("input[name='product']")
    if (listCheckbox.length > 0) {
      listCheckbox.forEach((checkbox) => {
        checkbox.addEventListener('click', () => {
          const priceProduct = +checkbox.value
          const productID = +checkbox.dataset.id
          const existingProduct = checkedProducts.find((item) => item.productID === productID)
          if (checkbox.checked) {
            if (!existingProduct) {
              const newItem = cart.find((item) => item.productID === productID)
              checkedProducts.push(newItem)
            }
            totalTemp += priceProduct
          } else {
            totalTemp -= priceProduct
            if (existingProduct) {
              checkedProducts = checkedProducts.filter((item) => item.productID !== productID)
            }
          }
          const newCart = cart.filter((item) => {
            if (item.productID === productID) {
              item.isChecked = checkbox.checked
              item.price = priceProduct
            }
            return item
          })
          localStorage.setItem('cart', JSON.stringify(newCart))
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
  } else {
    document.getElementById('btn-remove-product').hidden = true
  }
  document.addEventListener('click', async function (e) {
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
    } else if (e.target.matches('#checkout-cart')) {
      e.preventDefault()
      const listCheckbox = document.querySelectorAll("input[type='checkbox']")
      let isAnyCheckboxChecked = false
      if (cart.length === 0) {
        toast.error('Không có sản phẩm trong giỏ hàng')
      } else {
        listCheckbox.forEach((checkbox) => {
          if (checkbox.checked) {
            isAnyCheckboxChecked = true
            window.location.assign('/checkout.html')
          }
        })
        if (!isAnyCheckboxChecked) toast.error('Chọn 1 sản phẩm để thanh toán')
      }
    } else if (e.target.closest('.del-product')) {
      e.preventDefault()
      const productID = +e.target.closest('.del-product').dataset.id
      const productIndex = cart.findIndex((item) => +item.productID === productID)
      if (productIndex >= 0) {
        toast.info('Xoá sản phẩm thành công')
        cart.splice(productIndex, 1)
        localStorage.setItem('cart', JSON.stringify(cart))
        e.target.parentElement.parentElement.parentElement.remove()
        addCartToDom({
          idListCart: 'listCart',
          cart,
          idNumOrder: 'numOrder',
          idNum: '#num.numDesktop',
          idTotalPrice: 'totalPrice',
        })
      }
    } else if (e.target.matches("input[type='number'].num-order")) {
      const inputValue = parseInt(+e.target.value, 10)
      const productID = +e.target.dataset.id
      const index = cart.findIndex((item) => +item.productID === productID)
      const product = await productApi.getById(productID)
      if (isNaN(inputValue) || inputValue < 0) {
        toast.error('Không được chỉnh về số âm')
      }
      cart = handleChangeQuantity(inputValue, cart, productID)
      await addCartToDom({
        idListCart: 'listCart',
        cart,
        idNumOrder: 'numOrder',
        idNum: '#num.numDesktop',
        idTotalPrice: 'totalPrice',
      })
      const productPrice = e.target.parentElement.parentElement.querySelector('#priceProduct')
      const productTotalPrice =
        e.target.parentElement.parentElement.parentElement.nextElementSibling.querySelector(
          '#total-price',
        )
      productPrice.innerHTML = `${formatCurrencyNumber(cart[index].quantity * product.discount)}`
      let total = cart.reduce((total, item) => {
        return total + item.quantity * product.discount
      }, 0)
      productTotalPrice.innerHTML = `Tổng thanh toán: <span>${formatCurrencyNumber(total)}</span>`
    }
  })
})()
