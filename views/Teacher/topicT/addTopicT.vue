<template>
    <div class="wrapper">
        <div class="topicWrapper">
            <el-form class="topic" label-width="80px">
                <el-form-item label="问题：">
                    <el-input type="textarea" v-model="question" :maxlength=100></el-input>
                </el-form-item>
                <!-- <el-form-item label="标签：">
                    <el-input class="input" v-model="label" :maxlength=20 placeholder="以后可按标签查找题目"></el-input>
                </el-form-item> -->
                <el-form-item label="类型：">
                    <el-select v-model="type" placeholder="请选择">
                        <el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.value" @change="changeType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="答案：">
                    <div  v-if="type == '单选题'">
                        <el-radio v-model="answerValueT" label="A">A：&nbsp;<el-input v-model="answer.A" :maxlength=50></el-input></el-radio><br>
                        <el-radio v-model="answerValueT" label="B">B：&nbsp;<el-input v-model="answer.B" :maxlength=50></el-input></el-radio><br>
                        <el-radio v-model="answerValueT" label="C">C：&nbsp;<el-input v-model="answer.C" :maxlength=50></el-input></el-radio><br>
                        <el-radio v-model="answerValueT" label="D">D：&nbsp;<el-input v-model="answer.D" :maxlength=50></el-input></el-radio><br>
                    </div>
                    <el-checkbox-group v-model="checkList" v-if="type == '多选题'">
                        <el-checkbox label="A"></el-checkbox> <el-input class="input" v-model="answer.A" :maxlength=50></el-input><br>
                        <el-checkbox label="B"></el-checkbox> <el-input class="input" v-model="answer.B" :maxlength=50></el-input><br>
                        <el-checkbox label="C"></el-checkbox> <el-input class="input" v-model="answer.C" :maxlength=50></el-input><br>
                        <el-checkbox label="D"></el-checkbox> <el-input class="input" v-model="answer.D" :maxlength=50></el-input><br>
                    </el-checkbox-group>
                    <div  v-if="type == '判断题'">
                        <el-radio v-model="answerValueT" label="A">对 &nbsp;<el-input v-model="answer.A" :maxlength=50></el-input></el-radio><br>
                        <el-radio v-model="answerValueT" label="B">错 &nbsp;<el-input v-model="answer.B" :maxlength=50></el-input></el-radio><br>
                    </div>
                    <el-input v-if="type == '问答题'" type="textarea" :maxlength=300 v-model="answerValueT"></el-input>
                    <div v-if="type=='作图题'">
                        <el-upload
                            accept="image/*"
                            list-type="picture-card"
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
                <!-- <el-form-item label="解释：">
                    <el-input  type="textarea" v-model="answerExplain"></el-input>
                </el-form-item> -->
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
    export default{
        data: function() {
            return {
                question: '',
                type: '',
                label: '',
                answer: {
                    A: '',
                    B: '',
                    C: '',
                    D: ''
                },
                answerValueT: '',
                answerExplain: '',
                typeList: [{
                    value: '单选题',
                    // value: 'single_choice',
                    label: '单选题'
                },{
                    value: '多选题',
                    // value: 'multi_choice',
                    label: '多选题'
                },{
                    value: '判断题',
                    // value: 'judge',
                    label: '判断题'
                },{
                    value: '问答题',
                    // value: 'free_resp',
                    label: '问答题'
                },{
                    value: '作图题',
                    // value: 'file',
                    label: '作图题'
                }],
                fileList: [],
                action: "//jsonplaceholder.typicode.com/posts/",
                show: false,
                dialogVisible: false,
                checkList: []      
            }
        },
        methods: {
            success: function(response,file,fileList) {
                this.fileList = fileList
            },
            preview: function(file) {            
                this.value = file.url
                this.show = true;
            },
            addTopicT: function() {
                if(this.question.length != 0 && this.type.length != 0 && ((this.type != 'multi_choices' &&  this.answerValueT != '') || (this.type == 'multi_choices' &&  this.checkList.length != 0))){
                    var ansKeys = Object.keys(this.answer)
                    var ques_type
                    var ques_answer = []
                    var answer = {}
                    for(var i = 0; i < ansKeys.length; i++ ) {
                        ques_answer.push(this.answer[ansKeys[i]])
                    }
                    answer.choices = ques_answer
                    answer.answer = this.answerValueT
                    if(this.type == '单选题') {
                        ques_type = 'single_choice'
                    } else if(this.type == '多选题') {
                        ques_type = 'multi_choice'
                    } else if(this.type == '判断题') {
                        ques_type = 'judge'
                    } else if(this.type == '问答题') {
                        ques_type = 'free_resp'
                    } else if(this.type == '作图题') {
                        ques_type = 'file'
                    }
                    var data = {
                            ques_content: this.question,
                            // label: this.label,
                            ques_type: ques_type,
                            answer: answer,
                            // answerValueT: this.answerValueT,
                            // answerExplain: this.answerExplain
                        }
                    this.$http({
                        method: 'POST',
                        url: '/api/teacher/questions',
                        // headers: {
                        //         'Authorization': 'Bearer '+ localStorage.token
                        // },
                        data: data
                    }).then( (response) => {
                        if(response.data.result == 0) {
                            this.dialogVisible = false
                        }
                    })
                }
                else {
                    this.$notify({
                        title: '请填写内容！',
                        type: 'warning',
                        offset: 100
                    })
                    this.dialogVisible = false
                }
            },
            changeType(vale) {
                console.log(value)
            }
        }
    }
</script>

<style scoped>
    .topicWrapper{
        width: 700px;
        padding: 50px;
        margin: 0px auto 50px;
        position: relative;
        top: 100px;
        border: 1px solid #D3DCE6;
        text-align: left;
    }
    .input{
        width: 200px;
    }
    .button{
        width: 200px;
        height: 50px;
        position: relative;
        top: 100px;
    }
</style>