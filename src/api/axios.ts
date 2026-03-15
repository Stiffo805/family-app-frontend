import { apiUrl } from '@src/api/baseUrl'
import axios from 'axios'

const axiosClient = axios.create({
  baseURL: apiUrl
})

axiosClient.defaults.timeout = 6000
axiosClient.defaults.headers.common['Content-Type'] = 'application/json'

export { axiosClient }
