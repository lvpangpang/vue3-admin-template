/**
 * 签名方法
 */

import md5 from 'js-md5'

export function getSignature(requestUrl, requestParam_) {
  if (requestUrl == null) {
    return ''
  }

  // 根据请求匹配请求参数并去除“=”构成数组
  let paramArr = getQueryString(requestUrl)
  if (paramArr.length <= 0) {
    paramArr = []
  }

  // 拼接param中的参数（Post请求为config.data，Get请求为config.param）
  let requestParam = Object.create(null)
  if (requestParam_ instanceof FormData) {
    for (const key of requestParam_.keys()) {
      const param = requestParam_.get(key)
      if (!(param instanceof File)) {
        requestParam[key] = param
      }
    }
  } else {
    requestParam = requestParam_
  }

  for (const k in requestParam) {
    if (Object.hasOwnProperty.call(requestParam, k) && k !== 'sign') {
      // null值替换为空字符串
      if (requestParam[k] === null) {
        paramArr.push([k, ''])
        continue
      }
      // 判断requestParam[k]类型: 取消file类型数据加入到签名中
      if (requestParam[k] === undefined) {
        break
      } else if (requestParam[k] instanceof File) {
        break
      } else if (requestParam[k] instanceof Array) {
        const vaule = JSON.stringify(requestParam[k].filter((o) => !(o instanceof FormData)))
        paramArr.push([k, vaule])
      } else if (requestParam[k] instanceof Object) {
        paramArr.push([k, JSON.stringify(requestParam[k])])
      } else {
        paramArr.push([k, (requestParam[k] + '').trim()])
      }
    }
  }

  // 请求参数排序
  paramArr.sort()

  // 对参数进行过滤
  const filterParamArr = []
  paramArr.forEach((param) => {
    if (param instanceof Array) {
      filterParamArr.push(param.join(''))
    }
  })
  // 携带secret
  const signature = filterParamArr.join('') + import.meta.env.VITE_SIGNATURE_SECRET
  // 返回md5加密的签名
  return md5(signature)
}

// 获取QueryString的数组

function getQueryString(requestUrl) {
  var result = requestUrl.match(new RegExp('[?&]([^?&=]+)=([^?&=]*)', 'g'))

  if (result == null) {
    return ''
  }

  for (var i = 0; i < result.length; i++) {
    // 去除请求参数前后的空格
    const resultArr = result[i].split('=')
    result[i] = resultArr[0].trim() + resultArr[1].trim()
    result[i] = result[i].substring(1)
    result[i] = result[i].split('=')
  }

  return result
}
