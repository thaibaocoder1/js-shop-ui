import userApi from './api/userApi'
import {
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
  if (infoUserStorage) {
    displayTagLink(ulElement)
    displayInfoUser(infoUserStorage.user_id, divInfoLeftEl, userAvatarEl)
  } else {
    divInfoLeftEl.classList.add('is-hide')
    userAvatarEl.classList.add('is-hide')
  }
}
function handleOnClick() {
  // add event for element render after dom
  document.addEventListener('click', async function (e) {
    const { target } = e
    if (target.matches("a[title='Đăng xuất']")) {
      localStorage.removeItem('user_info')
      toast.info('Redirect page login')
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
    }
  })
}
// main
;(() => {
  let infoUserStorage
  if (localStorage.getItem('user_info') !== null) {
    infoUserStorage = JSON.parse(localStorage.getItem('user_info'))
  }
  renderInfoAccount({
    idElement: 'accountUser',
    infoUserStorage,
    divInfoLeft: 'userInfo',
    divInfoRight: 'userAvatar',
  })
  handleOnClick()
})()
