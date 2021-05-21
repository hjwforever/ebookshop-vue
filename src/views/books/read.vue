<template>
  <div class="main" :style="{backgroundColor:bgColor}" :class="{'night': theme.nightMode}" @click="click">
    <div v-if="datashow" class="readheader">
      <router-link to="/"><el-button type="text" icon="el-icon-arrow-left" :style="{backgroundColor:bgColor, color: 'black'}">返回首页</el-button></router-link>
    </div>

    <div v-if="datashow" class="readbottom">
      <ul class="readbottom-color">
        <li
          v-for="(item,i) in colors"
          :key="i"
          :class="{'mui-icon mui-icon-checkmarkempty':item===bgColor}"
          :style="{backgroundColor:item}"
          @click.stop="setbgColor(item)"
        />
      </ul>
      <div class="readbottom-dv">
        <el-button :disabled="font <= 1" @click.stop="setfont('red')">A-</el-button>
        <span style="color: blue">font：{{ font }}px</span>
        <!-- <el-slider
          v-model="font"
          :min="3"
          :max="40"
        /> -->
        <el-button :disabled="font >= 40" @click.stop="setfont('add')">A+</el-button>
      </div>
      <div class="readbottom-dv">
        <span style="color: blue">当前总页数： {{ pageNum }}</span>
        <el-button @click.stop="infiniteHandler">提前加载下一页</el-button>

      </div>
    </div>
    <!-- <div class="header-wrapper">
      <v-header :show-header-title="showHeaderTitle" :title="book.bookName" />
    </div> -->
    <div ref="articleWrapper" :style="{backgroundColor:bgColor}" class="article-wrapper" @scroll="handleScroll">
      <div class="article" :class="[theme.fontSize, {'night': theme.nightMode}]">
        <div class="title border-1px">{{ book.bookName }}</div>
        <div class="author">{{ book.author }}</div>
        <div class="content border-1px">
          <!-- {{ book.bookIntro }} -->
          <div v-for="page in pages" :key="page.index">
            <p class="read-text" :style="{ fontSize: font + 'px' }" v-html="page.content" />
          </div>
        </div>

      </div>
    </div>
    <infinite-loading spinner="waveDots" @infinite="infiniteHandler">
      <!-- <div slot="spinner">Loading...</div> -->
      <div slot="no-more">没有更多内容了...
        <!-- <div class="foot">全文完 共{{ article.wc }}字</div> -->
      </div>
      <div slot="no-results">没有内容</div>
      <div slot="error">
        Error message, click <el-button type="primary" @click="getBookPages">here</el-button> to retry
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Cookies from 'js-cookie'
import { getBookById, getBookContent } from '@/api/book'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  components: {
    InfiniteLoading
  },
  props: {
    bookId: {
      type: Number,
      default: 30
    },
    startPage: {
      type: Number,
      required: false,
      default: 1
    },
    endPage: {
      type: Number,
      required: false,
      default: 5
    }
  },
  data() {
    return {
      // settings
      datashow: false,
      font: 14,
      bgColor: '',
      colors: [
        '#c4b395',
        '#c3d4e6',
        '#c8e8c8',
        '#F8C9C9',
        '#3E4349'
      ],
      scrollOffset: 60,
      showHeaderTitle: false,
      night: false,

      // book
      book: {
        bookId: 30,
        bookName: '',
        author: 'ebook-shop'
      },
      pages: [],
      totalPageNum: 999
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'device'
    ]),
    pageNum() {
      return this.pages.length
    }
  },
  async created() {
    console.log('device', this.device)
    await getBookById(this.bookId).then(res => {
      this.book = res.data
      console.log('this.book', this.book)
    })
    // this.bgColor = Cookies.get('BOOK_USERCOLOR') || '#c4b395' // 字体颜色
    // this.font = Cookies.get('BOOK_USERFONT') || 14 // 字体
    this.bgColor = this.theme.themeColor || '#c4b395' // 字体颜色
    this.font = this.theme.fontSize || 14 // 字体
    this.night = this.theme.nightMode || false // 夜间模式
    await this.getBookPages()
  },
  methods: {
    infiniteHandler($state) {
      if (this.pageNum >= this.totalPageNum) {
        $state.complete()
        return
      }
      getBookContent({
        bookId: parseInt(this.book.bookId),
        page: parseInt(this.pageNum + 1)
      }).then(res => {
        console.log(res)
        // const contents = res.data.contents.map(page => {
        //   return {
        //     index: page.index,
        //     content: page.content.replace('\\r\\n\\r\\n', '\\r\\n')
        //   }
        // })
        if (res.data.contents.length) {
          this.pages.push(...res.data.contents)
          console.log('pages', this.pages)
          $state.loaded()
        } else {
          $state.complete()
        }
      }).catch(err => {
        console.log(err)
        $state.complete()
      })
    },
    getBookPages() {
      getBookContent({
        bookId: parseInt(this.book.bookId),
        pageStart: parseInt(this.startPage),
        pageEnd: parseInt(this.endPage)
      }).then(res => {
        console.log(res)
        this.totalPageNum = res.data.totalPageNum
        const contents = res.data.contents.map(page => {
          return {
            index: page.index,
            content: page.content.replace('\\r\\n\\r\\n', '\\r\\n')
          }
        })
        // this.pages = [{
        //   src: 'https://cdn.jsdelivr.net/gh/hjwforever/images@main/img/defaultCoverImg.png'
        // }, ...contents]
        this.pages = contents
        console.log('pages', this.pages)
      }).catch(err => {
        console.log(err)
      })
    },
    setbgColor(color) {
      this.$store.commit('read/setThemeColor', color)
      this.bgColor = color
    },
    setfont(condition) {
      if (condition === 'add') {
        this.font += 1
        this.$store.commit('read/setThemeFontSize', this.font)
      }
      if (condition === 'red') {
        this.font -= 1
        this.$store.commit('read/setThemeFontSize', this.font)
      }
    },
    nightToggle() {
      this.night = !this.night
      this.$store.commit('read/setThemeNightMode', this.night)
    },
    click() {
      this.datashow = !this.datashow
    },
    handleScroll() {
      const scrollTop = this.$refs.articleWrapper.scrollTop
      this.showHeaderTitle = (scrollTop >= this.scrollOffset)
    }
  }
}
</script>

