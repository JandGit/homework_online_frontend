<template>
    <div class="wrapper">
        <el-input class="searchInput" placeholder="请输入要搜索的题目关键字" v-model="searchValue"
                  icon="search" :focus="watchEnter()" v-on:click="search()"></el-input>
        <el-table class="table" :data="topicsPage" border>
            <el-table-column label="类型" prop="ques_type"></el-table-column>
            <!-- <el-table-column label="标签" prop="label"></el-table-column> -->
            <el-table-column label="问题" prop="ques_content"></el-table-column>
            <!-- <el-table-column label="发布人" prop="author"></el-table-column> -->
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="danger"  v-on:click="deleteTopicT(scope.$index, scope.row)">删除</el-button>
                    <el-button size="small" type="success" v-on:click="dialogVisible = true, g_selected_row=scope.row">加入作业</el-button>
                    <el-dialog title="提示" v-model="dialogVisible">
                        <el-form>
                            <el-form-item>
                                <el-select v-model="workId" multiple placeholder="请选择作业" size="large">
                                    <el-option
                                        v-for="item in workListT" :label="item.title" :value="item.hw_id" :key="item.hw_id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div class="dialog-footer">
                            <el-button v-on:click="dialogVisible=false">取消</el-button>
                            <el-button type="success" v-on:click="topicToWorkT(g_selected_row)">确定</el-button>
                        </div>
                    </el-dialog>
                </template>
            </el-table-column>
            <el-table-column type="expand" class="select">
                <template scope="scope">
                        <el-form>
                            <el-form-item v-if="scope.row.ques_type == '单选题'" label="">
                                <el-radio class="selected_btn" v-model="scope.row.answer.answer[0]" label="A" :disabled=true>A. {{scope.row.answer.choices[0]}}</el-radio>
                                <el-radio class="selected_btn" v-model="scope.row.answer.answer[0]" label="B" :disabled=true>B. {{scope.row.answer.choices[1]}}</el-radio>
                                <el-radio class="selected_btn" v-model="scope.row.answer.answer[0]" label="C" :disabled=true>C. {{scope.row.answer.choices[2]}}</el-radio>
                                <el-radio class="selected_btn" v-model="scope.row.answer.answer[0]" label="D" :disabled=true>D. {{scope.row.answer.choices[3]}}</el-radio>
                            </el-form-item>
                            <el-form-item v-if="scope.row.ques_type == '多选题'" label="">
                                <el-checkbox class="selected_btn" v-model="scope.row.answer.answer" label="A" :disabled=true>A. {{scope.row.answer.choices[0]}}</el-checkbox>
                                <el-checkbox class="selected_btn" v-model="scope.row.answer.answer" label="B" :disabled=true>B. {{scope.row.answer.choices[1]}}</el-checkbox>
                                <el-checkbox class="selected_btn" v-model="scope.row.answer.answer" label="C" :disabled=true>C. {{scope.row.answer.choices[2]}}</el-checkbox>
                                <el-checkbox class="selected_btn" v-model="scope.row.answer.answer" label="D" :disabled=true>D. {{scope.row.answer.choices[3]}}</el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="scope.row.ques_type == '判断题'" label="">
                                <el-radio class="selected_btn" v-model="scope.row.answer.answer[0]" label="A" :disabled=true>对 </el-radio>
                                <el-radio class="selected_btn" v-model="scope.row.answer.answer[0]" label="B" :disabled=true>错 </el-radio>
                            </el-form-item>
                            <el-form-item v-if="scope.row.ques_type == '问答题'" label="">
                                <span>{{scope.row.ques_content}}</span>
                            </el-form-item>
                            <el-form-item v-if="scope.row.ques_type == '作图题'" label="">
                                <!--<img v-for="item in scope.row.answerValueT" :src="item">-->
                            </el-form-item>
                        </el-form>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                :total="total"
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
                method: 'get',
                url: '/api/teacher/questions'
            }).then( (response) => {
                if(response.data.result == 0) {
                    this.topics = response.data.data.questions;
                    this.topicsPage = this.topics.slice(0,this.pageSize)
                } else if (response.data.result == this.ERRCODE_RELOGIN) {
                    this.$message("登录信息过期，请重新登录");
                    this.$router.replace("/");
                } else {
                    this.$message("数据获取失败，请刷新重试");
                }
            })

            // this.$http({
            //     method: 'POST',
            //     url: '/api/teacher/indexT',
            //     headers: {
            //         'Authorization': 'Bearer '+ localStorage.token
            //     }
            // }).then( (response) => {
            //     if(response.data.errno == 200) {
            //         this.id = response.data.data.id
            //         this.userName = response.data.data.name
            //     }
            //     else {
            //         this.$notify({
            //             title: '未知错误！',
            //             type: 'success',
            //             offset: 100
            //         })
            //     }
            // })

            this.$http({
                method: 'POST',
                url: '/api/teacher/homeworks'
            }).then( (response) => {
                if(response.data.result == 0) {
                    this.workListT = response.data.data.homeworks
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
        },
        data: function() {
            return {
                id: '',
                userName: '',
                workListT: [],
                searchValue: '',
                topics: [],
                topicsPage: [],
                workId: [],
                dialogVisible: false,
                pageSize: 10,
                ERRCODE_RELOGIN: 1
            }
        },
        computed: {
            total: function() {
                return this.topics.length
            },
            // workDoingListT: function() {
            //     var workDoingListT = []
            //     for(var i=0; i<this.workListT.length; i++) {
            //         if(this.workListT[i].status == "未发布") {
            //             workDoingListT.push(this.workListT[i])
            //         }
            //     }
            //     return workDoingListT
            // }
        },
        methods: {
            watchEnter: function() {
                var self = this
                window.addEventListener('keyup',function(e) {
                    if(e.keyCode == 13) {
                        self.search()
                    }
                })
            },
            search: function() {
                this.$http({
                    method: 'POST',
                    url: '/api/teacher/queryTopicT',
                    headers: {
                        'Authorization': 'Bearer '+ localStorage.token
                    },
                    body: {
                        searchValue: this.searchValue
                    }
                }).then((response) => {
                    if(response.data.result == 0) {
                        this.topics = response.data.data;
                        this.topicsPage = this.topics.slice(0,this.pageSize)
                    } else if (response.data.result == this.ERRCODE_RELOGIN) {
                        this.$message("登录信息过期，请重新登录");
                        this.$router.replace("/");
                    } else {
                        this.$message("数据获取失败");
                    }
                })
            },
            topicToWorkT: function(row) {
                if(this.workId.length>0) {
                    for(var i =0; i < this.workId.length; i++) {
                        console.log("add ques_id:" + row.ques_id + " content:" + row.ques_content);
                        this.$http({
                            method: 'POST',
                            url: '/api/teacher/homeworks/add_question',
                            data: {
                                "ques_id": row.ques_id,
                                "hw_id": this.workId[i]
                            }
                        }).then( (response) => {
                            if(response.data.result == 0){
                                this.dialogVisible = false;
                                this.$notify({
                                    title: '加入成功！',
                                    type: 'success',
                                    offset: 100
                                })
                            } else if (response.data.result == this.ERRCODE_RELOGIN) {
                                this.$message("登录信息过期，请重新登录");
                                this.$router.replace("/");
                            } else {
                                this.$notify({
                                    title: '未知错误！',
                                    type: 'info',
                                    offset: 100
                                })
                                this.$router.replace('/')
                            }
                        })

                    }
                }
                else {
                    this.dialogVisible = false
                    this.$notify({
                        title: '请选择作业！',
                        type: 'info',
                        offset: 100
                    })
                }
            },
            deleteTopicT: function(index, row) {
                this.$confirm('此操作将永久删除该题目，是否继续？','提示',{
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        method: 'POST',
                        url: '/api/teacher/del_question',
                        data: {
                            "ques_id": row.ques_id
                        }
                    }).then( (response) => {
                        if(response.data.result == 0){
                            this.topics.splice(index,1);
                            this.topicsPage.splice(index,1);
                        } else if (response.data.result == this.ERRCODE_RELOGIN) {
                            this.$message("登录信息过期，请重新登录");
                            this.$router.replace("/");
                        } else {
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
                });
            },
            handleCurrentChange: function(now) {
                this.topicsPage = this.topics.slice((now-1)*this.pageSize,now*this.pageSize)
            }
        },
        watch: {
            topicsPage: function(now) {
                for(var i=0; i<now.length; i++) {
                    if(now[i].ques_type == 'single_choice') {
                        now[i].ques_type = '单选题'
                    } else if(now[i].ques_type == 'multi_choice') {
                        now[i].ques_type = '多选题'
                    } else if(now[i].ques_type == 'judge') {
                        now[i].ques_type = '判断题'
                    } else if(now[i].ques_type == 'free_resp') {
                        now[i].ques_type = '问答题'
                    } if(now[i].ques_type == 'file') {
                        now[i].ques_type = '作图题'
                    }
                }
            }
        }
    }

</script>

<style>
    .selected_btn .el-radio__input.is-disabled+.el-radio__label{
        color: black!important;
    }
    .selected_btn .el-checkbox__input.is-disabled+.el-checkbox__label {
        color: black!important;
    }
</style>

<style scoped>
    .searchInput{
        width: 1000px;
        margin: 0 auto 10px;
        position: relative;
        top: 100px;
        text-align: left;
    }
    .table{
        width: 1000px;
        margin: 0 auto 50px;
        position: relative;
        top: 100px;
        text-align: left;
    }
    img{
        width: 200px;
        height: 200px;
    }
    .block{
        position: relative;
        top: 100px;
    }
    .dialog-footer{
        text-align: right;
    }
</style>
