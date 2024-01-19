import orderApi from '../api/orderApi'
import { showSpinner, hideSpinner, setFieldValue, setFieldError, toast } from '../utils'
import * as yup from 'yup'

function setFormValues(form, orderInfo) {
  if (!form || !orderInfo) return
  setFieldValue(form, "[name='fullname']", orderInfo?.fullname)
  setFieldValue(form, "[name='email']", orderInfo?.email)
  setFieldValue(form, "[name='address']", orderInfo?.address)
  setFieldValue(form, "[name='phone']", orderInfo?.phone)
  setFieldValue(form, "[name='note']", orderInfo?.note)
}

function registerStatusOrder(selectEl, status) {
  const tagArr = ['Chờ xác nhận', 'Đã xác nhận + vận chuyển', 'Đã nhận hàng', 'Đã huỷ']
  for (let i = 0; i < tagArr.length; ++i) {
    const optionEl = document.createElement('option')
    optionEl.value = i + 1
    if (+optionEl.value === status) {
      optionEl.selected = true
    }
    optionEl.innerHTML = `${tagArr[i]}`
    selectEl.appendChild(optionEl)
  }
}

function getFormValues(form) {
  if (!form) return
  const formValues = {}
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }
  return formValues
}

function getFormSchema() {
  return yup.object({
    fullname: yup
      .string()
      .required('Không được để trống trường này')
      .test(
        'at-least-two-words',
        'Tên đầy đủ phải tối thiểu 3 từ',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 2).length >= 2,
      ),
    email: yup
      .string()
      .email('Trường này phải là email')
      .required('Không được để trống trường này'),
    address: yup.string().required('Không được để trống trường này'),
    phone: yup
      .string()
      .required('Không được để trống trường này')
      .matches(/^(84|0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ'),
    note: yup.string(),
    status: yup.string(),
  })
}

async function handleValidationForm(form, formValues) {
  try {
    ;['fullname', 'email', 'address', 'phone', 'note', 'status'].forEach((name) =>
      setFieldError(form, name, ''),
    )
    const schema = getFormSchema()
    await schema.validate(formValues, {
      abortEarly: false,
    })
  } catch (error) {
    const errorLog = {}
    for (const validationError of error.inner) {
      const name = validationError.path
      if (errorLog[name]) continue
      setFieldError(form, name, validationError.message)
      errorLog[name] = true
    }
  }
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

async function displayOrderInfo({ idForm, orderID, onSubmit }) {
  const form = document.getElementById(idForm)
  if (!form) return
  const selectEl = form.querySelector("[name='status']")
  try {
    showSpinner()
    const orderInfo = await orderApi.getById(orderID)
    hideSpinner()
    setFormValues(form, orderInfo)
    registerStatusOrder(selectEl, +orderInfo.status)
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const formValues = getFormValues(form)
      formValues.id = orderID
      const isValid = await handleValidationForm(form, formValues)
      if (!isValid) return
      await onSubmit?.(formValues)
    })
  } catch (error) {
    console.log('failed to fetch data', error)
  }
}

async function handleOnSubmitForm(formValues) {
  try {
    const updateOrder = await orderApi.update(formValues)
    if (updateOrder) {
      toast.success('Cập nhật đơn hàng thành công')
      setTimeout(() => {
        window.location.assign('/admin/order.html')
      }, 1000)
    }
  } catch (error) {
    toast.error('Có lỗi trong khi chỉnh sửa')
  }
}
// main
;(() => {
  const searchParams = new URLSearchParams(location.search)
  const orderID = +searchParams.get('id')
  if (orderID) {
    displayOrderInfo({
      idForm: 'formOrder',
      orderID,
      onSubmit: handleOnSubmitForm,
    })
  }
})()
