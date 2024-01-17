import userApi from '../api/userApi'
import { hideSpinner, showSpinner, toast } from '../utils'

async function checkRoleAccount(infoUserStorage) {
  try {
    let shouldRedirect = true
    for (const user of infoUserStorage) {
      showSpinner()
      const users = await userApi.getById(user?.user_id)
      hideSpinner()
      if (user.roleID === '') {
        window.location.assign('/admin/login.html')
        shouldRedirect = false
        break
      }
    }
    if (shouldRedirect) {
      const hasRoleID2 = infoUserStorage.some((user) => user?.roleID === 2)
      if (hasRoleID2) {
        toast.success('Chào mừng admin đã đăng nhập!')
      }
    }
  } catch (error) {
    toast.error('Có lỗi trong khi xử lý')
  }
}
// main
;(() => {
  let infoUserStorage =
    localStorage.getItem('user_info') !== null ? JSON.parse(localStorage.getItem('user_info')) : []
  if (infoUserStorage.length === 0) {
    window.location.assign('/admin/login.html')
  } else {
    checkRoleAccount(infoUserStorage)
  }
})()
