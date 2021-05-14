<template>
  <div>
    <el-dialog v-if="dialogVisible" title="上传小说" :visible.sync="dialogVisible" :before-close="changeVisibility" width="40%">
      <el-upload
        class="ml-10"
        :limit="limitNum"
        :auto-upload="false"
        accept=".txt"
        :action="UploadUrl()"
        :before-upload="beforeUploadFile"
        :on-change="fileChange"
        :on-exceed="exceedFile"
        :on-success="handleSuccess"
        :on-error="handleError"
        :file-list="fileList"
      >
        <el-button slot="trigger" size="small" type="primary">上传本地小说</el-button>
        <!-- <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div> -->
        <div slot="tip" class="el-upload__tip">只能上传txt文件，且不超过10M</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeVisibility">取 消</el-button>
        <el-button type="primary" :disabled="!enabledUploadBtn" :icon="uploadBtnIcon " @click="handleUpload">{{ uploadBtnText }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { uploadBook } from '@/api/book'

export default {
  props: {
    limitNum: { // 上传excell时，同时允许上传的最大数
      type: Number,
      default: 1
    },
    // fileList: { // excel文件列表
    //   type: Array,
    //   default: () => []
    // },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [], // excel文件列表
      uploadBtnIcon: '',
      uploadBtnText: '点击上传',
      enabledUploadBtn: true
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    changeVisibility() {
      this.$emit('update:dialogVisible', !this.dialogVisible)
    },
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
      this.enabledUploadBtn = false
      this.uploadBtnIcon = 'el-icon-loading'
      this.uploadBtnText = '正在导入'
      console.log('before upload')
      console.log(file)
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      const size = file.size / 1024 / 1024
      if (extension !== 'txt') {
        this.$message.warning('只能上传后缀是.txt的文件')
      }
      if (size > 50) {
        this.$message.warning('文件大小不得超过50M')
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
    handleUpload() {
      if (this.fileList.length === 0) {
        this.$message.warning('请选择文件上传')
      } else {
        this.beforeUploadFile(this.fileList[0])
        this.uploadNewNovel()
        // const form = new FormData()
        // console.log('this.fileList[0]', this.fileList[0])
        // form.append('file', this.fileList[0])
        // console.log('form', form)
        // this.$emit('uploadFile')
        // this.$emit('update:fileList', [])
      }
    },
    uploadNewNovel() {
      console.log('uploadFile')
      this.enabledUploadBtn = false
      this.uploadBtnText = '正在上传'
      this.formData = new FormData()
      const book = this.fileList[0]
      this.formData.append('uploadFile', book)
      console.log('formData', this.formData.get('uploadFile'))

      const bookName = book.name.toString().replace('.txt', '')
      uploadBook({ data: this.formData, params: {
        bookName,
        author: this.name
      }})
        .then(res => {
          this.$message.success(`书籍${bookName}上传成功`)
          console.log(res)
          this.fileList = []
          this.$emit('updateBookList')
        })
        .catch(err => {
          console.log(err)
        }).finally(() => {
          this.uploadBtnIcon = ''
          this.uploadBtnText = '点击上传'
          this.enabledUploadBtn = true
          this.changeVisibility()
        })
    }
  }
}
</script>

<style scoped>
</style>
