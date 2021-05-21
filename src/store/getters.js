const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // user
  user: state => state.user,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  // read
  read: state => state.read,
  theme: state => state.read.theme,
  article: state => state.read.article
}
export default getters
