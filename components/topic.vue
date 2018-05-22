<template>
    <div class="topicWrapper">
        <span>{{index + 1}}.</span>
        <span>{{ques_content}}</span>      
        <br><br>
        <!-- 单选题 -->
        <div class="answerWrapper" v-if="ques_type === 'single_choice'">
            <el-radio class="selected_btn" v-model="stu_answer[0]" label="A" :disabled="!editable">A. {{choices[0]}}</el-radio>
            <el-radio class="selected_btn" v-model="stu_answer[0]" label="B" :disabled="!editable">B. {{choices[1]}}</el-radio>
            <el-radio class="selected_btn" v-model="stu_answer[0]" label="C" :disabled="!editable">C. {{choices[2]}}</el-radio>
            <el-radio class="selected_btn" v-model="stu_answer[0]" label="D" :disabled="!editable">D. {{choices[3]}}</el-radio>
            <div class="explain" v-if="show_right_answer">
                <br><br>
                <span>正确答案：{{right_answer}}</span>
                <br><br>
                <span>本题解析：{{explain}}</span>
            </div> 
            <br><br>
            <div class="arrow" v-if="show_hw_ctl_btn">
                 <el-button class="button" type="success" icon="arrow-up" v-on:click="upTopic()"></el-button>
                 <el-button class="button" type="success" icon="arrow-down" v-on:click="downTopic()"></el-button>
                <el-button class="button" type="danger" icon="delete" v-on:click="deleteTopic()"></el-button>
            </div>     
        </div>

        <div class="answerWrapper" v-if="ques_type === 'multi_choice'">
            <el-checkbox-group v-model="stu_answer">
                <el-checkbox class="selected_btn" label="A" :disabled="!editable">A. {{choices[0]}}</el-checkbox>
                <el-checkbox class="selected_btn" label="B" :disabled="!editable">B. {{choices[1]}}</el-checkbox>
                <el-checkbox class="selected_btn" label="C" :disabled="!editable">C. {{choices[2]}}</el-checkbox>
                <el-checkbox class="selected_btn" label="D" :disabled="!editable">D. {{choices[3]}}</el-checkbox>
            </el-checkbox-group>
            <div class="explain" v-if="show_right_answer">
                <br><br>
                <span>正确答案：{{right_answer}}</span>
                <br><br>
                <span>本题解析：{{explain}}</span>
            </div>
            <br>
            <div class="arrow" v-if="show_hw_ctl_btn">
                 <el-button class="button" type="success" icon="arrow-up" v-on:click="upTopic()"></el-button>
                 <el-button class="button" type="success" icon="arrow-down" v-on:click="downTopic()"></el-button>
                <el-button class="button" type="danger" icon="delete" v-on:click="deleteTopic()"></el-button>
            </div>
        </div>

        <div class="answerWrapper" v-if="ques_type === 'judge'">
            <el-radio class="selected_btn" v-model="stu_answer[0]" label="A" :disabled="!editable">A. 对</el-radio>
            <el-radio class="selected_btn" v-model="stu_answer[0]" label="B" :disabled="!editable">B. 错</el-radio>
            <div class="explain" v-if="show_right_answer">
                <br><br>
                <span>正确答案：{{right_answer}}</span>
                <br><br>
                <span>本题解析：{{explain}}</span>
            </div>
            <br><br>
            <div class="arrow" v-if="show_hw_ctl_btn">
                 <el-button class="button" type="success" icon="arrow-up" v-on:click="upTopic()"></el-button>
                 <el-button class="button" type="success" icon="arrow-down" v-on:click="downTopic()"></el-button>
                <el-button class="button" type="danger" icon="delete" v-on:click="deleteTopic()"></el-button>
            </div>
        </div>

        <div class="answerWrapper" v-if="ques_type === 'free_resp'">
            <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                placeholder=""
                v-model="stu_answer"
                :disabled="!editable">
            </el-input>         
            <div class="explain" v-if="show_right_answer">
                <br><br>
                <span>本题解析：{{explain}}</span>
            </div>
            <br><br>
            <div class="arrow" v-if="show_hw_ctl_btn">
                <el-button class="button" type="danger" icon="delete" v-on:click="deleteTopic()"></el-button>
            </div>
        </div>
        <div class="answerWrapper" v-if="ques_type === 'file'">
            <el-upload           
                accept="image/*"
                list-type="picture-card"
                :action="this.action"
                :on-preview="preview"  
                :on-success="success"
                :on-remove="remove"  
                :file-list="fileList">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog v-model="show" size="small">
                <img width="100%" :src="value">
            </el-dialog>
            <br>
            <div class="explain" v-if="show_right_answer">
                <br><br>
                <span>本题解析：{{explain}}</span>
            </div>
            <div class="arrow" v-if="show_hw_ctl_btn">
                <!-- <el-button class="button" type="success" icon="arrow-up" v-on:click="upTopic()"></el-button> -->
                <!-- <el-button class="button" type="success" icon="arrow-down" v-on:click="downTopic()"></el-button> -->
                <el-button class="button" type="danger" icon="delete" v-on:click="deleteTopic()"></el-button>
            </div>
        </div>
        <br>
    </div>
