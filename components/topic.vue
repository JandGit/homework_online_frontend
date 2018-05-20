<template>
    <div class="topicWrapper">
        <span>{{index + 1}}.</span>
        <span>{{question}}</span>      
        <br><br>
        <!-- 单选题 -->
        <div class="answerWrapper" v-if="type === 'single_choice'">
            <el-radio v-model="value[0]" label="A" :disabled="this.disabled">{{answer[0]}}</el-radio>
            <el-radio v-model="value[0]" label="B" :disabled="this.disabled">{{answer[1]}}</el-radio>
            <el-radio v-model="value[0]" label="C" :disabled="this.disabled">{{answer[2]}}</el-radio>
            <el-radio v-model="value[0]" label="D" :disabled="this.disabled">{{answer[3]}}</el-radio>
            <!--<el-radio v-for="ans in answer" :label="ans" :disabled="this.disabled" :key="ans" v-model="value">-->
                <!--{{ ans }}-->
            <!--</el-radio>-->
            <div class="explain" v-if="status === 'checked'">
                <br><br>
                <span>正确答案：{{answerValueT}}</span>
                <br><br>
                <span>本题解析：{{answerExplain}}</span>
            </div> 
            <br><br>
            <div class="arrow" v-if="status == 'edit'">
                <!-- <el-button class="button" type="success" icon="arrow-up" v-on:click="upTopic()"></el-button> -->
                <!-- <el-button class="button" type="success" icon="arrow-down" v-on:click="downTopic()"></el-button> -->
                <el-button class="button" type="danger" icon="delete" v-on:click="deleteTopic()"></el-button>
            </div>     
        </div>

        <div class="answerWrapper" v-if="type === 'multi_choice'">
            <el-checkbox-group v-model="value">
                <el-checkbox label="A" :disabled="this.disabled">{{answer[0]}}</el-checkbox>
                <el-checkbox label="B" :disabled="this.disabled">{{answer[1]}}</el-checkbox>
                <el-checkbox label="C" :disabled="this.disabled">{{answer[2]}}</el-checkbox>
                <el-checkbox label="D" :disabled="this.disabled">{{answer[3]}}</el-checkbox>
                <!--<el-checkbox v-for="ans in answer" :label="ans"  :key="ans" :disabled="this.disabled">-->
                    <!--{{ ans }}-->
                <!--</el-checkbox> -->
            </el-checkbox-group>
            <div class="explain" v-if="status === 'checked'">
                <br><br>
                <span>正确答案：{{answerValueT}}</span>
                <br><br>
                <span>本题解析：{{answerExplain}}</span>
            </div>
            <br>
            <div class="arrow" v-if="status == 'edit'">
                <!-- <el-button class="button" type="success" icon="arrow-up" v-on:click="upTopic()"></el-button> -->
                <!-- <el-button class="button" type="success" icon="arrow-down" v-on:click="downTopic()"></el-button> -->
                <el-button class="button" type="danger" icon="delete" v-on:click="deleteTopic()"></el-button>
            </div>
        </div>

        <div class="answerWrapper" v-if="type === 'judge'">
            <el-radio v-model="value[0]" label="A" :disabled="this.disabled">对 </el-radio>
            <el-radio v-model="value[0]" label="B" :disabled="this.disabled">错 </el-radio>
            <div class="explain" v-if="status === 'checked'">
                <br><br>
                <span>正确答案：{{answerValueT}}</span>
                <br><br>
                <span>本题解析：{{answerExplain}}</span>
            </div>
            <br><br>
            <div class="arrow" v-if="status == 'edit'">
                <!-- <el-button class="button" type="success" icon="arrow-up" v-on:click="upTopic()"></el-button> -->
                <!-- <el-button class="button" type="success" icon="arrow-down" v-on:click="downTopic()"></el-button> -->
                <el-button class="button" type="danger" icon="delete" v-on:click="deleteTopic()"></el-button>
            </div>
        </div>

        <div class="answerWrapper" v-if="type === 'free_resp'">
            <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                placeholder="请输入内容"
                v-model="value"
                :disabled="this.disabled">
            </el-input>         
            <div class="explain" v-if="status === 'checked'">
                <br><br>
                <span>正确答案：{{answerValueT}}</span>
                <br><br>
                <span>本题解析：{{answerExplain}}</span>
            </div>
            <br><br>
            <div class="arrow" v-if="status == 'edit'">
                <!-- <el-button class="button" type="success" icon="arrow-up" v-on:click="upTopic()"></el-button> -->
                <!-- <el-button class="button" type="success" icon="arrow-down" v-on:click="downTopic()"></el-button> -->
                <el-button class="button" type="danger" icon="delete" v-on:click="deleteTopic()"></el-button>
            </div>
        </div>
        <div class="answerWrapper" v-if="type === 'file'">
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
            <div v-if="status === 'checked'" style="font-size: 10px; color: red;">
                <span v-if="status === 'checked'" style="font-size: 10px; color: red;">本题解析：{{answerExplain}}</span>
                <br><br>
                正确答案: 
                <br>         
                <img v-for="item in answerValueT" :src="item.url" style="width: 300px; height: 300px;"><br><br><br>
            </div>
            <div class="arrow" v-if="status == 'edit'">
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
            id: Number,
            index: Number,
            question: String,
            type: String,
            status: String,
            answer: Object|Array,
            answerValueS: Object|String,
            answerValueT: Object|String,
            answerExplain: String
        },
        mounted: function() {
            if(this.status == "checked" || this.status == undefined || this.status == 'edit' ) {
                this.disabled = true
                this.action = ''
            }
            this.value = this.answerValueS;
            // if(typeof(this.answerValueS)=="string") {
            //     this.value = this.answerValueS
            // }
            // else if(this.type == "multi_choice") {
            //     this.list = this.answerValueS
            // }
            // else if(this.type == "file") {
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
                this.value = file.url
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
