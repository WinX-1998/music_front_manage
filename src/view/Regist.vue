<template>
  <div class="login-wrap">
    <div><div class="ms-title">music 账号注册</div></div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleForm.password" placeholder="密码"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="onSubmit">注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
      name: "Login",
      data: function(){
        return {
          ruleForm:{
            username: "admin",
            password: "123"
          },
          rules:{
            username:[
              {required:true,message:"请输入用户名",trigger:"blur"}
            ],
            password:[
              {required:true,message:"请输入密码",trigger:"blur"}
            ]
          }
        };
      },
      methods:{

          onSubmit(){
            console.log(111)
            var _this=this;
            console.log(this.ruleForm.username)
            this.$axios.post("http://localhost:8888/user/login",
              this.ruleForm)
              .then(function (response) {
              if(response.data==="success"){
                    _this.$message({
                      message: '登录成功!',
                      type: 'success'
                  });
            }else{
                    _this.$message({
                      message: '登录失败!',
                      type: 'error'
                    });
                  }
            })
        }

      }
    }
</script>

<style scoped>
  .login-wrap {
    position: relative;
    background: url("../assets/img/background.jpg")no-repeat;
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
  }
  .ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    font-weight: 600;
    color: #fff;
  }
  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 160px;
    margin-left: -190px;
    margin-top: -150px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
  }
  .login-btn {
    text-align: center;
  }
  .login-btn button {
    width: 100%;
    height: 36px;
  }
</style>
