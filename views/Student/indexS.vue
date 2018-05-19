<template>
    <div class="wrapper">
        <el-menu class="menu" theme="dark" default-active="/Student/noticeS" :router=true>
            <el-card class="userCard">
                <div class="imgWrapper">
                    <img src="https://img.alicdn.com/imgextra/i2/855439689/TB2RcHTg90mpuFjSZPiXXbssVXa_!!855439689.png" alt=" moon.png"/>
                </div>
                <div style="padding: 10px;">
                    <span style="color: white">{{userName}}</span>
                    <br><br>
                    <span style="color: white">{{className}}</span>
                    <br><br>
                    <span style="color: white">{{currentDate}}</span>
                </div>
            </el-card>
            <el-menu-item index="/Student/noticeS"><i class="el-icon-menu"></i>公告</el-menu-item>
            <el-submenu index="work">
                <template slot="title"><i class="el-icon-menu"></i>作业</template>
                <el-menu-item index="/Student/workDoingS">未完成作业</el-menu-item>
                <el-menu-item index="/Student/workDoneS">已提交作业</el-menu-item>
                <el-menu-item index="/Student/workFinishS">已批改作业</el-menu-item>
            </el-submenu>
            <el-menu-item index="/Student/passwordS"><i class="el-icon-menu"></i>修改密码</el-menu-item>
            <el-menu-item index="exit" v-on:click="exit()"><i class="el-icon-menu"></i>退出登录</el-menu-item>
        </el-menu>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
  created: function() {
    this.$http({
      method: "post",
      url: "/api/student/student_info"
    }).then(response => {
      if (response.data.result === 0) {
          this.userName = response.data.data.student_name;
          this.className = response.data.data.class_name;
      } else {
          this.$notify({
              title: '未知错误！',
              type: 'success',
              offset: 100
          })
        this.$router.replace("/");
      }
    });
  },
  data: function() {
    return {
      userName: "",
      className: ""
    };
  },
  computed: {
    currentDate: function() {
      var currentDate = new Date();
      var month = currentDate.getMonth() + 1;
      var day = currentDate.getDate();
      if (month < 10) {
        month = String("0" + month);
      }
      if (day < 10) {
        day = String("0" + day);
      }
      return currentDate.getFullYear() + "-" + month + "-" + day;
    }
  },
  methods: {
    exit: function() {
      this.$router.replace("/");
    }
  }
};
</script>

<style scoped>
.menu {
  width: 300px;
  height: 100%;
  text-align: left;
  letter-spacing: 3px;
  position: fixed;
  overflow-y: auto;
}

.menu::-webkit-scrollbar{
  width: 10px;
}
.menu::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
.menu::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
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
