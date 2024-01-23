import userApi from '../api/userApi'
import { setFieldError, setFieldValue } from './common'
import * as yup from 'yup'
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
function getCheckoutSchema() {
  return yup.object({
    fullname: yup.string().required('Phải nhập tên đầy dủ'),
    email: yup
      .string()
      .required('Không được để trống trường này')
      .email('Trường này phải là email'),
    address: yup.string().required('Không được để trống trường này'),
    phone: yup
      .string()
      .required('Không được để trống trường này')
      .matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ')
      .typeError('Trường này chỉ nhập số'),
    note: yup.string(),
  })
}
async function validateCheckoutForm(formCheckout, formValues) {
  try {
    ;['fullname', 'email', 'address', 'phone', 'note'].forEach((name) =>
      setFieldError(formCheckout, name, ''),
    )
    const schema = getCheckoutSchema()
    await schema.validate(formValues, {
      abortEarly: false,
    })
  } catch (error) {
    const errorLog = {}
    for (const validationError of error.inner) {
      const name = validationError.path
      if (errorLog[name]) continue
      setFieldError(formCheckout, name, validationError.message)
      errorLog[name] = true
    }
  }
  const isValid = formCheckout.checkValidity()
  if (!isValid) formCheckout.classList.add('was-validated')
  return isValid
}
export async function initFormCheckout({ idForm, cart, infoUserStorage, onSubmit }) {
  const formCheckout = document.querySelector(idForm)
  if (!formCheckout) return
  let isSubmitting = false
  if (infoUserStorage) {
    const user = await userApi.getById(infoUserStorage.user_id)
    setValuesForm(formCheckout, user)
    formCheckout.addEventListener('submit', async function (e) {
      e.preventDefault()
      if (isSubmitting) return
      const formValues = getValuesForm(formCheckout)
      const isValid = await validateCheckoutForm(formCheckout, formValues)
      if (!isValid) return
      onSubmit?.(formValues, infoUserStorage.user_id, cart)
      isSubmitting = true
    })
  }
}
