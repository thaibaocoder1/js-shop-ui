import userApi from '../api/userApi'
import { hideSpinner, showSpinner } from '../utils'

async function renderListUser({ idTable }) {
  const table = document.getElementById(idTable)
  if (!table) return
  const tbody = table.getElementsByTagName('tbody')[0]
  if (!tbody) return
  try {
    showSpinner()
    const users = await userApi.getAll()
    hideSpinner()
    users?.forEach((item, index) => {
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
      tbody.appendChild(tableRow)
    })
  } catch (error) {
    console.log('failed to fetch data', error)
  }
}
// main
;(() => {
  renderListUser({
    idTable: 'listUserTable',
  })
})()