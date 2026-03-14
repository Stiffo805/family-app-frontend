import { apiUrl } from '@src/api/baseUrl'
import axios from 'axios'

const axiosClient = axios.create({
  baseURL: apiUrl
})

axiosClient.defaults.timeout = 6000

export { axiosClient }
