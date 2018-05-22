<template>
    <div class="wrapper">
        <el-table class="table" :data="notices" border>
            <el-table-column label="日期" prop="date"></el-table-column>
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="发布人" prop="author"></el-table-column>
            <el-table-column type="expand">
                <template scope="props">
                    <el-form>
                        <el-form-item label="内容：">
                            <span>{{ props.row.content }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        created: function () {
            this.$http({
                method: "POST",
                url: "/api/student/notices"
            }).then(response => {
                if (response.data.result == 0) {
                    this.notices = response.data.data.notices;
                } else if (response.data.result == this.ERRCODE_RELOGIN) {
                    this.$message("登录信息过期，请重新登录");
                    this.$router.replace("/");
                } else {
                    this.$notify({
                        title: "未知错误！",
                        type: "success",
                        offset: 100
                    });
                }
            });
        },
        data: function () {
            return {
                notices: [],
                ERRCODE_RELOGIN: 1
            };
        }
    };
</script>

<style scoped>
    .table {
        width: 70%;
        margin: 0 auto;
        text-align: left;
        position: relative;
        top: 100px;
    }
</style>

