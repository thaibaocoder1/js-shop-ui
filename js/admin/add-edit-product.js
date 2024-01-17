import categoryApi from '../api/categoryApi'
import productApi from '../api/productsApi'
import { hideSpinner, showSpinner, toast } from '../utils'
import { initFormProduct } from '../utils/add-edit-product'

async function handleSubmitForm(formValues) {
  try {
    ;['timer'].forEach((name) => (formValues[name] = new Date().getTime()))
    let saveProduct = null
    if (formValues.id) {
      saveProduct = formValues.id
      await productApi.update(formValues)
    } else {
      await productApi.add(formValues)
    }
    saveProduct !== null
      ? toast.success('Chỉnh sửa thành công')
      : toast.success('Thêm mới thành công')
    setTimeout(() => {
      window.location.reload()
    }, 500)
  } catch (error) {
    console.log('error', error)
  }
}
// main
async function registerListCategory({ idSelect, defaultValues }) {
  const selectEl = document.getElementById(idSelect)
  if (!selectEl) return
  try {
    const categories = await categoryApi.getAll()
    categories.forEach((item) => {
      const option = document.createElement('option')
      option.value = item.id
      if (Number.parseInt(option.value) === +defaultValues?.category_id) {
        option.selected = 'selected'
      }
      option.innerHTML = `${item.id} - ${item.title}`
      selectEl.appendChild(option)
    })
  } catch (error) {
    console.log('failed to fetch data', error)
  }
}
;(async () => {
  const searchParams = new URLSearchParams(window.location.search)
  const idProduct = +searchParams.get('id')
  showSpinner()
  const defaultValues = Boolean(idProduct)
    ? await productApi.getById(idProduct)
    : {
        name: '',
        category_id: '',
        description: '',
        code: '',
        price: 0,
        discount: 0,
        thumb: '',
        content: '',
        quantity: 0,
      }
  hideSpinner()
  registerListCategory({
    idSelect: 'category',
    defaultValues,
  })
  initFormProduct({
    idForm: 'formProduct',
    defaultValues,
    onSubmit: handleSubmitForm,
  })
})()
