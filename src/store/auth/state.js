import { LocalStorage, SessionStorage } from 'quasar'
export default {
  user: null,
  token: LocalStorage.getItem('token') || SessionStorage.getItem('token') || null
}
