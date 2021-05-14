<template>
  <div>
    <el-button type="primary" @click="getBookList">获取书籍列表</el-button>
    <div v-for="item in bookList" :key="item.bookId">
      {{ item.bookName }}
    </div>
    <el-input v-model="bookId" type="number" />
    <el-button type="primary" @click="getBookById">根据id获取书籍</el-button>
    <el-card class="col-auto">
      {{ book.bookName ? book.bookName : '' }}
    </el-card>
    <el-button type="primary" @click="getBookById">上传书籍</el-button>
    <!-- <el-button type="primary" style="float: left;margin-left: 50px" @click="uploadDialogVisible = true">批量注册</el-button> -->
    <!--  上传xlsx文件批量注册 -->
    <!-- <el-dialog v-if="uploadDialogVisible" title="批量注册-导入excel" :visible.sync="uploadDialogVisible" width="40%">
      <el-upload
        class="upload-container"
        drag
        :show-file-list="false"
        :http-request="httpRequest"
        :limit="limitNum"
        multiple
        :auto-upload="autoUpload"
        accept=".txt"
        :action="UploadUrl()"
        :before-upload="beforeUploadFile"
        :on-change="fileChange"
        :on-exceed="exceedFile"
        :on-success="handleSuccess"
        :on-error="handleError"
        :file-list="fileList"
      >
        <i class="ml-10 el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传txt文件，且不超过10M</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">返回</el-button>
        <!--        <el-button type="primary" @click="uploadFile">确 定</el-button>-->
    <!-- </span>
    </el-dialog> -->
    <el-row :gutter="10">
      <el-col v-for="item in bookList" :key="item.bookId" :xs="12" :sm="8" :md="6" :lg="6" :xl="3">
        <el-card :body-style="{ padding: '0px' }" class="bookItem">
          <el-image :src="item.bookCoverImg" fit="fill" class="image" />
          <div style="padding: 14px;">
            <span>{{ item.bookName }}</span>
            <div class="clearfix bottom">
              <p>简介： {{ item.bookIntro }}</p>
              <!-- <el-button type="success" @click="downloadBookById(item)">下载</el-button> -->
              <el-button type="success" @click="downLoadBookId(item.bookId)">下载</el-button>
              <el-button type="primary">查看</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- <el-pagination
        background
        :current-page="currentPage"
        :page-size="pageSize"
        :pager-count="totalPages"
        layout="prev, pager, next"
        :total="totalItems"
        @prev-click="loadTable"
        @current-change="loadTable"
        @next-click="loadTable"
      /> -->
      <!-- :pager-count="totalPages" -->
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
    </el-row>
  </div>
</template>

<script>
import { getBookById, getBookList, /* downloadBookById,*/ getBookDownloadURLById } from '@/api/book'
import { downloadUrlFile, downloadFileByUrl } from '@/utils/file'

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
      // upload
      autoUpload: true,
      limitNum: 10,
      fileList: [],
      uploadDialogVisible: false
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
    loadTable(currentPage) {
      this.currentPage = currentPage
      this.getBookList()
    },
    getBookList() {
      this.$loading = true
      getBookList({
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
        .then(res => {
          console.log(res)
          this.bookList = res.data.content
          this.totalPages = res.data.totalPages || 1
          this.totalItems = res.data.totalElements || 10
          this.$message({
            message: res.msg || '成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
        .finally(this.$loading = false)
    },
    getBookById() {
      this.$loading = true
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
        .finally(this.$loading = false)
    },
    downloadBookById(book) {
      this.$loading = true
      getBookDownloadURLById(book.bookId)
        .then(res => {
          console.log(res)
          // this.book = res.data
          downloadUrlFile(res.data, 'test.png')
          this.$message({
            message: res.msg || '成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
        .finally(this.$loading = false)
    },
    downLoadBookId(bookId) {
      getBookDownloadURLById(bookId)
        .then(res => {
          console.log(res)
          // this.book = res.data
          downloadFileByUrl(res.data)
          this.$message({
            message: res.msg || '成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: err.msg,
            type: 'error'
          })
        })
        .finally(this.$loading = false)
    },
    goToDetail(item) {
      this.$router.push({ path: `books/${item.bookId}` })
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
