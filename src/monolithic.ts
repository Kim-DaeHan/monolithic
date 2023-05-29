import { IncomingMessage, ServerResponse } from 'http'

const http = require('http')
const url = require('url') // url 모듈 로드
const queryString = require('querystring') // querystring 모듈 로드

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

function onRequest(res: ServerResponse, method: string, pathName: string, params: any) {
  res.end('response!') // 모든 요청에 'response!' 메시지 보냄
}
