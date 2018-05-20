<template>
    <div class="wrapper">
        <el-table class="table" :data="workListT" border>
            <el-table-column label="开始日期" prop="date_start"></el-table-column>
            <el-table-column label="结束日期" prop="date_end"></el-table-column>
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="面向班级" prop="class_names"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="danger"  v-on:click="deleteWorkT(scope.$index, scope.row)">删除</el-button>
                    <el-button size="small" type="success" v-on:click="alterWorkT(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div> 
</template>

<script>
    export default{
        created: function() {
            this.$http({
                method: 'POST',
                url: '/api/teacher/homeworks',
                // url: '/api/teacher/workListT',
                // headers: {
                //     'Authorization': 'Bearer '+ localStorage.token
                // }
            }).then( (response) => {
                if(response.data.result == 0) {
                    this.workListT = response.data.data.homeworks
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
                workListT: [],
            }
        },
        watch: {
            workListT: function(now) {
                for(var i=0; i<now.length; i++) {
                    if(now[i].status == 'published') {
                        now[i].status = '已发布'
                    }
                    if(now[i].status == 'unpublished') {
                        now[i].status = '未发布'
                    }
                    now[i].class_names = now[i].class_names.join(',') 
                }
            }
        },
        methods: {
            alterWorkT: function(index,row) {
                if(row.status == "未发布") {
                    this.$router.push({ name: 'workT', params: { hw_id: row.hw_id, mark: 0 } })
                }
                else {
                    this.$notify({
                        title: '已发布的作业不能编辑！',
                        type: 'warning',
                        offset: 100
                    })
                    // this.$router.push({ name: 'workT', params: { hw_id: row.hw_id, mark: 1 } })
                }
            },
            deleteWorkT: function(index,row) {
                // if(row.status == "未发布") {
                    this.$confirm('此操作将永久删除该作业，是否继续？','提示',{
                        type: 'warning'
                    }).then( () => {
                        this.$http({
                            method: 'POST',
                            url: '/api/teacher/deleteWorkT',
                            headers: {
                                'Authorization': 'Bearer '+ localStorage.token
                            },
                            body: {
                                "id": row.id
                            }
                        }).then( (response) => {
                            if(response.data.errno == 200){
                                this.workListT.splice(index,1)                           
                            }
                            else {
                                this.$notify({
                                    title: '未知错误！',
                                    type: 'info',
                                    offset: 100
                                })
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消删除！'
                        })
                    })
                // }
                // else {
                //     this.$notify({
                //         title: '已发布的作业不能删除！',
                //         type: 'warning',
                //         offset: 100
                //     })
                // }
                
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
</style>