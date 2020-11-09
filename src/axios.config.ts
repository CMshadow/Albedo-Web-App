import axios from 'axios'

let stage: 'dev' | 'v1'
if (process.env.REACT_APP_STAGE_OVERWRITE) {
  stage = process.env.REACT_APP_STAGE_OVERWRITE === 'dev' ? 'dev' : 'v1'
} else {
  stage = process.env.NODE_ENV === 'development' ? 'dev' : 'v1'
}

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/${stage}`,
  timeout: 30000,
})

export default instance
