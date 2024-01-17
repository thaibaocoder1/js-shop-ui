import userApi from './api/userApi'
import { hideSpinner, showSpinner, toast } from './utils'
async function handleOnSubmitForm(data) {
  try {
    showSpinner()
    const users = await userApi.getAll()
    hideSpinner()
    const infoUser = []
    let isChecked = false
    for (const user of users) {
      if (isChecked) break
      if (user.email === data.email && user.password === data.password) {
        isChecked = true
        toast.success('Login successfully')
        infoUser.push({
          access_token: `Bearer ${new Date().getTime()}`,
          user_id: user.id,
        })
        localStorage.setItem('user_info', JSON.stringify(infoUser))
        setTimeout(() => {
          window.location.assign('/index.html')
        }, 2000)
      }
    }
  } catch (error) {
    toast.error('Login failed')
  }
}
// main
;(() => {
  // check if exists access_token
  let infoUser = localStorage.getItem('user_info')
  if (infoUser !== null) {
    window.location.assign('/index.html')
  }
  Validator({
    formID: '#form-1',
    formGroupSelector: '.form-group',
    errorSelector: '.form-message',
    rules: [
      Validator.isRequired('#email'),
      Validator.isEmail('#email'),
      Validator.isRequired('#password'),
      Validator.minLength('#password', 6),
    ],
    onSubmit: handleOnSubmitForm,
  })
})()
