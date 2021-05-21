<template>
  <div class="dashboard-container">
    <el-button type="primary" style="margin:1rem 0 " @click="beforeUpload">书籍上传</el-button>
    <UploadBook ref="upload" :limit-num.sync="limitNum" :dialog-visible.sync="dialogVisible" @updateBookList="updateBookList" />
    <BookList ref="bookList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    beforeUpload() {
      if (!checkPermission(['admin', 'seller'])) {
        this.$message.error('权限不足，请登录管理员或卖家账号')
        return
      }
      this.dialogVisible = true
    },
    updateBookList() {
      this.$refs.bookList.getBookList()
    },
    imporRuItem() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['upload'].dialogVisible = true
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
