<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ role }}</span></div>
    <el-button type="primary" @click="getPublicContent">测试公共权限</el-button>
    <!-- <el-button :disabled="!checkPermission(['admin','seller'])" type="primary" @click="getAdminContent">测试管理员权限</el-button> -->
    <!-- <el-button v-permission="['seller']" type="primary" @click="getUserContent">测试用户权限</el-button> -->
    <el-button type="primary" @click="getAdminContent">测试管理员权限</el-button>
    <el-button type="primary" @click="getUserContent">测试用户权限</el-button>
    <el-button type="primary" @click="getSellerContent">测试卖家权限</el-button>
    <el-card>
      {{ content }}
    </el-card>
    <el-button type="primary" @click="dialogVisible = true">上传</el-button>
    <UploadBook ref="upload" :limit-num.sync="limitNum" :dialog-visible.sync="dialogVisible" @updateBookList="updateBookList" />
    <BookList ref="bookList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { adminTest, userTest, publicTest, sellerTest } from '@/api/authTest'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import BookList from '@/views/books'
import UploadBook from '@/views/books/upload'

export default {
  name: 'Dashboard',
  components: {
    BookList, UploadBook
  },
  directives: { permission },
  data() {
    return {
      content: '',
      dialogVisible: false,
      limitNum: 10,
      formData: new FormData(),
      uploadBookDetail: {
        bookName: null,
        bookAuthor: this.name,
        price: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    checkPermission,
    updateBookList() {
      this.$refs.bookList.getBookList()
    },
    imporRuItem() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['upload'].dialogVisible = true
      })
    },
    getAdminContent() {
      adminTest()
        .then(res => {
          this.imporRuItem()
          console.log(res)
          this.content = res.data
          this.$message({
            message: res.msg || '成功',
            type: 'success'
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
