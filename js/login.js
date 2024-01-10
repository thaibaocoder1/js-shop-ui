import userApi from './api/userApi'
import { toast } from './utils'
async function handleOnSubmitForm(data) {
  try {
    const users = await userApi.getAll()
    for (const user of users) {
      if (user.email === data.email && user.password === data.password) {
        toast.success('Login successfully')
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