<style lang="scss">
	@import '@/styles/read/index.scss';
	.main {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: $main-color;
		&.night {
			background: $main-color-night;
		}
		.header-wrapper {
			position: fixed;
			top: 0;
			z-index: 50;
			height: 3rem;
			width: 100%;
		}
		.article-wrapper {
			margin: 0; // 0.5rem 0 0.5rem;
			// height: 92vh;
			overflow-y: scroll;
			&::-webkit-scrollbar {
				width: 0;
			}
      padding: 0 1rem 0 1rem;
		}

  .readheader {
    position: fixed;
    width: 100%;
    padding-left: 1rem;
    font:blod;
    z-index: 210;
  }

  .readbottom {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 110;
    background-color: rgba($color: #000000, $alpha: 0.7);
    .mui-icon{
      display: flex;
      justify-content: center;
      align-items: center;
    }
.readbottom-color{
  display: flex;
  justify-content: space-around;
  list-style: none;
  margin-bottom: 20px;
  li{
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
}
    .readbottom-dv {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .readbottom-ml {
        color: #fff;
        text-align: center;
        font-size: 14px;
      }
      .read-ss{
        color: #fff;
      }
      .readbottom-font {
        border: 1px solid #fff;
        padding: 5px 20px;
        border-radius: 3px;
        color: #fff;
      }
    }
  }
  h1 {
    font-size: 16px;
    color: #222;
  }
    .read-text {
      white-space: pre-wrap;
    }

    .article {
            .title {
				text-align: center;
				font-size: 1.1rem;
				font-weight: 500;
				padding-bottom: 0.5rem;
				@include border-1px($article-title-border-color);
			}
      .author {
				text-align: center;
				font-size: 0.7rem;
				font-weight: 100;
				color: $article-author-color;
				padding-top: 0.4rem;
			}
			.content {
				font-size: 0.9rem;
				font-weight: 400;
				padding-bottom: 1rem;
				@include border-1px($article-foot-border-color);
				p {
					text-indent: 1.8rem;
				}
			}
			.foot {
				font-size: 0.7rem;
				text-align: center;
				font-weight: 100;
				color: $article-foot-color;
				padding-top: 1rem;
				padding-bottom: 1rem;
			}
		&.small {
			.title {
				text-align: center;
				font-size: 1.1rem;
				font-weight: 500;
				padding-bottom: 0.5rem;
				@include border-1px($article-title-border-color);
			}
			.author {
				text-align: center;
				font-size: 0.7rem;
				font-weight: 100;
				color: $article-author-color;
				padding-top: 0.4rem;
			}
			.content {
				font-size: 0.9rem;
				font-weight: 400;
				padding-bottom: 1rem;
				@include border-1px($article-foot-border-color);
				p {
					text-indent: 1.8rem;
				}
			}
			.foot {
				font-size: 0.7rem;
				text-align: center;
				font-weight: 100;
				color: $article-foot-color;
				padding-top: 1rem;
				padding-bottom: 1rem;
			}
		}
		&.medium {
			.title {
				text-align: center;
				font-size: 1.3rem;
				font-weight: 500;
				padding-bottom: 0.5rem;
				@include border-1px($article-title-border-color);
			}
			.author {
				text-align: center;
				font-size: 0.8rem;
				font-weight: 100;
				color: $article-author-color;
				padding-top: 0.4rem;
			}
			.content {
				font-size: 1rem;
				font-weight: 400;
				padding-bottom: 1rem;
				@include border-1px($article-foot-border-color);
				p {
					text-indent: 2rem;
				}
			}
			.foot {
				font-size: 0.8rem;
				text-align: center;
				font-weight: 100;
				color: $article-foot-color;
				padding-top: 1rem;
				padding-bottom: 1rem;
			}
		}
		&.large {
			.title {
				text-align: center;
				font-size: 1.5rem;
				font-weight: 500;
				padding-bottom: 0.5rem;
				@include border-1px($article-title-border-color);
			}
			.author {
				text-align: center;
				font-size: 0.9rem;
				font-weight: 100;
				color: $article-author-color;
				padding-top: 0.4rem;
			}
			.content {
				font-size: 1.1rem;
				font-weight: 400;
				padding-bottom: 1rem;
				@include border-1px($article-foot-border-color);
				p {
					text-indent: 2.2rem;
				}
			}
			.foot {
				font-size: 0.9rem;
				text-align: center;
				font-weight: 100;
				color: $article-foot-color;
				padding-top: 1rem;
				padding-bottom: 1rem;
			}
		}
		&.night{
			background: $basic-color-night;

			.title{
				color: #747474;
			}

			.author{
				color: #aaaaaa;
			}

			.content{
				color: #747474;
			}

			.foot{
				color: #bbbbbb;
			}

		}
	}
	}
</style>
