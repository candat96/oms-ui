import axios from 'axios'

const axiosInstance = axios.create({})

axiosInstance.interceptors.request.use(
  async config => config,
  error => {
    return Promise.reject(error)
  }
)
axiosInstance.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export default axiosInstance
