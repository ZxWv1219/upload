<template>
  <div id="index" class="login">
    <van-form @submit="onSubmit">
      <van-field v-model="form.account" name="用户名" label="用户名" placeholder="用户名" />
      <van-field v-model="form.password" type="password" name="密码" label="密码" placeholder="密码" />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import * as types from '@/store/mutations-types'
import storage from '@/store/myStorage'
import { userLogin } from '@/network/loginService'

export default {
  name: 'index',
  components: {},
  data() {
    return {
      form: {
        account: '',
        password: ''
      },
      redirect: ''
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
        }
      },
      immediate: true
    }
  },
  methods: {
    onSubmit() {
      this.login()
    },
    login() {
      userLogin(this.form.account, this.form.password)
        .then(res => {
          console.log(res)
          if (res.success) {
            storage.set('token', res.data.token)
            this.$router.push('/home')
          } else {
            this.$toast(res.message)
          }
        })
    }
  },

  mounted() {

  }
}
</script>

<style scoped>
.login {
  height: calc(100vh);
  display: flex;
  align-items: center;
  justify-content: center;
}
.van-form {
  width: 80%;
}
