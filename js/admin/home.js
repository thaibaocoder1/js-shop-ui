import { toast, checkLogoutAccount } from '../utils'

function checkRoleAccount(infoUserStorage) {
  const hasRoleID2 = infoUserStorage.some((user) => user?.roleID === 2)
  if (hasRoleID2) {
    if (window.location.pathname === '/admin/index.html')
      toast.success('Chào mừng admin đã đăng nhập!')
  } else {
    window.location.assign('/admin/login.html')
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
  document.addEventListener('click', function (e) {
    const { target } = e
    if (target.matches("a[title='Thoát']")) {
      e.preventDefault()
      checkLogoutAccount()
    }
  })
})()
