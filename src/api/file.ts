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

const uploadMultipleFiles = (form: FormData): ApiResponse<FileStoreResponse[]> =>
  client.post('/v1/files/multiple', form)

const fileUrl = (fileName: string) => `${fileBaseUrl}/v1/files/${fileName}`

const deleteFile = (url: string): ApiResponse<void> => client.delete(`/v1/files`, { data: { url } })

export { uploadFile, uploadMultipleFiles, fileUrl, deleteFile }
