import productApi from '../api/productsApi'
import { formatCurrencyNumber, hideSpinner, showSpinner } from '../utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

async function renderListProductAdmin({ idElement }) {
  const table = document.getElementById(idElement)
  if (!table) return
  const tbody = table.getElementsByTagName('tbody')[0]
  if (!tbody) return
  try {
    showSpinner()
    const products = await productApi.getAll()
    hideSpinner()
    products?.forEach((item, index) => {
      const tableRow = document.createElement('tr')
      tableRow.innerHTML = `<td><input type="checkbox" name="checkItem" class="checkItem" /></td>
      <td><span class="tbody-text">${index + 1}</span></td>
      <td><span class="tbody-text">${item.code}</span></td>
      <td>
        <div class="tbody-thumb">
          <img src="/public/images/${item.thumb}" alt="${item.name}" />
        </div>
      </td>
      <td class="clearfix">
        <div class="tb-title fl-left">
          <a href="/product-detail.html?id=${item.id}" title="${item.name}">${item.name}</a>
        </div>
      </td>
      <td><span class="tbody-text">${formatCurrencyNumber(
        (item.price * (100 - Number.parseInt(item.discount))) / 100,
      )}</span></td>
      <td><span class="tbody-text">${item.quantity}</span></td>
      <td><span class="tbody-text">${
        Number.parseInt(item.quantity) <= 50
          ? 'Sắp hết hàng'
          : Number.parseInt(item.quantity) <= 150
          ? 'Dưới 150'
          : 'Còn hàng'
      }</span></td>
      <td><span class="tbody-text">Admin</span></td>
      <td><span class="tbody-text">${dayjs(item.timer).fromNow()}</span></td>
      <td>
        <button class="btn btn-primary" id="editProduct" data-id="${item.id}">Chỉnh sửa</button>
      </td>`
      tbody.appendChild(tableRow)
    })
  } catch (error) {
    console.log('failed to fetch data', error)
  }
}
// main
;(() => {
  renderListProductAdmin({
    idElement: 'listProductTable',
  })
  window.addEventListener('load', function () {
    const buttonProducts = document.querySelectorAll('button#editProduct')
    if (buttonProducts) {
      buttonProducts.forEach((button) => {
        button.addEventListener('click', function () {
          const productID = +button.dataset.id
          window.location.assign(`/admin/edit-product.html?id=${productID}`)
        })
      })
    }
  })
})()
