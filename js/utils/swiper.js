import Swiper from 'swiper'
import 'swiper/css'
import productApi from '../api/productsApi'
import { formatCurrencyNumber } from './format'
export async function displaySwiper(selector) {
  const sliderWrapper = document.querySelector(selector)
  if (!sliderWrapper) return
  const product = await productApi.getAll()
  const productApply = product.slice(0, 8)
  productApply.forEach((item) => {
    const divElement = document.createElement('div')
    divElement.classList.add('swiper-slide', 'swiper-slide--custom')
    divElement.dataset.id = item.id
    divElement.innerHTML = `
    <a href="/product-detail.html?id=${item.id}" title="" class="thumb">
    <img src="/public/images/${item.thumb}" alt="${item.name}" />
    </a>
    <a href="/product-detail.html?id=${item.id}" title="" class="product-name">${item.name}</a>
    <div class="price">
      <span class="new">${formatCurrencyNumber(item.discount)}</span>
      <span class="old">${formatCurrencyNumber(item.price)}</span>
    </div>
    <div class="action clearfix">
      <a href="/cart.html" title="Thêm giỏ hàng" id="btn-cart" class="btn-custom add-cart fl-left">Thêm giỏ hàng</a>
      <a href="/checkout.html" title="Mua ngay" id="btn-buynow" class="btn-custom buy-now fl-right">Mua ngay</a>
    </div>`
    sliderWrapper.appendChild(divElement)
    initSwiper()
  })
}
export function initSwiper() {
  const swiper = new Swiper('.swiper', {
    // Optional parameters
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  })
}
