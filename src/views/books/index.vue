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
    <el-row :gutter="10">
      <el-col v-for="item in bookList" :key="item.bookId" :xs="12" :sm="8" :md="6" :lg="6" :xl="3">
        <el-card :body-style="{ padding: '0px' }" class="bookItem">
          <el-image :src="item.bookCoverImg" fit="fill" class="image" />
          <div style="padding: 14px;">
            <span>{{ item.bookName }}</span>
            <div class="clearfix bottom">
              <p>简介： {{ item.bookIntro }}</p>
              <el-button type="success" @click="downloadBookById(item)">下载</el-button>
              <el-button type="success" @click="testDownLoad(item)">测试下载</el-button>
              <el-button type="primary">查看</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getBookById, getBookList, downloadBookById, getBookDownloadURLById } from '@/api/book'
import { downloadUrlFile, downloadFileByUrl } from '@/utils/file'

export default {
  name: 'BookList',
  data() {
    return {
      bookList: [],
      bookId: 1,
      book: {},
      currentPage: 1,
      totalPages: 1,
      totalItems: 10
    }
  },
  created() {
    this.getBookList()
  },
  methods: {
    getBookList() {
      this.$loading = true
      getBookList()
        .then(res => {
          console.log(res)
          this.bookList = res.data.content
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
    testDownLoad(book) {
      getBookDownloadURLById(book.bookId)
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
