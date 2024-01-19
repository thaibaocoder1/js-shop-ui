import userApi from './api/userApi'
import orderApi from './api/orderApi'
import { addCartToDom, hideSpinner, initUserForm, showSpinner, toast } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
function displayTagLink(ulElement) {
  ulElement.textContent = ''
  const infoArr = ['Cập nhật thông tin', 'Quản lý đơn hàng', 'Đăng xuất']
  for (let i = 0; i < infoArr.length; ++i) {
    const liElement = document.createElement('li')
    liElement.innerHTML = `<a href="#" title="${infoArr[i]}">${infoArr[i]}</a>`
    ulElement.appendChild(liElement)
  }
}

async function renderInfoAccount({ idElement, infoUserStorage, divInfoLeft }) {
  const ulElement = document.getElementById(idElement)
  const divInfoLeftEl = document.getElementById(divInfoLeft)
  if (!ulElement || !divInfoLeftEl) return
  if (infoUserStorage.length === 0) {
    divInfoLeftEl.classList.add('is-hide')
    userAvatarEl.classList.add('is-hide')
  }
  for (const user of infoUserStorage) {
    if (user.access_token) {
      displayTagLink(ulElement)
    }
    break
  }
}

async function handleCancelOrder(orderID) {
  if (!orderID) return
  let isSuccess = false
  try {
    showSpinner()
    const order = await orderApi.getById(orderID)
    hideSpinner()
    if (order) {
      const orderStatus = +order.status
      if (orderStatus === 1) {
        await orderApi.delete(orderID)
        isSuccess = true
      } else {
        toast.error('Không thể huỷ đơn hàng')
      }
    }
  } catch (error) {
    console.log('failed to fetch data', error)
  }
  return isSuccess
}

function handleOnClick() {
  // add event for element render after dom
  document.addEventListener('click', async function (e) {
    const { target } = e
    if (target.matches("a[title='Đăng xuất']")) {
      const infoUserStorage = JSON.parse(localStorage.getItem('user_info'))
      if (infoUserStorage.length === 1) {
        localStorage.removeItem('user_info')
      } else {
        infoUserStorage.splice(0, 1)
        localStorage.setItem('user_info', JSON.stringify(infoUserStorage))
      }
      toast.info('Chuyển đến trang đăng nhập')
      setTimeout(() => {
        window.location.assign('/login.html')
      }, 2000)
    } else if (target.matches("a[title='Cập nhật thông tin']")) {
      window.location.assign('/update-info.html')
      try {
        const defaultValues = await userApi.getById(userID)
        initUserForm({
          formID: 'formUpdateUser',
          defaultValues,
          onSubmit: (formValues) => console.log('data', formValues),
        })
      } catch (e) {
        console.log('error', e)
      }
    } else if (target.matches("a[title='Quản lý đơn hàng']")) {
      window.location.assign('/order.html')
    } else if (target.matches('#orderDetail')) {
      const orderID = +target.dataset.id
      window.location.assign(`/detail-order.html?id=${orderID}`)
    } else if (target.matches('#cancelOrder')) {
      const orderID = +target.dataset.id
      const isCancel = await handleCancelOrder(orderID)
      if (isCancel) {
        toast.success('Huỷ đơn hàng thành công')
        const orderItem = target.parentElement.parentElement
        orderItem && orderItem.remove()
      }
    }
  })
}

function displayStatus(status) {
  if (!status) return
  if (+status !== 1) {
    return 'hidden'
  }
  return ''
}

async function renderListOrder({ idTable, infoUserStorage }) {
  const table = document.getElementById(idTable)
  if (!table) return
  const tbodyEl = table.getElementsByTagName('tbody')[0]
  if (!tbodyEl) return
  try {
    showSpinner()
    const orders = await orderApi.getAll()
    hideSpinner()
    if (infoUserStorage.length === 1) {
      const user = infoUserStorage[0]
      const userID = user.user_id
      const listOrderApply = orders.filter((order) => order.userID === userID)
      if (listOrderApply.length === 0) {
        toast.info('Bạn chưa mua đơn hàng nào')
        return
      }
      listOrderApply.forEach((item, index) => {
        const tableRow = document.createElement('tr')
        tableRow.dataset.id = item.id
        tableRow.innerHTML = `<th scope="row">${index + 1}</th>
        <td>${item.fullname}</td>
        <td>${item.email}</td>
        <td>${item.phone}</td>
        <td>${dayjs(item.orderDate).fromNow()}</td>
        <td>
          <button type="button" class="btn btn-primary" id="orderDetail" data-id="${
            item.id
          }">Chi tiết</button>
          <button type="button" id="cancelOrder" data-id="${
            item.id
          }" class="btn btn-danger" ${displayStatus(item.status)} >Huỷ đơn</button>
        </td>`
        tbodyEl.appendChild(tableRow)
      })
    } else {
      const user = infoUserStorage.find((user) => user?.roleID === 1)
      if (user) {
        console.log('user with id = 1')
      }
    }
  } catch (error) {
    console.log('failed to fetch data', error)
  }
}
// main
;(() => {
  // get cart from localStorage
  let cart = localStorage.getItem('cart') !== null ? JSON.parse(localStorage.getItem('cart')) : []
  let infoUserStorage =
    localStorage.getItem('user_info') !== null ? JSON.parse(localStorage.getItem('user_info')) : []
  let isCartAdded = false
  if (Array.isArray(cart) && cart.length > 0) {
    cart.forEach((item) => {
      if (infoUserStorage.length === 1) {
        if (item.userID === infoUserStorage[0].user_id && !isCartAdded) {
          addCartToDom({
            idListCart: 'listCart',
            cart,
            userID: infoUserStorage[0].user_id,
            idNumOrder: 'numOrder',
            idNum: '#num.numDesktop',
            idTotalPrice: 'totalPrice',
          })
          isCartAdded = true
        }
      } else {
        const user = infoUserStorage.find((user) => user?.roleID === 1)
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
            isCartAdded = true
          }
        }
      }
    })
  }
  renderInfoAccount({
    idElement: 'accountUser',
    infoUserStorage,
    divInfoLeft: 'listOrderUser',
  })
  renderListOrder({
    idTable: 'listOrderUser',
    infoUserStorage,
  })
  handleOnClick()
})()
