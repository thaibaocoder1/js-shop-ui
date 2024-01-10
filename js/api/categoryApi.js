import axiosClient from './axiosClient'

const categoryApi = {
  getAll() {
    const url = '/categories'
    return axiosClient.get(url)
  },
  getById(id) {
    const url = `/categories/${id}`
    return axiosClient.get(url)
  },
  add(data) {
    const url = `/categories`
    return axiosClient.post(url, data)
  },
  update(data) {
    const url = `/categories/${data.id}`
    return axiosClient.patch(url, data)
  },
  delete(id) {
    const url = `/categories/${id}`
    return axiosClient.delete(url)
  },
}
export default categoryApi
