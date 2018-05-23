<template>
    <div class="wrapper">
        <div class="paper">
            <span>{{this.paper.title}}</span>
            <br><br>
            <span v-if="(mark == 2|3) && paper.stu_id != undefined" style="text-align: left; display: block; float: left">学生ID：{{paper.stu_id}}</span>
            <span v-if="(mark == 2|3) && paper.stu_name != undefined"
                  style="text-align: left; display: block; float: right">学生姓名：{{paper.stu_name}}</span>
            <br><br>
            <div class="topics">
                <span v-if="paper.questions.length == 0" style="color: gray">没有题目</span>
                <topic v-for="(topic, index) in paper.questions"
                       v-bind:show_right_answer="true"
                       v-bind:editable="false"
                       v-bind:show_hw_ctl_btn="paper.status == 'unpublished'"
                       v-bind:prop_ques_obj="topic"
                       v-on:listen="doing"
                       :key="index"
                       :index="index"
                >
                </topic>
                <br><br>
                <div v-if="this.paper.status != 'checked' && this.mark == 2|3">
                    <span style="line-height: 50px;">批注：</span>
                    <el-input v-model="paper.comment" type="textarea" :autosize="{minRows: 2, maxRows: 4}"
                              style="width: 500px;"></el-input>
                    <br><br>
                    <span>分数：</span>
                    <el-input v-model="paper.score" max=100 type="number" style="width: 500px;"></el-input>
                </div>
                <div v-if="this.paper.status == 'checked'">
                    <br><br>
                    <span style="color: red">批注：{{this.paper.comment}}</span>
                    <br><br>
                    <span style="text-align: center; display: block; font-size: 50px; color: red; text-decoration: underline; font-weight: bold;">&nbsp;{{this.paper.score}}分&nbsp;</span>
                </div>
            </div>
            <el-button v-if="mark == 0" class="submit" v-on:click="dialogVisible = true" size="large" type="success"
                       :disabled="this.btnDisabled">
                发布作业
            </el-button>
            <el-button v-if="mark == 2" class="submit" v-on:click="dialogVisible = true" size="large" type="success"
                       :disabled="this.btnDisabled">
                批改完成
            </el-button>
            <el-dialog title="提示" v-model="dialogVisible" size="small" top="30%">
                <span v-if="mark == 0">确定发布作业吗？</span>
                <span v-if="mark == 2">确定批改完成了吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button v-on:click="dialogVisible = false">取 消</el-button>
                    <el-button v-if="mark == 0" type="success" v-on:click="submitWorkT()">确 定</el-button>
                    <el-button v-if="mark == 2" type="success" v-on:click="submitScoreT()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import topic from "../../../components/topic";

    export default {
        components: {
            topic
        },
        created: function () {
            var url;
            this.mark = this.$route.params.mark;
            var postData;
            if (this.mark == 0 || this.mark == 1) {
                postData = {
                    hw_id: this.$route.params.hw_id
                };
                url = "/api/teacher/homeworks/homeworks_detail";
            } else {
                postData = {
                    stu_id: this.$route.params.stu_id,
                    hw_id: this.$route.params.hw_id
                };
                url = "/api/teacher/stu_homeworks_detail";
            }
            this.$http({
                method: "POST",
                url: url,
                data: postData
            }).then(response => {
                if (response.data.result === 0) {
                    this.paper = response.data.data;
                    for (var i = 0; i < this.paper.questions.length; i++) {
                        var old_answer = this.paper.questions[i].answer;
                        this.paper.questions[i].right_answer = old_answer.answer;
                        this.paper.questions[i].answer = old_answer.choices;
                        if (this.paper.questions[i].stu_answer === undefined) {
                            if (this.paper.questions[i].ques_type === "free_resp") {
                                this.paper.questions[i].stu_answer = ""
                            } else {
                                this.paper.questions[i].stu_answer = []
                            }
                        }
                        if (this.paper.questions[i].right_answer === undefined) {
                            this.paper.questions[i].right_answer = "无"
                        }
                        if (this.paper.questions[i].explain === undefined) {
                            this.paper.questions[i].explain = "无"
                        }
                    }
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
            });
        },
        data: function () {
            return {
                paper: {questions: []},
                mark: null,
                btnDisabled: false,
                dialogVisible: false,
                ERRCODE_RELOGIN: 1
            };
        },
        computed: {
            classNames: function () {
                if (this.paper.class_names) {
                    var audiences = "";
                    return audiences;
                }
            }
        },
        methods: {
            doing: function (order, index, id) {
                if (order == "up") {
                    if (this.btnDisabled == false) {
                    } else {
                        this.$notify({
                            title: "已发布的作业不能编辑！",
                            type: "error",
                            offset: 100
                        });
                    }
                } else if (order == "down") {
                    if (this.btnDisabled == false) {
                    } else {
                        this.$notify({
                            title: "已发布的作业不能编辑！",
                            type: "error",
                            offset: 100
                        });
                    }
                } else if (order == "delete") {
                    if (this.btnDisabled == false) {
                    } else {
                        this.$notify({
                            title: "已发布的作业不能编辑！",
                            type: "error",
                            offset: 100
                        });
                    }
                }
            },
            submitWorkT: function () {
                this.$http({
                    method: "POST",
                    url: "/api/teacher/homeworks/publish",
                    data: {
                        'hw_id': this.$route.params.hw_id
                    }
                }).then(response => {
                    if (response.data.result == 0) {
                        this.dialogVisible = false;
                        this.$notify({
                            title: "发布作业成功！",
                            type: "success",
                            offset: 100
                        });
                        this.$router.back();
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
            submitScoreT: function () {
                this.paper.score = parseInt(this.paper.score);
                this.$http({
                    method: "POST",
                    url: "/api/teacher/stu_homeworks/check",
                    data: this.paper
                }).then(response => {
                    if (response.data.result == 0) {
                        this.dialogVisible = false;
                        this.$message({
                            message: "批改成功！",
                            type: "success",
                            offset: 100
                        });
                        this.$router.back();
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
            }
        }
    };
</script>

<style scoped>
    .paper {
        width: 800px;
        margin: 0 auto;
        position: relative;
        top: 50px;
    }

    .topics {
        text-align: left;
        border: 1px solid #d3dce6;
        padding: 50px;
    }

    .submit {
        margin: 30px;
        width: 200px;
        height: 50px;
    }
</style>