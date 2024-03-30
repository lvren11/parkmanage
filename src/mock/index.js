import Mock from 'mockjs'
import qs from 'qs';

Mock.mock('login', 'post', (options) => {
    const { tel, pwd } = qs.parse(options.body);
    // 假设用户名为 13000000000，密码为 123456mmm 的情况下才登录成功
    if (tel === '13100000000' && pwd === '123456mmm') {
      return {
        code: 200,
        message: '登录成功',
        data: {
          user: {
            id: 1,
            uid: '151215',
            pwd: '123456mmm',
            tel: '13000000000',
            addr: '北京市朝阳区',
            integ: 1000,
            roles: 'admin'
          }
        }
      }
    } else if (tel === '13500000000' && pwd === '123456mmm') {
      return {
        code: 200,
        message: '登录成功',
        data: {
          user: {
            id: 2,
            uid: '151256',
            pwd: '123456mmm',
            tel: '13500000000',
            addr: '上海市浦东新区',
            integ: 800,
            roles: 'user'
          }
        }
      }
    } else {
      return {
        code: 400,
        message: '用户名或密码错误'
      }
    }
})


// 模拟注册接口
Mock.mock('user/insert', 'post', (options) => {
  const { tel, pwd } = qs.parse(options.body);
  // 假设注册成功
  if (tel && pwd) {
    return {
      code: 200,
      message: '注册成功'
    }
  } else {
    return {
      code: 400,
      message: '注册失败，用户名或密码不能为空'
    }
  }
})
