import userApi from './api/userApi'
import {
  addCartToDom,
  hideSpinner,
  initUserForm,
  setBackgroundImage,
  setFieldValue,
  showSpinner,
  toast,
} from './utils'
function displayTagLink(ulElement) {
  ulElement.textContent = ''
  const infoArr = ['Cập nhật thông tin', 'Quản lý đơn hàng', 'Đăng xuất']
  for (let i = 0; i < infoArr.length; ++i) {
    const liElement = document.createElement('li')
    liElement.innerHTML = `<a href="#" title="${infoArr[i]}">${infoArr[i]}</a>`
    ulElement.appendChild(liElement)
  }
}
async function displayInfoUser(userID, divInfoLeftEl, userAvatarEl) {
  if (!userID) return
  try {
    showSpinner()
    const infoUser = await userApi.getById(userID)
    hideSpinner()
    setFieldValue(divInfoLeftEl, "input[name='fullname']", infoUser?.fullname)
    setFieldValue(divInfoLeftEl, "input[name='username']", infoUser?.username)
    setFieldValue(divInfoLeftEl, "input[name='email']", infoUser?.email)
    setFieldValue(divInfoLeftEl, "input[name='phone']", infoUser?.phone)
    setBackgroundImage(userAvatarEl, 'img#avatar', infoUser?.imageUrl)
  } catch (error) {
    console.log('failed to fetch data', error)
  }
}
async function renderInfoAccount({ idElement, infoUserStorage, divInfoLeft, divInfoRight }) {
  const ulElement = document.getElementById(idElement)
  const divInfoLeftEl = document.getElementById(divInfoLeft)
  const userAvatarEl = document.getElementById(divInfoRight)
  if (!ulElement || !divInfoLeftEl || !userAvatarEl) return
  if (infoUserStorage.length === 0) {
    divInfoLeftEl.classList.add('is-hide')
    userAvatarEl.classList.add('is-hide')
  }
  for (const user of infoUserStorage) {
    if (user.access_token) {
      displayTagLink(ulElement)
      displayInfoUser(user.user_id, divInfoLeftEl, userAvatarEl)
    }
    break
  }
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
    }
  })
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
    divInfoLeft: 'userInfo',
    divInfoRight: 'userAvatar',
  })
  handleOnClick()
})()
