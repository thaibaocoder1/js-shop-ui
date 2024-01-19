import productApi from './api/productsApi'
import {
  addCartToDom,
  addProductToCart,
  formatCurrencyNumber,
  hideSpinner,
  initSwiper,
  renderListCategory,
  showSpinner,
  sweetAlert,
  toast,
} from './utils'

async function renderDetailProduct({
  boxIDRight,
  boxIDLeft,
  boxIDDesc,
  breadcrumbTitle,
  productID,
}) {
  const infoProductRight = document.getElementById(boxIDRight)
  const infoProductLeft = document.getElementById(boxIDLeft)
  const infoProductDesc = document.getElementById(boxIDDesc)
  const breadcrumbTitleEl = document.getElementById(breadcrumbTitle)
  if (!infoProductRight || !infoProductLeft || !breadcrumbTitle || !infoProductDesc) return
  try {
    showSpinner()
    const data = await productApi.getById(productID)
    hideSpinner()
    const mainImg = infoProductLeft.querySelector('#zoom')
    if (!mainImg) return
    mainImg.src = `/public/images/${data.thumb}`
    mainImg.setAttribute('data-zoom-image', `public/images/${data.thumb}`)
    mainImg.style = `width: 340px; height: 340px; display: block; object-fit: contain;`
    breadcrumbTitleEl.innerText = data.name
    infoProductRight.innerHTML = `<h3 class="product-name">${data.name}</h3>
    <div class="desc">
      <p>${data.description}</p>
    </div>
    <div class="num-product">
      <span class="title">Sản phẩm: </span>
      <span class="status">${
        Number.parseInt(data.quantity) === 0 && Number.parseInt(data.status) === 0
          ? 'Ngưng bán'
          : Number.parseInt(data.quantity) === 0 && Number.parseInt(data.status) === 1
          ? 'Đợi nhập hàng'
          : Number.parseInt(data.quantity) <= 20 && Number.parseInt(data.status) === 1
          ? 'Sắp hết hàng'
          : 'Còn hàng'
      }</span>
    </div>
    <p class="price">${formatCurrencyNumber(
      (data.price * (100 - Number.parseInt(data.discount))) / 100,
    )}</p>
    <div id="num-order-wp">
      <span id="minus"><i class="fa fa-minus"></i></span>
      <input type="text" value="1" data-quantity="1" name="num-order" id="num-order" />
      <span id="plus"><i class="fa fa-plus"></i></span>
    </div>
    <a href="/cart.html" data-id=${data.id} title="Thêm giỏ hàng" class="add-cart" "${
      Number.parseInt(data.quantity) === 0
        ? Number.parseInt(data.status) === 0 || Number.parseInt(data.status) === 1
          ? 'hidden'
          : ''
        : ''
    }">Thêm giỏ hàng</a>`
    infoProductDesc.innerHTML = `<p>${data.description}</p>`
    // fetch list product same category
    await renderListProductSameCategory({
      idElement: 'listProductSame',
      swiperWrapper: '.swiper-wrapper',
      categoryID: +data.category_id,
      productID,
    })
  } catch (err) {
    console.log('failed to fetch detail product', err)
  }
}
async function renderListProductSameCategory({ idElement, swiperWrapper, categoryID, productID }) {
  const divElement = document.getElementById(idElement)
  if (!divElement) return
  const swiperWrapperEl = divElement.querySelector(swiperWrapper)
  if (!swiperWrapperEl) return
  try {
    const data = await productApi.getAll()
    const listProductSame = data.filter((item) => Number.parseInt(item.category_id) === +categoryID)
    const listProductFinal = listProductSame.filter(
      (item) => Number.parseInt(item.id) !== productID,
    )
    listProductFinal.forEach((item) => {
      const divElement = document.createElement('div')
      divElement.classList.add('swiper-slide', 'swiper-slide--custom')
      divElement.dataset.id = item.id
      divElement.innerHTML = `
      <a href="/product-detail.html?id=${item.id}" title="" class="thumb">
      <img src="/public/images/${item.thumb}" alt="${item.name}" />
      </a>
      <a href="/product-detail.html?id=${item.id}" title="" class="product-name">${item.name}</a>
      <div class="price">
        <span class="new">${formatCurrencyNumber(
          (item.price * (100 - Number.parseInt(item.discount))) / 100,
        )}</span>
        <span class="old">${formatCurrencyNumber(item.price)}</span>
      </div>
      <div class="action clearfix">
        <a href="/cart.html" title="Thêm giỏ hàng" id="btn-cart" class="btn-custom add-cart fl-left">Thêm giỏ hàng</a>
        <a href="/checkout.html" title="Mua ngay" id="btn-buynow" class="btn-custom buy-now fl-right">Mua ngay</a>
      </div>`
      swiperWrapperEl.appendChild(divElement)
      initSwiper()
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
  let isCartAdded = false

  if (Array.isArray(cart) && cart.length > 0) {
    cart.forEach((item) => {
      if (infoUserStorage.length === 1) {
        if (item.userID === infoUserStorage.user_id && !isCartAdded) {
          addCartToDom({
            idListCart: 'listCart',
            cart,
            userID: infoUserStorage.user_id,
            idNumOrder: 'numOrder',
            idNum: '#num.numDesktop',
            idTotalPrice: 'totalPrice',
          })
        }
        isCartAdded = true
      } else {
        const user = infoUserStorage.find((user) => user.roleID === 1)
        if (user) {
          if (item.userID === user.user_id && !isCartAdded) {
            addCartToDom({
              idListCart: 'listCart',
              cart,
              userID: user.user_id,
              idNumOrder: 'numOrder',
              idNum: '#num.numDesktop',
              idTotalPrice: 'totalPrice',
            })
          }
          isCartAdded = true
        }
      }
    })
  }
  renderListCategory('#listCategory')
  const searchParams = new URLSearchParams(location.search)
  const productID = Number.parseInt(searchParams.get('id'))
  if (!productID) return
  renderDetailProduct({
    boxIDRight: 'infoProductRight',
    boxIDLeft: 'infoProductLeft',
    boxIDDesc: 'infoProductDesc',
    breadcrumbTitle: 'breadcrumb-title',
    productID,
  })
  // event delegations
  document.addEventListener('click', async function (e) {
    const { target } = e
    if (target.matches('.add-cart')) {
      e.preventDefault()
      const infoUserStorage =
        localStorage.getItem('user_info') !== null
          ? JSON.parse(localStorage.getItem('user_info'))
          : []
      if (Array.isArray(infoUserStorage) && infoUserStorage.length > 0) {
        const productID = +target.dataset.id
        if (productID) {
          sweetAlert.success('Tuyệt vời!')
          const numOrderEl = target.previousElementSibling?.querySelector("[name='num-order']")
          let quantity = 1
          if (numOrderEl) {
            quantity = +numOrderEl.dataset.quantity
          }
          cart = addProductToCart(productID, cart, infoUserStorage, quantity)
          toast.success('Thêm sản phẩm thành công')
          setTimeout(() => {
            window.location.assign(`/product-detail.html?id=${productID}`)
          }, 1000)
        }
      } else {
        toast.error('Đăng nhập để mua sản phẩm')
        setTimeout(() => {
          window.location.assign('/login.html')
        }, 2000)
      }
    } else if (target.closest('#minus')) {
      const parent = target.closest('#num-order-wp')
      if (!parent) return
      const numOrderDetail = parent.querySelector('#num-order')
      if (+numOrderDetail.value <= 1) {
        numOrderDetail.value = 1
        toast.error('Số lượng tối thiểu là 1')
      } else {
        numOrderDetail.value--
        numOrderDetail.dataset.quantity = numOrderDetail.value--
      }
    } else if (target.closest('#plus')) {
      const parent = target.closest('#num-order-wp')
      if (!parent) return
      const numOrderDetail = parent.querySelector('#num-order')
      if (+numOrderDetail.value >= 1) {
        numOrderDetail.value++
        numOrderDetail.dataset.quantity = +numOrderDetail.value
      }
    }
  })
})()
