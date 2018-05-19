<template>
  <div class="wrapper">
    <el-menu class="menu" theme="dark" default-active="/Admin/teacher_mgr" :router=true>
      <el-card class="userCard">
        <div class="imgWrapper">
          <img src="https://img.alicdn.com/imgextra/i2/855439689/TB2RcHTg90mpuFjSZPiXXbssVXa_!!855439689.png"
               alt=" moon.png"/>
        </div>
        <div style="padding: 10px;">
          <span style="color: white">{{userName}}</span>
          <br><br>
          <span style="color: white">{{currentDate}}</span>
        </div>
      </el-card>
      <el-menu-item index="/Admin/teacher_mgr"><i class="el-icon-menu"></i>教师管理</el-menu-item>
      <el-menu-item index="/Admin/student_mgr"><i class="el-icon-menu"></i>学生管理</el-menu-item>
      <el-menu-item index="/Admin/password"><i class="el-icon-menu"></i>修改密码</el-menu-item>
      <el-menu-item index="exit" v-on:click="exit()"><i class="el-icon-menu"></i>退出登录</el-menu-item>
    </el-menu>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    created: function () {
      // this.$http({
      //     method: 'get',
      //     url: '/static/admin.json',
      //     // url: '/api/admin/indexA',
      //     headers: {
      //         'Authorization': 'Bearer '+ localStorage.token
      //     }
      // }).then( response => {
      //     if(response.data.errno == 200) {
      //         this.userName = response.data.indexA.name
      //     }
      //     else {
      //         this.$notify({
      //             title: '未知错误！',
      //             type: 'success',
      //             offset: 100
      //         })
      //     }
      // })
    },
    data: function () {
      return {
        userName: 'Admin'
      }
    },
    computed: {
      currentDate: function () {
        var currentDate = new Date();
        var month = currentDate.getMonth() + 1;
        var day = currentDate.getDate();
        if (month < 10) {
          month = String('0' + month);
        }
        if (day < 10) {
          day = String('0' + day);
        }
        return currentDate.getFullYear() + '-' + month + '-' + day;
      }
    },
    methods: {
      exit: function () {
        this.$router.replace('/')
      }
    }
  }
</script>

<style scoped>
  .menu {
    width: 300px;
    height: 100%;
    text-align: left;
    letter-spacing: 3px;
    position: fixed;
  }

  .userCard {
    border: 0;
    background: #324057;
  }

  .imgWrapper {
    width: 150px;
    height: 150px;
    margin: 20px auto 0;
  }

  .content {
    width: 80%;
    height: 100%;
    margin-left: 300px;
  }
</style>
