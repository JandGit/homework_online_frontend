<template>
    <div class="wrapper">
        <el-input class="searchInput" placeholder="请输入要搜索的任意关键字" icon="search"
                  v-model="searchStudent" :focus="watchEnter()"
                  v-on:click="search()"></el-input>
        <el-table class="table" :data="queryStudents" border>
            <el-table-column label="学生编号" width="180" prop="stu_id"></el-table-column>
            <el-table-column label="学生姓名" width="180" prop="stu_name"></el-table-column>
            <el-table-column label="所在班级" width="200" prop="class_info.class_name"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="success" v-on:click="openAlter(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button size="small" type="danger" v-on:click="deleteStudent(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="增加学生" v-model="dialogVisible">
            <el-form :model="new_student">
                <el-form-item label="学生编号：" label-width="100px">
                    <el-input v-model="new_student.stu_id" :maxlength=30></el-input>
                </el-form-item>
                <el-form-item label="学生姓名：" label-width="100px">
                    <el-input v-model="new_student.stu_name" :maxlength=30></el-input>
                </el-form-item>
                <el-form-item label="所在班级：" label-width="100px">
                    <el-select v-model="new_student.class_info.class_id" placeholder="请选择班级" size="large">
                        <el-option v-for="item in all_class_list" :label="item.class_name" :value="item.class_id"
                                   :key="item.class_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="dialog-footer">
                    <el-button v-on:click="dialogVisible=false">取消</el-button>
                    <el-button type="success" v-on:click="addStudent()">确定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-button class="button" type="success" size="large" icon="plus" v-on:click="dialogVisible=true"></el-button>
        <el-dialog title="修改学生信息" v-model="dialogFormVisible">
            <el-form :model="alterStudent">
                <el-form-item label="学生编号：" label-width="100px">
                    <el-input v-model="alterStudent.stu_id" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="学生姓名：" label-width="100px">
                    <el-input v-model="alterStudent.stu_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所在班级：" label-width="100px">
                    <el-select v-model="alterStudent.class_info.class_id" placeholder="请选择班级" size="large">
                        <el-option v-for="item in all_class_list" :label="item.class_name" :value="item.class_id"
                                   :key="item.class_id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-on:click="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary" v-on:click="alterStudentA()">确 定</el-button>
            </div>
        </el-dialog>
        <div class="block">
            <el-pagination :total="total" :page-size="pageSize" layout="total, prev, pager, next"
                           v-on:current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        created: function () {
            this.$http({
                method: 'post',
                url: '/api/admin/stu_list',
                data: {
                    search: ""
                }
            }).then(response => {
                if (response.data.result == 0) {
                    this.students = response.data.data.students;
                    this.queryStudents = this.students.slice(0, this.pageSize);
                } else if (response.data.result == this.ERRCODE_RELOGIN) {
                    this.$message("登录信息过期，请重新登录");
                    this.$router.replace("/");
                } else {
                    this.$message("数据查询失败，请稍后重试")
                }
            });
            this.$http({
                method: 'get',
                url: '/api/admin/class_info'
            }).then((response) => {
                if (response.data.result == 0) {
                    this.all_class_list = response.data.data.class_list;
                    this.all_class_map.clear();
                    for (var i = 0; i < this.all_class_list.length; i++) {
                        var class_id = this.all_class_list[i].class_id;
                        var class_name = this.all_class_list[i].class_name;
                        this.all_class_map.set(class_id, class_name);
                    }
                } else if (response.data.result == this.ERRCODE_RELOGIN) {
                    this.$message("登录信息过期，请重新登录");
                    this.$router.replace("/");
                } else {
                    this.$notify({
                        title: '获取数据错误！',
                        type: 'success',
                        offset: 100
                    })
                }
            })
        },
        data: function () {
            return {
                students: [],
                queryStudents: [],
                new_student: {
                    stu_id: "",
                    stu_name: "",
                    class_info: {class_id: undefined, class_name: ""}
                },
                alterStudent: {
                    stu_id: 0,
                    stu_name: "",
                    class_info: {class_id: undefined, class_name: ""}
                },
                alterRow: {},
                dialogVisible: false,
                all_class_list: [],
                all_class_map: new Map(),
                dialogFormVisible: false,
                searchStudent: "",
                pageSize: 10,
                ERRCODE_RELOGIN: 1
            }
        },
        computed: {
            total: function () {
                return this.students.length;
            }
        },
        methods: {
            watchEnter: function () {
                var self = this;
                window.addEventListener("keyup", function (e) {
                    if (e.keyCode == 13) {
                        self.search();
                    }
                })
            },
            search: function () {
                this.$http({
                    method: 'post',
                    url: '/api/admin/stu_list',
                    data: {
                        search: this.searchStudent
                    }
                }).then((response) => {
                    if (response.data.result == 0) {
                        this.students = response.data.data.students;
                        this.queryStudents = this.students.slice(0, this.pageSize);
                    } else if (response.data.result == this.ERRCODE_RELOGIN) {
                        this.$message("登录信息过期，请重新登录");
                        this.$router.replace("/");
                    } else {
                        this.$notify({
                            title: '获取数据错误！',
                            type: 'success',
                            offset: 100
                        })
                    }
                })
            },
            openAlter: function (index, row) {
                this.dialogFormVisible = true;
                this.alterStudent.stu_id = row.stu_id;
                this.alterStudent.stu_name = row.stu_name;
                this.alterStudent.class_info = row.class_info;
                this.alterRow = row;
            },
            alterStudentA: function () {
                if (this.alterStudent.stu_name != "") {
                    this.$http({
                        method: 'post',
                        url: '/api/admin/modify_stu',
                        data: {
                            old_stu_id: this.alterRow.stu_id,
                            new_stu_id: this.alterStudent.stu_id,
                            new_stu_name: this.alterStudent.stu_name,
                            new_class_id: this.alterStudent.class_info.class_id
                        }
                    }).then((response) => {
                        if (response.data.result == 0) {
                            this.alterRow.stu_id = this.alterStudent.stu_id;
                            this.alterRow.stu_name = this.alterStudent.stu_name;
                            this.alterRow.class_info = this.alterStudent.class_info;
                            this.alterRow.class_info.class_name = this.all_class_map.get(
                                this.alterRow.class_info.class_id);
                            this.dialogFormVisible = false;
                        } else if (response.data.result == this.ERRCODE_RELOGIN) {
                            this.$message("登录信息过期，请重新登录");
                            this.$router.replace("/");
                        } else {
                            this.$notify({
                                title: '未知错误！',
                                type: 'success',
                                offset: 100
                            })
                        }
                    })
                } else {
                    this.$notify({
                        title: '请填写内容！',
                        type: 'warning',
                        offset: 100
                    })
                }
            },
            deleteStudent: function (index, row) {
                this.$confirm('此操作将永久删除该学生，是否继续？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        method: 'post',
                        url: '/api/admin/del_stu',
                        data: {
                            stu_id: row.stu_id
                        }
                    }).then((response) => {
                        if (response.data.result == 0) {
                            this.students.splice(index, 1),
                                this.queryStudents.splice(index, 1)
                        } else if (response.data.result == this.ERRCODE_RELOGIN) {
                            this.$message("登录信息过期，请重新登录");
                            this.$router.replace("/");
                        } else {
                            this.$notify({
                                title: '未知错误！',
                                type: 'success',
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
            },
            addStudent: function () {
                if (this.new_student.stu_id != '' && this.new_student.stu_name != ''
                    && this.all_class_map.has(this.new_student.class_info.class_id)) {
                    this.$http({
                        method: 'post',
                        url: '/api/admin/add_stu',
                        data: {
                            stu_id: this.new_student.stu_id,
                            stu_name: this.new_student.stu_name,
                            class_id: this.new_student.class_info.class_id
                        }
                    }).then((response) => {
                        if (response.data.result == 0) {
                            this.dialogVisible = false;
                            this.new_student.class_info.class_name =
                                this.all_class_map.get(this.new_student.class_info.class_id);
                            this.students.push(this.new_student);
                            this.queryStudents = this.students.slice(0, this.pageSize);
                            this.new_student = {
                                stu_id: "",
                                stu_name: "",
                                class_info: {class_id: undefined, class_name: ""}
                            }
                        } else if (response.data.result == this.ERRCODE_RELOGIN) {
                            this.$message("登录信息过期，请重新登录");
                            this.$router.replace("/");
                        } else {
                            this.$notify({
                                title: '未知错误！',
                                type: 'success',
                                offset: 100
                            })
                        }
                    })
                } else {
                    this.$notify({
                        title: '请填写内容！',
                        type: 'warning',
                        offset: 100
                    })
                }
            },
            handleCurrentChange: function (now) {
                this.queryStudents = this.students.slice((now - 1) * this.pageSize, now * this.pageSize)
            }
        }
    }
</script>

<style scoped>
    .searchInput {
        width: 70%;
        margin: 0 auto 10px;
        position: relative;
        top: 100px;
        text-align: left;
    }

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

    .block {
        position: relative;
        top: 120px;
    }
</style>
