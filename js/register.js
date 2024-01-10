import userApi from './api/userApi'
import { toast } from './utils'
async function handleOnSubmitForm(data) {
  try {
    const listUser = await userApi.getAll()
    listUser.forEach(async (user) => {
      if (user.email === data.email || user.username === data.username) {
        toast.error('Duplicate user. Please check again')
      } else {
        const infoUser = await userApi.add(data)
        if (infoUser) {
          toast.success('Register successfully')
          setTimeout(() => {
            window.location.assign('/login.html')
          }, 2000)
        } else {
          toast.error('Register failed')
        }
      }
    })
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
      Validator.isRequired('#fullname', 'Vui lòng nhập tên đầy đủ'),
      Validator.isRequired('#username', 'Vui lòng nhập tên đăng nhập'),
      Validator.isRequired('#email'),
      Validator.isEmail('#email'),
      Validator.isRequired('#phone'),
      Validator.isPhone('#phone'),
      Validator.isRequired('#password'),
      Validator.minLength('#password', 6),
      Validator.isRequired('#password_confirmation'),
      Validator.isConfirmed(
        '#password_confirmation',
        function () {
          return document.querySelector('#form-1 #password').value
        },
        'Mật khẩu nhập lại không khớp',
      ),
    ],
    onSubmit: handleOnSubmitForm,
  })
})()
