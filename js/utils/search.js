import userApi from '../api/userApi'

export function initSearchInput({ idElement }) {
  const searchInput = document.getElementById(idElement)
  if (!searchInput) return
  searchInput.addEventListener('input', async function (e) {
    const user = await userApi.getAll()
  })
}
