import type { ApiResponse, FileStoreResponse } from '@/types/api'
import axios from 'axios'

const fileBaseUrl = import.meta.env.VITE_FILE_BASEURL

const create = () => {
  return axios.create({
    baseURL: fileBaseUrl
  })
}
const client = create()

const uploadFile = (form: FormData): ApiResponse<FileStoreResponse> =>
  client.post('/v1/files', form)

const fileUrl = (fileName: string) => `${fileBaseUrl}/v1/files/${fileName}`

export { uploadFile, fileUrl }
