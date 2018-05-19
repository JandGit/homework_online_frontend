<template>
    <div class="wrapper">
        <el-menu class="menu" theme="dark" default-active="/Teacher/noticeT" :router=true>
            <el-card class="userCard">
                <div class="imgWrapper">
                    <img src="https://img.alicdn.com/imgextra/i2/855439689/TB2RcHTg90mpuFjSZPiXXbssVXa_!!855439689.png" alt=" moon.png"/>
                </div>
                <div style="padding: 10px;">
                    <span style="color: white">{{userName}}</span>
                    <br><br>
                    <span style="color: white">{{ className }}</span>
                    <br><br>
                    <span style="color: white">{{currentDate}}</span>
                </div>
            </el-card>
            <el-menu-item index="/Teacher/noticeT"><i class="el-icon-menu"></i>公告</el-menu-item>
            <el-submenu index="topic">
                <template slot="title"><i class="el-icon-menu"></i>题库</template>
                <el-menu-item index="/Teacher/addTopicT">增加题目</el-menu-item>
                <el-menu-item index="/Teacher/queryTopicT">查看题库</el-menu-item>
            </el-submenu>
            <el-submenu index="work">
                <template slot="title"><i class="el-icon-menu"></i>作业</template>
                <el-menu-item index="/Teacher/addWorkT">增加作业</el-menu-item>
                <el-menu-item index="/Teacher/queryWorkT">查看作业</el-menu-item>
                <el-menu-item index="/Teacher/checkingWorkT">未批改作业</el-menu-item>
                <el-menu-item index="/Teacher/checkedWorkT">已批改作业</el-menu-item>
            </el-submenu>
            <el-menu-item index="/Teacher/passwordT"><i class="el-icon-menu"></i>修改密码</el-menu-item>
            <el-menu-item index="exit" v-on:click="exit()"><i class="el-icon-menu"></i>退出登录</el-menu-item>
        </el-menu>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default{
        created: function(){
            this.$http({
                method: 'get',
                url: '/api/teacher/teacher_info'
            }).then( response => {
                if(response.data.result == 0) {
                    this.userName = response.data.data.t_name;
                    this.className = response.data.data.dept_name;
                }
                else {
                    this.$notify({
                        title: '未知错误！',
                        type: 'success',
                        offset: 100
                    });
                    this.$router.replace('/')
                }
            })
        },
        data: function() {
            return {
                userName: '',
                className: ''
            }
        },
        computed: {
            currentDate: function() {
                var currentDate = new Date()
                var month = currentDate.getMonth() + 1
                var day = currentDate.getDate()
                if(month<10){
                    month = String('0'+month)
                }
                if(day<10){
                    day = String('0'+day)
                }
                return currentDate.getFullYear() + '-' + month +'-' + day
            }
        },
        methods: {
            exit: function() {
                this.$router.replace('/')
            }
        }
    }
</script>

<style scoped>
    .menu{
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

    .userCard{
        border: 0;
        background: #324057;
    }
    .imgWrapper {
        width: 150px;
        height: 150px;
        margin: 20px auto 0;
    }
    .content{
        width: 80%;
        height: 100%;
        margin-left: 300px;
    }
</style>
