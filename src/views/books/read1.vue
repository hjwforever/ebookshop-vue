<template>
  <div>
    <p>
      23
    </p>
    <fw-turn>1111</fw-turn>
    <fw-book
      :data="pages"
      :start-page-index="1"
      :end-page-index="pages.length - 2"
      :auto-next-page="autoNextPage"
      :auto-next-page-delay-time="1000"
      :loop="loop"
      @next="pageChange"
      @prev="pageChange"
      @indexPageChange="indexPageChange"
    >
      <template v-slot:page="{ page, index }">
        <img :src="page.src" :alt="`image${index}`">
      </template>
    </fw-book>
    <fw-book
      :data="bookPages"
      :start-page-index="1"
      :auto-next-page="autoNextPage"
      :auto-next-page-delay-time="1000"
      :loop="loop"
      @next="pageChange"
      @prev="pageChange"
      @indexPageChange="indexPageChange"
    >
      <template v-slot:page="{ page, index }">
        <img v-if="index===0" :src="page.src" alt="coverImg`">
        <p v-else>{{ page.content }}</p>
        <!-- <p>{{ index }}：{{ page.content }}</p> -->
      </template>
    </fw-book>
    <fw-bookblock>3333</fw-bookblock>
    <fw-bookblock2>4444</fw-bookblock2>
    <el-button tyre="primary" @click="getBookPages">获取内容</el-button>
  </div>
</template>

<script>
import { FwTurn, FwBook, FwBookblock, FwBookblock2 } from 'vue-turnjs'
import { getBookContent } from '@/api/book'

export default {
  components: {
    FwTurn, FwBook, FwBookblock, FwBookblock2
  },
  data() {
    return {
      autoNextPage: false,
      loop: false,
      pages: [
        {
          src:
            'https://raw.githubusercontent.com/Reidond/vue-turnjs/develop/static/bookblock/1.jpg'
        },
        {
          src:
            'https://raw.githubusercontent.com/Reidond/vue-turnjs/develop/static/bookblock/2.jpg'
        },
        {
          src:
            'https://raw.githubusercontent.com/Reidond/vue-turnjs/develop/static/bookblock/3.jpg'
        },
        {
          src:
            'https://raw.githubusercontent.com/Reidond/vue-turnjs/develop/static/bookblock/4.jpg'
        },
        {
          src:
            'https://raw.githubusercontent.com/Reidond/vue-turnjs/develop/static/bookblock/5.jpg'
        }
      ],
      bookPages: []
    }
  },
  created() {
    this.getBookPages()
  },
  methods: {
    getBookPages() {
      getBookContent({
        bookId: 31,
        pageStart: 1,
        pageEnd: 10
      }).then(res => {
        console.log(res)
        this.bookPages = [{
          src: 'https://cdn.jsdelivr.net/gh/hjwforever/images@main/img/defaultCoverImg.png'
        }, ...res.data.contents]
        console.log('bookPages', this.bookPages)
      }).catch(err => {
        console.log(err)
      })
    },
    pageChange(/* curPage, indexPages, pageDatas */) {},
    indexPageChange(/* num */) {}
  }
}
</script>

<style lang="scss" scoped>

</style>
