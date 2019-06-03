<template>
  <el-form class="login">
    <el-form class="container">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
        <img src="../assets/avatar.jpg" class="avatar">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="myicon myicon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="myicon myicon-key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="tologin('loginForm')">登陆</el-button>
        </el-form-item>
      </el-form>
    </el-form>
  </el-form>
</template>
<script>
import { login } from '@/api/axios.js'
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    tologin (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          login(this.loginForm).then((result) => {
            console.log(result)
            if (result.meta.status === 200) {
              localStorage.setItem('itcastpro_key', result.data.token)
              this.$router.push({ name: 'Home' })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;

  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
