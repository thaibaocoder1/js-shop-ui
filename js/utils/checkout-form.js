import userApi from '../api/userApi'
import { setFieldValue } from './common'
function setValuesForm(formCheckout, user) {
  setFieldValue(formCheckout, "input[name='fullname']", user?.fullname)
  setFieldValue(formCheckout, "input[name='email']", user?.email)
  setFieldValue(formCheckout, "input[name='phone']", user?.phone)
}
function getValuesForm(formCheckout) {
  const formValues = {}
  const data = new FormData(formCheckout)
  for (const [key, value] of data) {
    formValues[key] = value
  }
  return formValues
}
export async function initFormCheckout({ idForm, infoUserStorage, onSubmit }) {
  const formCheckout = document.querySelector(idForm)
  if (!formCheckout) return
  if (infoUserStorage) {
    const user = await userApi.getById(infoUserStorage.user_id)
    setValuesForm(formCheckout, user)
    formCheckout.addEventListener('submit', function (e) {
      e.preventDefault()
      const formValues = getValuesForm(formCheckout)
    })
  }
}
