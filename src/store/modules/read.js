import collectionStore from '@/utils/collectionStore'

const getDefaultState = () => {
  return {
    inited: false,
    bottomContent: 'setting',
    navLeftOn: false,
    navRightOn: false,
    padBottomOn: false,
    leftMaskOn: false,
    rightMaskOn: false,
    bottomMaskOn: false,
    article: {
      date: {
        curr: '',
        prev: '',
        next: ''
      },
      author: '',
      title: '',
      digest: '',
      wc: 0,
      content: ''
    },
    // init from localStorage and will be saved to localStrorage when unload
    collection: collectionStore.fetch(),
    theme: {
      fontSize: 14, // 'medium',
      themeColor: '#c4b395',
      nightMode: false
    }
  }
}

const state = getDefaultState()

const mutations = {
  init: state => {
    state.inited = true
  },
  updateArticle: (state, article) => {
    state.article = article
  },
  leftToggle: state => {
    state.navLeftOn = !state.navLeftOn
  },
  rightToggle: state => {
    state.navRightOn = !state.navRightOn
  },
  bottomToggle: state => {
    state.padBottomOn = !state.padBottomOn
  },
  leftMaskToggle: state => {
    state.leftMaskOn = !state.leftMaskOn
  },
  rightMaskToggle: state => {
    state.rightMaskOn = !state.rightMaskOn
  },
  bottomMaskToggle: state => {
    state.bottomMaskOn = !state.bottomMaskOn
  },
  openSetting: state => {
    state.bottomContent = 'setting'
  },
  openShare: state => {
    state.bottomContent = 'share'
  },
  articleLikeToggle: state => {
    if (state.collection.map(item => item.curr).indexOf(state.article.date.curr) > -1) {
      state.collection.splice(state.collection.map(item => item.curr).indexOf(state.article.date.curr), 1)
    } else {
      const title = state.article.title
      const author = state.article.author
      const curr = state.article.date.curr
      const item = { title, author, curr }
      state.collection.push(item)
    }
  },
  setThemeFontSize: (state, fontSize) => {
    state.theme.fontSize = fontSize
  },
  setThemeColor: (state, color) => {
    state.theme.themeColor = color
  },
  setThemeNightMode: (state, mode) => {
    state.theme.nightMode = mode
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
