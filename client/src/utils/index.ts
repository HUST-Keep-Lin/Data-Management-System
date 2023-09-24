import axios from "axios"

let service = axios.create({
  baseURL: '/',
  timeout: 3000
})

export default service
