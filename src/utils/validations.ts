/**
 * Validates the file type against a list of allowed types.
 * @param file - The file to validate.
 * @param types - An array of allowed file types. Defaults to ['image/jpeg', 'image/png', 'image/webp'].
 * @returns `true` if the file type is allowed, `false` otherwise.
 */
const validateFileType = (file: File, types = ['image/jpeg', 'image/png', 'image/webp']) => {
  if (types.indexOf(file.type) === -1) {
    return false
  }
  return true
}
/**
 * Validates the size of a file.
 * @param file - The file to validate.
 * @param size - The maximum allowed size in megabytes (default is 1MB).
 * @returns `true` if the file size is within the specified limit, `false` otherwise.
 */
const validateFileSize = (file: File, size = 1) => {
  if (file.size > size * 1024 * 1024) {
    return false
  }
  return true
}

export { validateFileType, validateFileSize }