</template>

<script>
    export default{
        props: {
            ques_id: Number,
            index: Number,
            ques_content: String,
            ques_type: String,
            status: String,
            choices: Object | Array,
            stu_answer: Object | Array,
            right_answer: Object|String,
            explain: String,
            show_right_answer: Boolean,
            editable: Boolean,
            show_hw_ctl_btn: Boolean
        },
        mounted: function() {
            // if (this.right_answer == undefined) {
            //     this.right_answer = (this.ques_type == "free_resp" ? "" : []);
            // }
            console.log("show_right_answer:" + this.show_right_answer);
            // if(typeof(this.answerValueS)=="string") {
            //     this.value = this.answerValueS
            // }
            // else if(this.ques_type == "multi_choice") {
            //     this.list = this.answerValueS
            // }
            // else if(this.ques_type == "file") {
            //     this.fileList = this.answerValueS
            // }
        },
        data: function() {
            return {
                value: [],
                list: [],
                fileList: [],
                show: false,
                action: "//jsonplaceholder.typicode.com/posts/",
                disabled: false
            }
        },
        methods: {
            success(response,file,fileList) {
                this.fileList = fileList
            },
            preview(file) {            
                this.value = file.url;
                this.show = true;
            },
            remove(file,fileList) { 
                if(this.status == 'checked' || this.status == undefined){
                    fileList.push(file)
                }            
            },
            upTopic: function() {
                this.$emit("listen",'up',this.index)
            },
            downTopic: function() {
                this.$emit("listen",'down',this.index)
            },
            deleteTopic: function() {
                this.$emit("listen",'delete',this.index, this.id)
            },
        },
        watch: {
            value: function(now) {
                this.$emit("listen",now,this.index)
            },
            list: function(now) {
                this.$emit("listen",now,this.index)
            },
            fileList: function(now) {
                this.$emit("listen",now,this.index)
            }
        } 
    }
</script>

<style>
    .selected_btn .el-radio__input.is-disabled+.el-radio__label{
        color: black;
    }
    .selected_btn .el-checkbox__input.is-disabled+.el-checkbox__label {
        color: black;
    }

    .answerWrapper .el-textarea.is-disabled .el-textarea__inner {
        color: black;
    }
</style>

<style scoped>
    .explain{
        font-size: 10px;
        color: red;
    }
    .topicWrapper{
        position: relative;
        width: 80%;
    }
    .arrow{
        position: absolute;
        width: 200px;
        top: 0px;
        left: 560px;
    }
    .button {
        width: 40px;
        height: 40px;
        padding-left: 12px;
        border-radius: 100%;
    }
</style>
