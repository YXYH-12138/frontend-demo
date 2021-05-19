import instance from '@/api/instance'

export default {
  devLogin(data) {
    return instance.post('devLogin?password=admin123&username=admin', data)
  },
  login(data) {
    return instance.post('/login', data)
  },
  getInfo() {
    return instance.get('/getInfo')
  },
  getRouters() {
    return instance.get('/getRouters')
  }
}