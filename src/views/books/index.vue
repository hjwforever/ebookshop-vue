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
  </div>
</template>

<script>
import { getBookById, getBookList } from '@/api/book'

export default {
  name: 'BookList',
  data() {
    return {
      bookList: [],
      bookId: 1,
      book: {}
    }
  },
  methods: {
    getBookList() {
      this.$loading = true
      getBookList()
        .then(res => {
          console.log(res)
          this.bookList = res.data.content
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
