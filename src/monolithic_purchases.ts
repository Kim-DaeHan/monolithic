import { ServerResponse } from 'http'
import { Packet } from './monolithic'

exports.onRequest = function (
  res: ServerResponse,
  method: string,
  pathName: string,
  params: string,
  cb: (res: ServerResponse, packet: Packet) => void,
) {
  switch (method) {
    case 'POST':
      return register(method, pathName, params, (response: Packet) => {
        process.nextTick(cb, res, response)
      })
    case 'GET':
      return inquiry(method, pathName, params, (response: Packet) => {
        process.nextTick(cb, res, response)
      })
    default:
      return process.nextTick(cb, res, null) // 정의되지 않은 메서드면 null 리턴
  }
}
