import productApi from './api/productsApi'
import { formatCurrencyNumber, renderListCategory } from './utils'

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
    const data = await productApi.getById(productID)
    breadcrumbTitleEl.innerText = data.name
    infoProductRight.innerHTML = `<h3 class="product-name">${data.name}</h3>
    <div class="desc">
      <p>${data.description}</p>
    </div>
    <div class="num-product">
      <span class="title">Sản phẩm: </span>
      <span class="status">${
        Number.parseInt(data.status) === 1
          ? 'Còn hàng'
          : Number.parseInt(data.status) === 1
          ? 'Ngưng bán'
          : 'Hết hàng'
      }</span>
    </div>
    <p class="price">${formatCurrencyNumber(data.discount)}</p>
    <div id="num-order-wp">
      <a title="" id="minus"><i class="fa fa-minus"></i></a>
      <input type="text" name="num-order" value="1" id="num-order" />
      <a title="" id="plus"><i class="fa fa-plus"></i></a>
    </div>
    <a href="/cart.html" title="Thêm giỏ hàng" class="add-cart">Thêm giỏ hàng</a>`
    infoProductDesc.innerHTML = `<p>${data.description}</p>`
    // fetch list product same category
    await renderListProductSameCategory('listProductSame', data.category_id, productID)
  } catch (err) {
    console.log('failed to fetch detail product', err)
  }
}
async function renderListProductSameCategory(selector, categoryID, productID) {
  const divElement = document.getElementById(selector)
  if (!divElement) return
  // divElement.textContent = ''
  const data = await productApi.getAll()
  const listProductSame = data.filter((item) => Number.parseInt(item.category_id) === +categoryID)
  const listProductFinal = listProductSame.filter((item) => Number.parseInt(item.id) !== productID)
}
// main
;(() => {
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
})()
