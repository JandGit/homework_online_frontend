<template>
    <div class="wrapper">
        <el-table class="table" :data="checkedWorkListPageT" border>
            <el-table-column label="学号" prop="stu_id"></el-table-column>
            <el-table-column label="学生" prop="stu_name"></el-table-column>
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="面向班级" prop="class_name"></el-table-column>     
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="success" v-on:click="checked(scope.$index, scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                :total="this.checkedWorkListT.length"
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
                    'homework_type': 'checked',
                    'class_id': -1
                }
                // url: '/api/teacher/checkedWorkListT',
                // headers: {
                //     'Authorization': 'Bearer '+ localStorage.token
                // }
            }).then( (response) => {
                // if(response.data.errno == 200) {
                //     this.checkedWorkListT = response.data.data
                //     this.checkedWorkListPageT = this.checkedWorkListT.slice(0,this.pageSize)
                // }
                 if(response.data.result === 0) {
                    this.checkingWorkListT = response.data.data.homeworks
                    this.checkingWorkListPageT = this.checkingWorkListT.slice(0,this.pageSize)
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
                checkedWorkListT: [],
                checkedWorkListPageT: [],
                pageSize: 10
            }
        },
        methods: {
            checked: function(index,row) {
                this.$router.push({ name: 'workT', params: { hw_id: row.hw_id, stu_id: row.stu_id, mark: 3 } })
            },
            handleCurrentChange: function(now) {
                this.checkedWorkListPageT = this.checkedWorkListT.slice((now-1)*this.pageSize,now*this.pageSize)
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