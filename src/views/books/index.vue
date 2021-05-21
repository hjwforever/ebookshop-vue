<template>
  <div>
    <!-- <el-button type="primary" @click="getBookList">获取书籍列表</el-button>
    <div v-for="item in bookList" :key="item.bookId">
      {{ item.bookName }}
    </div>
    <el-input v-model="bookId" type="number" />
    <el-button type="primary" @click="getBookById">根据id获取书籍</el-button>
    <el-card class="col-auto">
      {{ book.bookName ? book.bookName : '' }}
    </el-card> -->
    <el-card>
      <h4>书籍过滤</h4>
      <el-switch
        v-model="canRead"
        active-text="过滤掉无书源或下载源的书籍"
        inactive-text="不过滤"
        @change="getBookList"
      />
    </el-card>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="totalItems"
      @prev-click="loadTable"
      @current-change="loadTable"
      @next-click="loadTable"
    >2</el-pagination>

    <el-row :gutter="10">
      <el-col v-for="item in bookList" :key="item.bookId" :xs="12" :sm="8" :md="6" :lg="6" :xl="3">
        <el-card :body-style="{ padding: '0px' }" class="bookItem">
          <el-image :src="item.bookCoverImg" fit="fill" class="image" />
          <div style="padding: 14px;">
            <span>{{ item.bookName }}</span>
            <el-rate
              :value="item.starts"
              disabled
              show-score
              text-color="#ff9900"
              :score-template="item.starts.toFixed(1)"
            />
            <span>{{ item.author }}</span>
            <p>{{ returnIntro(item.bookIntro) }}</p>
            <el-button type="success" @click="beforeDownloadHandle(item)">下载</el-button>
            <el-button :type="item.bookUri ? 'primary':''" @click="goToRead(item)">阅读</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-col>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="totalItems"
        @prev-click="loadTable"
        @current-change="loadTable"
        @next-click="loadTable"
      >2</el-pagination>
    </el-col>
    <el-dialog title="选择下载方式" :visible.sync="dialogDownloadVisible">
      <div slot="footer" class="dialog-footer">
        <h4 v-if="dowloadBook.bookUri===null && dowloadBook.bookUrl===null">该书暂无任何下载源</h4>

        <el-button @click="dialogDownloadVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogDownloadVisible = false">确 定</el-button>
        <el-tooltip class="item" effect="dark" content="下载存储在云端数据库的文件" placement="top">
          <el-button :disabled="dowloadBook.bookUrl===null" type="success" @click="downloadBookByURL">URL下载</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="下载存储在服务器的文件" placement="top">
          <el-button :disabled="dowloadBook.bookUri===null" type="success" @click="downloadBookById">服务器下载</el-button>
        </el-tooltip>
      </div></el-dialog>
  </div>
</template>

