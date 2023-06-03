import { IncomingMessage, ServerResponse } from 'http'

const http = require('http')
const url = require('url') // url 모듈 로드
const queryString = require('querystring') // querystring 모듈 로드

// 모듈들 코드
const members = require('./monolithic_members')
const goods = require('./monolithic_goods')
const purchases = require('./monolithic_purchases')

export type Packet = {
  key: any
  errorCode: number
  errorMessage: string
}

/**
 * HTTP 서버를 만들고 요청 처리
 */
const server = http
  .createServer((req: IncomingMessage, res: ServerResponse) => {
    const method: string | undefined = req.method // 메서드를 얻어 옴
    const uri = url.parse(req.url, true)
    const pathName = uri.pathName // URI를 얻어 옴

    // POST와 PUT이면 데이터를 읽음
    if (method === 'POST' || method === 'PUT') {
      let body = ''

      req.on('data', function (data) {
        body += data
      })
      req.on('end', function () {
        let params
        // 헤더 정보가 json이면 처리
        if (req.headers['content-type'] == 'application/json') {
          params = JSON.parse(body)
        } else {
          params = queryString.parse(body)
        }

        onRequest(res, method, pathName, params)
      })
    } else {
      // GET과 DELETE이면 query 정보를 읽음
      onRequest(res, method!, pathName, uri.query)
    }
  })
  .listen(8000)

/**
 * 요청에 대해 회원 관리, 상품 관리, 구매 관리 모듈별로 분기
 * @param res response 객체
 * @param method 메서드
 * @param pathName URI
 * @param params 입력 파라미터
 * @returns
 */
function onRequest(res: ServerResponse, method: string, pathName: string, params: any) {
  // 기능별 호출
  switch (pathName) {
    case '/members':
      members.onRequest(res, method, pathName, params, response)
      break
    case '/goods':
      goods.onRequest(res, method, pathName, params, response)
      break
    case '/purchases':
      purchases.onRequest(res, method, pathName, params, response)
      break
    default:
      res.writeHead(404)
      return res.end() // 정의되지 않은 요청에 404 에러 리턴
  }
}

/**
 * HTTP 헤더에 JSON 형식으로 응답
 * @param res response 객체
 * @param packet 결과 파라미터
 */
function response(res: ServerResponse, packet: Packet) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(packet))
}
