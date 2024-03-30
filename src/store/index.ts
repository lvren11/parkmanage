import { createStore } from 'vuex'

export default createStore({
  state: {
    userPic: "/img/avatorImages/user.jpg",
    isPlay: false,
    url: '',
    id: '',
    breadcrumbList: [],
    user:{
      id:1,
      uid: 'A1b2c3',
      tel: '13215628742',
      cnum: '沪A.8F8F8',
      pnum: '12',
      addr: '20-03',
      integ: 98,
      pwd:'111',
      roles:'admin'
    }
  },
  getters: {
    userPic: state => state.userPic,
    isPlay: state => state.isPlay,
    url: state => state.url,
    id: state => state.id,
    breadcrumbList: state => state.breadcrumbList,
    user: state => state.user
  },
  mutations: {
    setUserPic: (state, userPic) => { state.userPic = userPic },
    setIsPlay: (state, isPlay) => { state.isPlay = isPlay },
    setUrl: (state, url) => { state.url = url },
    setId: (state, id) => { state.id = id },
    setBreadcrumbList: (state, breadcrumbList) => { state.breadcrumbList = breadcrumbList },
    setUser: (state,user) => { state.user = user },
  }
})