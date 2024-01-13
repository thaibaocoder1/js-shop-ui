import userApi from './api/userApi'
import { hideSpinner, showSpinner, toast } from './utils'
async function handleOnSubmitForm(data) {
  try {
    showSpinner()
    const users = await userApi.getAll()
    hideSpinner()
    const infoUser = {}
    for (const user of users) {
      if (user.email === data.email && user.password === data.password) {
        toast.success('Login successfully')
        infoUser['access_token'] = `Bearer ${new Date().getTime()}`
        infoUser['user_id'] = user.id
        console.log(infoUser)
        localStorage.setItem('user_info', JSON.stringify(infoUser))
        setTimeout(() => {
          window.location.assign('/index.html')
        }, 2000)
      } else {
        toast.error('Login failed')
      }
    }
  } catch (error) {
    console.log('error', error)
  }
}
// main
;(() => {
  // check if exists access_token
  const accessToken = localStorage.getItem('access_token')
  if (accessToken !== null) {
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
