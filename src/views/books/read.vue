<template>
  <div>
    <fw-book
      :data="pages"
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
        <div v-else>{{ page.content }}</div>
        <!-- <p>{{ index }}：{{ page.content }}</p> -->
      </template>
    </fw-book>
    <el-button tyre="primary" @click="getBookPages">获取内容</el-button>
    <div class="turn-grid">
      <div>
        <h1>Double display</h1>
        <fw-turn>
          <div class="flip_page_double hard">Turn.js</div>
          <div class="flip_page_double hard" />
          <div class="flip_page_double hard">Page 1</div>
          <div class="flip_page_double hard">Page 2</div>
          <div class="flip_page_double hard">Page 3</div>
          <div class="flip_page_double hard">Page 4</div>
          <div class="flip_page_double hard" />
          <div class="flip_page_double hard" />
        </fw-turn>
      </div>
      <div>
        <h1>Single display</h1>
        <fw-turn :options="{ display: display }">
          <div class="flip_page_single">Turn.js</div>
          <div class="flip_page_single" />
          <div class="flip_page_single">Page 1</div>
          <div class="flip_page_single">Page 2</div>
          <div class="flip_page_single">Page 3</div>
          <div class="flip_page_single">Page 4</div>
          <div class="flip_page_single" />
          <div class="flip_page_single" />
        </fw-turn>
      </div>
    </div>
  </div>
</template>

<script>
import { FwBook } from 'vue-turnjs'
import { getBookContent } from '@/api/book'

export default {
  components: {
    FwBook
  },
  data() {
    return {
      autoNextPage: false,
      loop: false,
      pages: [],
      display: 'single'
    }
  },
  created() {
    this.getBookPages()
  },
  methods: {
    getBookPages() {
      getBookContent({
        bookId: 30,
        pageStart: 1,
        pageEnd: 10
      }).then(res => {
        console.log(res)
        const contents = res.data.contents.map(page => {
          return {
            index: page.index,
            content: page.content.replace('\\r\\n\\r\\n', '\\r\\n')
          }
        })
        this.pages = [{
          src: 'https://cdn.jsdelivr.net/gh/hjwforever/images@main/img/defaultCoverImg.png'
        }, ...contents]
        console.log('pages', this.pages)
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
  .turn-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .flip_page_double {
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 300px;
    vertical-align: middle;
    background: url("https://miro.medium.com/max/10368/1*o8tTGo3vsocTKnCUyz0wHA.jpeg")
      no-repeat left center;
    background-size: 400px 600px;
  }
  .flip_page_single {
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 300px;
    vertical-align: middle;
    background: url("https://miro.medium.com/max/10368/1*o8tTGo3vsocTKnCUyz0wHA.jpeg")
      no-repeat left center;
    background-size: 800px 600px;
  }
</style>
