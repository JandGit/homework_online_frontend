<template>
    <div class="wrapper">
        <el-table class="table" :data="checkingWorkListPageT" border>
            <el-table-column label="学号" prop="stu_id"></el-table-column>
            <el-table-column label="学生" prop="stu_name"></el-table-column>
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="面向班级" prop="class_name"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="success" v-on:click="checking(scope.$index, scope.row)">开始批改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                :total="this.checkingWorkListT.length"
                :page-size="pageSize"      
                layout="total, prev, pager, next"
                v-on:current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default{
        created: function() {
            this.$http({
                method: 'POST',
                url: '/api/teacher/stu_homeworks',
                data: {
                    'homework_type': 'unchecked',
                    'class_id': -1
                }
                // url: '/api/teacher/checkingWorkListT',
                // headers: {
                //     'Authorization': 'Bearer '+ localStorage.token
                // }
            }).then( (response) => {
                if(response.data.result === 0) {
                    this.checkingWorkListT = response.data.data.homeworks;
                    this.checkingWorkListPageT = this.checkingWorkListT.slice(0,this.pageSize)
                } else if (response.data.result == this.ERRCODE_RELOGIN) {
                    this.$message("登录信息过期，请重新登录");
                    this.$router.replace("/");
                } else {
                    this.$notify({
                        title: "未知错误！",
                        type: "success",
                        offset: 100
                    });
                    this.$router.replace("/");
                }
            })
        },
        data: function() {
            return {
                checkingWorkListT: [],
                checkingWorkListPageT: [],
                pageSize: 10,
                ERRCODE_RELOGIN: 1
            }
        },
        methods: {
            checking: function(index,row) {
                this.$router.push({ name: 'workT', params: { hw_id: row.hw_id, stu_id: row.stu_id, mark: 2 } })
            },
            handleCurrentChange: function(now) {
                this.checkingWorkListPageT = this.checkingWorkListT.slice((now-1)*this.pageSize,now*this.pageSize)
            }
        }
    }
</script>

<style scoped>
    .table{
        width: 1000px;
        margin: 0 auto 50px;
        position: relative;
        top: 100px;
        text-align: left;
    }
    .block{
        position: relative;
        top: 100px;
    }
</style>