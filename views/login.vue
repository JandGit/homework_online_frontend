<template>
  <div class="wrapper">
    <div class="loginWrapper">
      <el-input class="input" v-model="user_name" placeholder="学号" icon="more" size="large"
                style="margin-top: 150px;"></el-input>
      <el-input class="input" v-model="password" type="password" placeholder="密码"
                size="large"></el-input>
      <br><br>
      <el-switch class="switch" :width=120 v-model="mark" on-text="记住用户" off-text="取消记住用户"
                 on-color="#13CE66" :change="save()"></el-switch>
      <br>
      <el-button class="button" size="large" type="success" v-on:click="login()">登录</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    created: function () {
      if (localStorage.user_name && localStorage.password) {
        this.user_name = localStorage.user_name;
        this.password = localStorage.password;
      }
    },
    data: function () {
      return {
        user_name: "",
        password: "",
        mark: true
      };
    },
    methods: {
      save: function () {
        if (this.mark == true) {
          localStorage.user_name = this.user_name;
          localStorage.password = this.password;
        } else {
          localStorage.removeItem("user_name");
          localStorage.removeItem("password");
        }
      },
      login: function () {
        if (this.user_name.length > 0 && this.user_name.length < 20 &&
            this.password.length && this.password.length < 100) {
          this.$http({
            method: "POST",
            url: "/api/login",
            data: {
              user_name: this.user_name,
              password: this.password
            }
          }).then(response => {
            if (response.data.result == 0) {
              var userType = response.data.data.user_type;
              switch (userType) {
                case "admin":
                  this.$router.replace("/Admin");
                  break;
                case "teacher":
                  this.$router.replace("/Teacher/noticeT");
                  break;
                case "student":
                  this.$router.replace("/Student/noticeS");
                  break;
              }
            } else {
              var errCode = response.data.result;
              if (errCode === 100) {
                this.$notify({
                  title: "账号不存在！",
                  type: "error",
                  offset: 100
                });
              } else if (errCode === 101) {
                this.$notify({
                  title: "密码错误！",
                  type: "error",
                  offset: 100
                })
              } else {
                this.$notify({
                  title: "服务器内部错误！",
                  type: "error",
                  offset: 100
                });
              }
            }
          })
        } else {
          this.$notify({
            title: "请检查账号和密码！",
            type: "error",
            offset: 100
          });
        }
      }
    },
    watch: {
      user_name: function () {
        if (this.mark == true) {
          localStorage.user_name = this.user_name;
        } else {
          localStorage.removeItem("user_name");
        }
      },
      password: function () {
        if (this.mark == true) {
          localStorage.password = this.password;
        } else {
          localStorage.removeItem("password");
        }
      }
    }
  };
</script>

<style scoped>
  .wrapper {
    width: 100%;
    height: 100%;
    background: url("../assets/login.jpg");
    background-size: 100% 100%;;
  }

  .loginWrapper {
    width: 400px;
    height: 500px;
    background: rgba(255, 255, 255, 0);
    margin: 0 auto;
    position: relative;
    top: 100px;
  }

  .input {
    width: 300px;
    height: 50px;
  }

  .button {
    width: 200px;
    margin-top: 50px;
  }

  /*.switch {*/
    /*position: relative;*/
  /*}*/
</style>
