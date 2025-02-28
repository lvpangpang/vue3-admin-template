export function getFileName(cDisposition) {
  let fileName = ''
  if (cDisposition) {
    // 优先从filename*=utf-8中获取文件名
    // 判断是否含有filename*=utf-8
    if (cDisposition.indexOf('filename*=utf-8') > -1) {
      fileName = cDisposition.split("filename*=utf-8''").pop()
    }
    // 获取失败则从filename中获取文件名
    if (!fileName) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      fileName = filenameRegex.exec(cDisposition)[1]
    }
    // 对可能出现的特殊符号做处理
    if (fileName.substring(0, fileName.lastIndexOf('.')) === '______') {
      fileName = '暂无文件名.' + fileName.substring(fileName.lastIndexOf('.') + 1)
    }
    fileName = fileName.replace(/["]/g, '')
  }
  return fileName
}

export function downloadFile(blob, fileName) {
  const URL = window.URL || window.webkitURL
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl // 文件流生成的url
  a.download = fileName // 文件名
  document.body.appendChild(a)
  a.click()
  a.remove()
}
