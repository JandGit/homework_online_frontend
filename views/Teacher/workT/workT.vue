<template>
    <div class="wrapper">
        <div class="paper">
            <span>{{this.paper.title}}</span>
            <br><br>
            <span v-if="mark == 0" style="text-align: left; display: block; float: left">{{this.classNames}}</span>
            <span v-if="mark == 2|3" style="text-align: left; display: block; float: left">{{this.paper.stu_id}}</span>
            <span v-if="mark == 2|3"
                  style="text-align: left; display: block; float: right">{{this.paper.stu_name}}</span>
            <br><br>
            <div class="topics">
                <!-- :index = "topic.index" -->
                <!-- :answerValueS = "topic.answerValueT" -->
                <!-- :answerExplain = "topic.answerExplain" -->
                <topic v-for="(topic, index) in paper.questions"
                       v-on:listen="doing"
                       :key="topic.ques_id"
                       :id="topic.ques_id"
                       :index="index"
                       :question="topic.ques_content"
                       :type="topic.ques_type"
                       :status="topic.status"
                       :answer="topic.answer.choices"
                       :answerValueS="topic.stu_answer.choices"
                >
                </topic>
                <br><br>
                <div v-if="this.paper.status != 'checked'">
                    <span style="line-height: 50px;">批注：</span>
                    <el-input v-model="paper.comment" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                              style="width: 500px;"></el-input>
                    <br><br>
                    <span>分数：</span>
                    <el-input v-model="paper.score" max="100" type="number" style="width: 500px;"></el-input>
                </div>
                <div v-if="this.paper.status == 'checked'">
                    <br><br>
                    <span>批注：{{this.paper.comment}}</span>
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
            // if(this.$route.params.mark == 0 ) {
            //     url = '/api/teacher/workDoingT'
            // }
            // else if(this.$route.params.mark == 1) {
            //     url = '/api/teacher/workFinishT'
            //     this.btnDisabled = true
            // }
            // else if(this.$route.params.mark == 2) {
            //     url = '/api/teacher/checkingWorkT'
            // }
            // else if(this.$route.params.mark == 3) {
            //     url = '/api/teacher/checkedWorkT'
            // }
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
                    if (this.mark == 0) {
                        for (var i = 0; i < this.paper.questions.length; i++) {
                            // this.paper.questions[i].index = i+1
                            this.paper.questions[i].status = "edit";
                        }
                    }
                    // else {
                    //     for (var i=0; i< this.paper.topics.length; i++) {
                    //         this.paper.topics[i].index = i+1
                    //     }
                    // }
                } else {
                    this.$notify({
                        title: "未知错误！",
                        type: "success",
                        offset: 100
                    });
                    this.$router.replace("/");
                }
                // if(this.mark == 0){
                //     for (var i=0; i< this.paper.topics.length; i++) {
                //         this.paper.topics[i].index = i+1
                //         this.paper.topics[i].status = 'edit'
                //     }
                // }
                // else {
                //     for (var i=0; i< this.paper.topics.length; i++) {
                //         this.paper.topics[i].index = i+1
                //     }
                // }
            });
        },
        data: function () {
            return {
                paper: {},
                mark: null,
                btnDisabled: false,
                dialogVisible: false
            };
        },
        computed: {
            classNames: function () {
                if (this.paper.class_names) {
                    var audiences = "";
                    for (var i = 0; i < this.paper.class_names.length; i++) {
                        audiences = audiences + " " + this.paper.class_name[i];
                    }
                    return audiences;
                }
            }
        },
        methods: {
            doing: function (order, index, id) {
                if (order == "up") {
                    if (this.btnDisabled == false) {
                        for (var i = 0; i < this.paper.questions.length; i++) {
                            if (i == index && index != 1) {
                                // if(this.paper.questions[i].index == index && index !=1) {
                                var temp = this.paper.questions[i];
                                // this.paper.questions[i].index -= 1
                                // this.paper.questions[i-1].index += 1
                                this.paper.questions.splice(i, 1);
                                this.paper.questions.splice(i - 1, 0, temp);
                            }
                        }
                    } else {
                        this.$notify({
                            title: "已发布的作业不能编辑！",
                            type: "error",
                            offset: 100
                        });
                    }
                } else if (order == "down") {
                    if (this.btnDisabled == false) {
                        for (var i = 0; i < this.paper.questions.length; i++) {
                            // if(this.paper.questions[i].index == index && index != this.paper.questions.length) {
                            if (i == index && index != this.paper.questions.length) {
                                var temp = this.paper.questions[i];
                                // this.paper.questions[i].index += 1
                                // this.paper.questions[i+1].index -= 1
                                this.paper.questions.splice(i, 1);
                                this.paper.questions.splice(i + 1, 0, temp);
                            }
                        }
                    } else {
                        this.$notify({
                            title: "已发布的作业不能编辑！",
                            type: "error",
                            offset: 100
                        });
                    }
                } else if (order == "delete") {
                    if (this.btnDisabled == false) {
                        this.$confirm("此操作将从本作业中永久删除此题，是否继续？", "提示", {
                            type: "warning"
                        })
                            .then(() => {
                                this.$http({
                                    method: "POST",
                                    url: "/api/teacher/homeworks/del_question",
                                    data: {
                                        ques_id: id,
                                        hw_id: this.$route.params.hw_id
                                    }
                                }).then(response => {
                                    if (response.data.result == 0) {
                                        for (var i = 0; i < this.paper.questions.length; i++) {
                                            if (i == index) {
                                                this.paper.questions.splice(i, 1);
                                            }
                                        }
                                    } else {
                                        this.$notify({
                                            title: "未知错误！",
                                            type: "info",
                                            offset: 100
                                        });
                                    }
                                });
                            })
                            .catch(() => {
                                this.$message({
                                    type: "info",
                                    message: "取消删除！"
                                });
                            });
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
                for (var i = 0; i < this.paper.questions.length; i++) {
                    // delete this.paper.questions[i].index
                    delete this.paper.questions[i].status;
                }
                this.$http({
                    method: "POST",
                    url: "/api/teacher/homeworks/publish",
                    // headers: {
                    //     'Authorization': 'Bearer '+ localStorage.token
                    // },
                    data: {
                        'hw_id': this.$route.params.hw_id
                        //   paper: this.paper
                    }
                }).then(response => {
                    if (response.data.result == 0) {
                        this.dialogVisible = false;
                        this.$notify({
                            title: "提交作业成功！",
                            type: "success",
                            offset: 100
                        });
                        this.$router.back();
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
                this.$http({
                    method: "POST",
                    url: "/api/teacher/stu_homeworks/check",
                    // headers: {
                    //     'Authorization': 'Bearer '+ localStorage.token
                    // },
                    data: {
                        paper: this.paper
                    }
                }).then(response => {
                    if (response.data.result == 0) {
                        this.dialogVisible = false;
                        this.$notify({
                            title: "提交作业成功！",
                            type: "success",
                            offset: 100
                        });
                        this.$router.back();
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