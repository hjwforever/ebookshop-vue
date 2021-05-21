<template>
  <el-card>
    <el-avatar :src="user.avatar" />
    <div class="account-text">
      name: {{ user.name }} <br>
      roles: <span v-for="role in user.roles" :key="role">{{ role }}</span> <br>
      email: {{ user.email }} <br>
      token: {{ user.token.slice(0,20) + '...' }} <br>
    </div>
    <el-button type="primary" @click="getPublicContent">测试公共权限</el-button>
    <!-- <el-button :disabled="!checkPermission(['admin','seller'])" type="primary" @click="getAdminContent">测试管理员权限</el-button>
    <el-button v-permission="['seller']" type="primary" @click="getUserContent">测试用户权限</el-button> -->
    <el-button type="primary" @click="getAdminContent">测试管理员权限</el-button>
    <el-button type="primary" @click="getUserContent">测试用户权限</el-button>
    <el-button type="primary" @click="getSellerContent">测试卖家权限</el-button>
    <el-card style="margin-top: 1rem"> {{ content }} </el-card>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { adminTest, userTest, publicTest, sellerTest } from '@/api/authTest'

export default {
  data() {
    return {
      content: ''
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    getAdminContent() {
      adminTest()
        .then(res => {
          // this.imporRuItem()
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
.account {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
