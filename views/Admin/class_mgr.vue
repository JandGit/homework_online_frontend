<template>
    <div class="wrapper">
        <!--<el-input class="searchInput" placeholder="请输入要搜索的任意关键字" icon="search"-->
        <!--v-model="searchStudent" :focus="watchEnter()"-->
        <!--v-on:click="search()"></el-input>-->
        <el-table class="table" :data="g_all_class" border>
            <el-table-column label="班级编号" width="150" prop="class_id"></el-table-column>
            <el-table-column label="班级名称" width="150" prop="class_name"></el-table-column>
            <el-table-column label="班级人数" width="150" prop="stu_cnt"></el-table-column>
            <el-table-column label="教师人数" width="150" prop="teacher_cnt"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="success"
                               v-on:click="g_alter_class_info=scope.row, g_show_alter_stu=true">编辑
                    </el-button>
                    <el-button size="small" type="danger" v-on:click="del_class_confirm(g_all_class, scope.$index)">删除
                    </el-button>
                    <el-dialog title="修改班级信息" v-model="g_show_alter_stu">
                        <el-form :model="g_alter_class_info">
                            <el-form-item label="班级名称：" label-width="100px">
                                <el-input v-model="g_alter_class_info.class_name" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button v-on:click="g_show_alter_stu=false">取消</el-button>
                            <el-button type="primary"
                                       v-on:click="modify_class(g_all_class, scope.$index, g_alter_class_info.class_name)">
                                确定
                            </el-button>
                        </div>
                    </el-dialog>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="增加班级" v-model="g_show_add_stu">
            <el-form :model="g_new_class_info">
                <el-form-item label="班级名称：" label-width="100px">
                    <el-input v-model="g_new_class_info.class_name" :maxlength=30></el-input>
                </el-form-item>
                <div class="dialog-footer">
                    <el-button v-on:click="g_show_add_stu=false">取消</el-button>
                    <el-button type="success" v-on:click="add_class(g_new_class_info)">确定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-button class="button" type="success" size="large" icon="plus" v-on:click="g_show_add_stu=true"></el-button>
        <!--<div class="block">-->
        <!--<el-pagination :total="total" :page-size="pageSize" layout="total, prev, pager, next"-->
        <!--v-on:current-change="handleCurrentChange">-->
        <!--</el-pagination>-->
        <!--</div>-->
    </div>
</template>

<script>
    export default {
        created: function () {
            this.get_class_info();
        },
        data: function () {
            return {
                g_all_class: [],
                g_new_class_info: {class_name: ""},
                g_alter_class_info: {class_name: ""},
                g_show_add_stu: false,
                g_show_alter_stu: false
            }
        },
        methods: {
            del_class_confirm(all_class, idx) {
                if (all_class[idx].stu_cnt > 0 ||
                        all_class[idx].teacher_cnt > 0) {
                    this.$message({
                        type: 'warning',
                        message: '当班级仍有教师或学生时，不允许删除！'
                    });
                    return;
                }
                this.$confirm('此操作将永久删除该班级，是否继续？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.del_class(all_class, idx);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消删除！'
                    })
                });
            },
            get_class_info: function () {
                this.$http({
                    method: 'get',
                    url: '/api/admin/class_info'
                }).then(response => {
                    if (response.data.result == 0) {
                        this.g_all_class = response.data.data.class_list;
                    } else {
                        this.$message({
                            message: '数据获取失败',
                            type: 'warn',
                        })
                    }
                });
            },
            add_class: function (new_class_info) {
                this.$http({
                    method: 'post',
                    url: '/api/admin/add_class',
                    data: {
                        "class_name": new_class_info.class_name
                    }
                }).then(response => {
                    if (response.data.result == 0) {
                        this.$message({
                            message: '新增成功',
                            type: 'success',
                        });
                        this.g_show_add_stu = false;
                        this.get_class_info();
                    } else {
                        this.$message({
                            message: '新增失败',
                            type: 'warn',
                        })
                    }
                });
            },
            del_class: function (all_class, del_idx) {
                this.$http({
                    method: 'post',
                    url: '/api/admin/del_class',
                    data: {
                        "class_id": all_class[del_idx].class_id
                    }
                }).then(response => {
                    if (response.data.result == 0) {
                        all_class.splice(del_idx, 1);
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                        });
                    } else {
                        this.$message({
                            message: '删除失败',
                            type: 'warn',
                        });
                    }
                });
            },
            modify_class: function (all_class, modify_idx, new_class_name) {
                this.$http({
                    method: 'post',
                    url: '/api/admin/modify_class',
                    data: {
                        "class_id": all_class[modify_idx].class_id,
                        "class_name": new_class_name
                    }
                }).then(response => {
                    if (response.data.result == 0) {
                        all_class[modify_idx].class_name = new_class_name;
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                        });
                        this.g_show_alter_stu = false;
                    } else {
                        this.$message({
                            message: '修改失败',
                            type: 'warn',
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .table {
        width: 70%;
        margin: 0 auto;
        text-align: left;
        position: relative;
        top: 100px;
    }

    .button {
        position: fixed;
        bottom: 50px;
        right: 50px;
        width: 80px;
        height: 80px;
        border-radius: 100%;
    }

    .dialog-footer {
        text-align: right;
    }

</style>