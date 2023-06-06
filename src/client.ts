import http, { RequestOptions } from 'http'
import { goodsType, membersType, purchasesType } from './monolithic'

const options: RequestOptions = {
  host: '127.0.0.1',
  port: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
}

type Callback = () => void

// 함수 오버라이딩
function request(cb: Callback, params?: membersType): void
function request(cb: Callback, params?: goodsType): void
function request(cb: Callback, params?: purchasesType): void

function request(cb: Callback, params?: membersType | goodsType | purchasesType) {
  const req = http.request(options, (res) => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    })

    res.on('end', () => {
      console.log(options, data)
      cb()
    })
  })

  if (params) {
    req.write(JSON.stringify(params))
  }
  req.end()
}

/**
 * 상품 관리 API 테스트
 * @param callback
 */
function goods(callback: Callback) {
  goods_post(() => {
    goods_get(() => {
      goods_delete(callback)
    })
  })

  function goods_post(cb: Callback) {
    options.method = 'POST'
    options.path = '/goods'
    request(cb, {
      name: 'test Goods',
      category: 'tests',
      price: 1000,
      description: 'test',
    })
  }

  function goods_get(cb: Callback) {
    options.method = 'GET'
    options.path = '/goods'
    request(cb)
  }

  function goods_delete(cb: Callback) {
    options.method = 'DELETE'
    options.path = '/goods?id=1'
    request(cb)
  }
}

/**
 * 회원 관리 API 테스트
 */
function members(callback: Callback) {
  try {
    members_delete(() => {
      members_post(() => {
        members_get(callback)
      })
    })

    function members_post(cb: Callback) {
      options.method = 'POST'
      options.path = '/members'
      request(cb, {
        username: 'test_account',
        password: '1234',
      })
    }

    function members_get(cb: Callback) {
      options.method = 'GET'
      options.path = '/members?username=test_account&password=1234'
      request(cb)
    }

    function members_delete(cb: Callback) {
      options.method = 'DELETE'
      options.path = '/members?username=test_account'
      request(cb)
    }
  } catch (error) {
    console.log('error: ', error)
  }
}

/**
 * 구매 관리 API 테스트
 */
function purchases(callback: Callback) {
  purchases_post(() => {
    purchases_get(callback)
  })

  function purchases_post(cb: Callback) {
    options.method = 'POST'
    options.path = '/purchases'
    request(cb, {
      userid: 1,
      goodsid: 1,
    })
  }

  function purchases_get(cb: Callback) {
    options.method = 'GET'
    options.path = '/purchases?userid=1'
    request(cb)
  }
}

console.log('=========================members=============================')
members(() => {
  console.log('==========================goods==================================')
  goods(() => {
    console.log('=============================purchases============================')
    purchases(() => {
      console.log('done')
    })
  })
})
