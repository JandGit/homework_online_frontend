<template>
    <div class="wrapper">
        <div class="topicWrapper">
            <el-form class="topic" label-width="80px">
                <el-form-item label="问题：">
                    <el-input type="textarea" v-model="ques_content" :maxlength=100></el-input>
                </el-form-item>
                <!-- <el-form-item label="标签：">
                    <el-input class="input" v-model="label" :maxlength=20 placeholder="以后可按标签查找题目"></el-input>
                </el-form-item> -->
                <el-form-item label="类型：">
                    <el-select v-model="ques_type" placeholder="请选择">
                        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"
                                   @change="changeType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="答案：">
                    <div v-if="ques_type == 'single_choice'">
                        <el-radio v-model="answer.answer[0]" label="A">A：
                            <el-input v-model="answer.choices[0]" :maxlength=50></el-input>
                        </el-radio>
                        <br><br>
                        <el-radio v-model="answer.answer[0]" label="B">B：
                            <el-input v-model="answer.choices[1]" :maxlength=50></el-input>
                        </el-radio>
                        <br><br>
                        <el-radio v-model="answer.answer[0]" label="C">C：
                            <el-input v-model="answer.choices[2]" :maxlength=50></el-input>
                        </el-radio>
                        <br><br>
                        <el-radio v-model="answer.answer[0]" label="D">D：
                            <el-input v-model="answer.choices[3]" :maxlength=50></el-input>
                        </el-radio>
                        <br><br>
                    </div>
                    <el-checkbox-group v-model="answer.answer" v-if="ques_type == 'multi_choice'">
                        <el-checkbox label="A">A:</el-checkbox>
                        <el-input class="input" v-model="answer.choices[0]" :maxlength=50></el-input>
                        <br><br>
                        <el-checkbox label="B">B:</el-checkbox>
                        <el-input class="input" v-model="answer.choices[1]" :maxlength=50></el-input>
                        <br><br>
                        <el-checkbox label="C">C:</el-checkbox>
                        <el-input class="input" v-model="answer.choices[2]" :maxlength=50></el-input>
                        <br><br>
                        <el-checkbox label="D">D:</el-checkbox>
                        <el-input class="input" v-model="answer.choices[3]" :maxlength=50></el-input>
                        <br><br>
                    </el-checkbox-group>
                    <div v-if="ques_type == 'judge'">
                        <el-radio v-model="answer.answer[0]" label="A">对 </el-radio>
                        <el-radio v-model="answer.answer[0]" label="B">错 </el-radio>
                    </div>
                    <div v-if="ques_type == 'file'">
                        <el-upload
                                accept="image/*"
                                list-ques_type="picture-card"
                                :action="this.action"
                                :on-preview="preview"
                                :on-success="success"
                                :file-list="fileList">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog v-model="show" size="small">
                            <img width="100%" :src="value">
                        </el-dialog>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <el-button class="button" type="success" size="large" v-on:click="dialogVisible = true">提交</el-button>
        <el-dialog title="提示" v-model="dialogVisible" size="large">
            <span>确定提交吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button v-on:click="dialogVisible = false">取消</el-button>
                <el-button type="success" v-on:click="addTopicT()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                ques_content: '',
                ques_type: '',
                label: '',
                answer: {choices: [], answer: []},
                answerValueT: '',
                answerExplain: '',
                typeList: [{
                    value: 'single_choice',
                    label: '单选题'
                }, {
                    value: 'multi_choice',
                    label: '多选题'
                }, {
                    value: 'judge',
                    label: '判断题'
                }, {
                    value: 'free_resp',
                    label: '问答题'
                }],
                fileList: [],
                action: "//jsonplaceholder.typicode.com/posts/",
                show: false,
                dialogVisible: false,
                checkList: [],
                ERRCODE_RELOGIN: 1
            }
        },
        methods: {
            success: function (response, file, fileList) {
                this.fileList = fileList
            },
            preview: function (file) {
                this.value = file.url
                this.show = true;
            },
            gen_choice_answer: function (answer_list) {
                if (answer_list.length <= 0) {
                    return {};
                }
                var answer = {choices: Object.values(this.answer), answer: []};

                if (answer_list.length > 1) {   //multi_choice
                    for (var i = 0; i < answer_list.length; i++) {
                        answer.push(this.answer[answer_list[i]])
                    }
                }
            },
            check_form: function() {
                if (this.ques_content.length <= 0) {
                    this.$notify({
                        title: '请填写题目内容！',
                        type: 'success',
                        offset: 100
                    });
                    return false;
                }
                if (this.ques_type == "single_choice" || this.ques_type == "multi_choice") {
                    var expected_choices_len = 4;
                    if (this.answer.choices.length < expected_choices_len) {
                        this.$notify({
                            title: '请填写完整选择题选项！',
                            type: 'success',
                            offset: 100
                        });
                        return false;
                    }
                    if (0 == this.answer.answer.length) {
                        this.$notify({
                            title: '请提供选择题答案！',
                            type: 'success',
                            offset: 100
                        });
                        return false;
                    }
                    if (this.ques_type == "single_choice") {
                        //由于所有题目类型共享一个全局变量，所以要对这个全局变量做处理
                        this.answer.answer.splice(1, this.answer.answer.length - 1)
                    }
                }
                if (this.ques_type == "judge") {
                    if (0 == this.answer.answer.length) {
                        this.$notify({
                            title: '请提供判断题答案！',
                            type: 'success',
                            offset: 100
                        });
                        return false;
                    }

                    //由于所有题目类型共享一个全局变量，所以要对这个全局变量做处理
                    this.answer.answer.splice(1, this.answer.answer.length - 1);
                    this.answer.choices.splice(0, this.answer.choices.length);
                }
                return true;
            },
            addTopicT: function () {
                if (!this.check_form()) {
                    return;
                }

                // if (this.ques_type == 'single_choice' || this.ques_type == 'multi_choice' ||
                //         this.ques_type == 'judge') {
                //     for (var i = 0; i < this.answer.answer.length; i++) {
                //         if ("A" == this.answer.answer[i]) {
                //             this.answer.answer[i] = this.answer.choices[0];
                //         } else if ("B" == this.answer.answer[i]) {
                //             this.answer.answer[i] = this.answer.choices[1];
                //         } else if ("C" == this.answer.answer[i]) {
                //             this.answer.answer[i] = this.answer.choices[2];
                //         } else if ("D" == this.answer.answer[i]) {
                //             this.answer.answer[i] = this.answer.choices[3];
                //         } else {
                //             this.answer.answer[i] = this.answer.choices[0];
                //         }
                //     }
                // }

                this.$http({
                    method: 'POST',
                    url: '/api/teacher/questions',
                    data: {
                        ques_content: this.ques_content,
                        ques_type: this.ques_type,
                        answer: this.answer
                    }
                }).then((response) => {
                    if (response.data.result == 0) {
                        this.dialogVisible = false;
                        this.answer = {choices: [], answer: []};
                        this.$notify({
                            title: '创建成功',
                            type: 'success',
                            offset: 100
                        });
                    } else if (response.data.result == this.ERRCODE_RELOGIN) {
                        this.$message("登录信息过期，请重新登录");
                        this.$router.replace("/");
                    } else {
                        this.$notify({
                            title: '创建失败，请重试',
                            type: 'success',
                            offset: 100
                        });
                    }
                })
            }
        },
        changeType(vale) {
            console.log(value)
        }
    }
</script>

<style scoped>
    .topicWrapper {
        width: 700px;
        padding: 50px;
        margin: 0px auto 50px;
        position: relative;
        top: 100px;
        border: 1px solid #D3DCE6;
        text-align: left;
    }

    .input {
        width: 200px;
    }

    .button {
        width: 200px;
        height: 50px;
        position: relative;
        top: 100px;
    }
</style>
