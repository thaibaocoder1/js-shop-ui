import productApi from '../api/productsApi'
import { toast } from './toast'
import debounce from 'lodash.debounce'

export async function renderListProductSearch(listProduct, search) {
  if (!search || !listProduct || listProduct.length === 0) return
  search.textContent = ''
  listProduct.forEach((item) => {
    const searchItem = document.createElement('search')
    searchItem.classList.add('search-item')
    searchItem.innerHTML = `<figure class="search-thumb">
    <img src="public/images/${item.thumb}" alt="${item.name}" class="search-img" />
    </figure>
    <div class="search-content">
      <h3 class="search-name">${item.name}</h3>
      <div class="search-price">
        <span>Giá gốc</span>
        <span style="text-decoration: line-through">Giá giảm</span>
      </div>
    </div>`
    search.appendChild(searchItem)
  })
}

export function initSearchForm({ idForm, idElement }) {
  const form = document.getElementById(idForm)
  const search = document.getElementById(idElement)
  if (!form || !search) return
  const searchTerm = form.querySelector("[name='searchTerm']")
  const debounceSearch = debounce(async (e) => {
    const { target } = e
    const searchValue = target.value
    let productApply = []
    if (searchValue.length === 0) {
      await renderListProductSearch(productApply, search)
    } else {
      const products = await productApi.getAll()
      productApply = products.filter((item) =>
        item?.name.toLowerCase().includes(searchValue.toLowerCase()),
      )
      await renderListProductSearch(productApply, search)
    }
  }, 500)
  searchTerm.addEventListener('input', debounceSearch)
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    const searchValue = this.elements['searchTerm'].value
    if (searchValue.length === 0) {
      toast.error('Phải nhập vào thông tin tìm kiếm')
      return
    }
    console.log(searchValue)
  })
}