<script>
import { getBookById, getBookList, downloadBookById } from '@/api/book'
import { downloadFileByUrl } from '@/utils/file'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'BookList',
  data() {
    return {
      bookList: [],
      bookId: 1,
      book: {},
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalItems: 10,
      bookSearch: {
        pageNum: 1,
        pageSize: 10,
        authorName: null,
        bookId: null,
        bookName: null
      },

      // read
      canRead: false,

      // upload
      autoUpload: true,
      limitNum: 10,
      fileList: [],
      uploadDialogVisible: false,

      // download
      dowloadBook: {},
      dialogDownloadVisible: false
    }
  },
  computed: {
    getBookSearch() {
      return this.bookSearch
    }
  },
  created() {
    this.getBookList()
  },
  methods: {
    returnIntro(intro) {
      if (intro.length > 11) {
        const reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|]/
        const result = intro.substr(0, 10)
        return reg.test(result.slice(-1)) ? result.substr(0, 9) + '...' : result
      }
      return intro
    },
    loadTable(currentPage) {
      this.currentPage = currentPage
      this.getBookList()
    },
    getBookList() {
      const loading = this.$loading({
        lock: true,
        text: '刷新书籍列表中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      if (this.canRead) { this.currentPage = 1 }
      getBookList({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        canRead: this.canRead
      })
        .then(res => {
          loading.close()
          console.log(res)
          this.bookList = res.data.content
          this.totalPages = res.data.totalPages || 1
          this.totalItems = res.data.totalElements || 10
          this.$message({
            message: '刷新成功',
            type: 'success',
            duration: 800
          })
        })
        .catch(err => {
          loading.close()
          console.log(err)
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
    },
    getBookById() {
      // this.$loading = true
      getBookById(this.bookId)
        .then(res => {
          console.log(res)
          this.book = res.data
          this.$message(res.msg)
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
        // .finally(this.$loading = false)
    },
    beforeDownloadHandle(item) {
      if (!checkPermission(['user', 'admin', 'seller'])) {
        this.$message.error('请登录')
        return
      }
      this.dowloadBook = item
      this.dialogDownloadVisible = true
      // this.$loading = true
    },
    downloadBookById() {
      console.log('book', this.dowloadBook)
      downloadBookById(this.dowloadBook.bookId)
        .then(res => {
          console.log('开始下载')
        })
    },
    downloadBookByURL() {
      downloadFileByUrl(this.dowloadBook.bookUrl)
      // this.$loading = false
      // .then(res => {
      //   console.log(res)
      //   // this.book = res.data
      //   // downloadFileByUrl(res.data)
      //   this.$message({
      //     message: res.msg || '成功',
      //     type: 'success'
      //   })
      // })
      // .catch(err => {
      //   console.log(err)
      //   this.$message({
      //     message: err.msg,
      //     type: 'error'
      //   })
      // })
      // .finally(this.$loading = false)
    },
    goToDetail(item) {
      this.$router.push({ path: `/books/${parseInt(item.bookId)}` })
    },
    goToRead(item) {
      if (!checkPermission(['user', 'admin', 'seller'])) {
        this.$message.error('请登录')
        return
      }
      if (item.bookUri == null) {
        this.$message.info('暂无该书')
      } else {
        this.$router.push({ path: `/read/${parseInt(item.bookId)}` })
      }
    },
    // Upload Book
    UploadUrl() {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return ''
    },
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$message.warning(
        `只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length +
        fileList.length} 个`
      )
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      console.log(file.raw)
      this.fileList.push(file.raw)
      console.log(this.fileList)
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      console.log('before upload')
      this.usersData = []
      console.log(file)
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      const size = file.size / 1024 / 1024
      if (extension !== 'xlsx') {
        this.$message.warning('只能上传后缀是.xlsx的文件')
      }
      if (size > 10) {
        this.$message.warning('文件大小不得超过10M')
      }
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success('文件上传成功')
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      console.log('文件上传失败' + err)
      this.$message.error('文件上传失败')
    },
    uploadFile() {
      if (this.fileList.length === 0) {
        this.$message.warning('请上传文件')
      } else {
        const form = new FormData()
        form.append('file', this.fileList[0])
        this.$emit('uploadFile', form)
        this.fileList = []
      }
    },
    httpRequest(e) {
      const file = e.file // 文件信息
      if (!file) {
        // 没有文件
        return false
      } else if (!/\.(txt)$/.test(file.name.toLowerCase()) /** xls|xlsx*/) {
        // 格式根据自己需求定义
        this.$message.error('上传格式不正确，请上传xls或者xlsx格式')
        return false
      }
      const fileReader = new FileReader()
      const this_ = this
      console.log('this_', this_)
      fileReader.onload = ev => {
        try {
          const data = ev.target.result
          console.log('文件', data)
          this.registerUsersHandle()
        } catch (e) {
          console.log('出错了：：')
          return false
        }
      }
      fileReader.readAsBinaryString(file)
    }
  }

}
</script>

<style lang="scss" scoped>
  .image {
    width: 150px;
    height: 300px;
    width: 100%;
    display: block;
  }
  .el-card {
    margin-bottom: 20px;
    transition: all .5s;
  }
  // .el-card:hover{
  //   margin-top: -5px;
  // }

  .bookItem {
     padding: 0px;
     max-height: 500px;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .button {
    padding: 0;
    float: right;
  }
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }
</style>
