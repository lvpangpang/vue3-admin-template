import service from '@/utils/request/index'

export function exportData(data) {
  return service.post('/patrol-module/points/export', data, {
    responseType: 'blob'
  })
}