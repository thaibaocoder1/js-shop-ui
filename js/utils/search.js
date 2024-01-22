import userApi from '../api/userApi'
import debounce from 'lodash.debounce'
import diacritics from 'diacritics'
import productApi from '../api/productsApi'
import { formatCurrencyNumber } from './format'
import dayjs from 'dayjs'

export function initSearchInput({ idElement, idTable }) {
  const searchInput = document.getElementById(idElement)
  const table = document.getElementById(idTable)
  if (!searchInput || !table) return
  const tbodyEl = table.getElementsByTagName('tbody')[0]
  const debounceSearch = debounce(async (e) => {
    const users = await userApi.getAll()
    const userApply = users.filter((user) =>
      diacritics.remove(user?.fullname.toLowerCase()).includes(e.target.value.toLowerCase()),
    )
    tbodyEl.innerHTML = ''
    userApply?.forEach((item, index) => {
      const tableRow = document.createElement('tr')
      tableRow.innerHTML = `<td><input type="checkbox" name="checkItem" class="checkItem" /></td>
      <td><span class="tbody-text">${index + 1}</span></td>
      <td><span class="tbody-text">${item.id}</span></td>
      <td><span class="tbody-text">${item.fullname}</span></td>
      <td><span class="tbody-text">${item.username}</span></td>
      <td><span class="tbody-text">${item.phone}</span></td>
      <td><span class="tbody-text">${item.email}</span></td>
      <td><span class="tbody-text">${+item.roleID === 1 ? 'Khách hàng' : 'Admin'}</span></td>
      <td>
        <button class="btn btn-primary" data-id="${item.id}" id="editUser">Chỉnh sửa</button>
      </td>`
      tbodyEl.appendChild(tableRow)
    })
  }, 500)
  searchInput.addEventListener('input', debounceSearch)
}
export function initSearchInputProduct({ idElement, idTable }) {
  const searchInput = document.getElementById(idElement)
  const table = document.getElementById(idTable)
  if (!searchInput || !table) return
  const tbodyEl = table.getElementsByTagName('tbody')[0]
  const debounceSearch = debounce(async (e) => {
    const products = await productApi.getAll()
    const productApply = products.filter((product) =>
      diacritics.remove(product?.name.toLowerCase()).includes(e.target.value.toLowerCase()),
    )
    tbodyEl.innerHTML = ''
    productApply?.forEach((item, index) => {
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
      tbodyEl.appendChild(tableRow)
    })
  }, 500)
  searchInput.addEventListener('input', debounceSearch)
}
