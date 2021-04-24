<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ role }}</span></div>
    <el-button type="primary" @click="getPublicContent">测试公共权限</el-button>
    <el-button type="primary" @click="getAdminContent">测试管理员权限</el-button>
    <el-button type="primary" @click="getUserContent">测试用户权限</el-button>
    <el-button type="primary" @click="getSellerContent">测试卖家权限</el-button>
    <el-card>
      {{ content }}
    </el-card>
    <BookList />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { adminTest, userTest, publicTest, sellerTest } from '@/api/authTest'
import BookList from '@/views/books'
export default {
  name: 'Dashboard',
  components: {
    BookList
  },
  data() {
    return {
      content: ''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    getAdminContent() {
      adminTest()
        .then(res => {
          console.log(res)
          this.content = res.data
          this.$message({
            message: res.msg || '成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
    },
    getPublicContent() {
      publicTest()
        .then(res => {
          console.log(res)
          this.content = res.data
          this.$message({
            message: res.msg || '成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
    },
    getUserContent() {
      userTest()
        .then(res => {
          console.log(res)
          this.content = res.data
          this.$message({
            message: res.msg || '成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
    },
    getSellerContent() {
      sellerTest()
        .then(res => {
          console.log(res)
          this.content = res.data
          this.$message({
            message: res.msg || '成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
