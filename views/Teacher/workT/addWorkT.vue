<template>
    <div class="wrapper">
        <div class="workWrapper">
            <el-form class="topic" label-width="100px">
                <el-form-item label="作业名称：">
                    <el-input type="text" v-model="title" :maxlength=30></el-input>
                </el-form-item>
                <el-form-item label="面向班级：">
                    <el-select v-model="hw_class_id" multiple placeholder="请选择班级">
                        <el-option v-for="item in g_all_class_list" :key="item.class_id"
                                   :label="item.class_name" :value="item.class_id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始日期：">
                    <el-date-picker
                        v-model="dateStart"
                        type="date"
                        format="yyyy-MM-dd"
                        @change="changeStart"
                        placeholder="选择开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期：">
                    <el-date-picker
                        v-model="dateFinish"
                        type="date"
                        format="yyyy-MM-dd"
                        @change="changeEnd"
                        placeholder="选择开始日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <el-button class="button" type="success" size="large" v-on:click="dialogVisible = true">提交</el-button>
        <el-dialog title="提示" v-model="dialogVisible" size="large">
            <span>确定提交吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button v-on:click="dialogVisible = false">取消</el-button>
                <el-button type="success" v-on:click="addWorkT()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        created: function() {
            this.$http({
                method: 'get',
                url: '/api/teacher/teach_class'
            }).then( (response) => {
                if(response.data.result == 0) {
                    this.g_all_class_list = response.data.data.class_list;
                } else {
                    this.$notify({
                        title: '服务器出现错误！',
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
                g_all_class_list: [],
                dialogVisible: false,
                title: '',
                hw_class_id: [],
                dateStart: '',
                dateFinish: '',
                date_start: '',
                date_end: ''
            }
        },
        methods: {
            addWorkT: function() {
                if(this.title.length != 0 && this.hw_class_id.length != 0 &&
                        this.dateStart.length != 0 && this.dateFinish.length != 0){
                    this.$http({
                        method: 'POST',
                        url: '/api/teacher/homeworks/edit',
                        data: {
                            title: this.title,
                            class_ids: this.hw_class_id,
                            date_start: this.date_start,
                            date_end: this.date_end,
                        }
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
                    });
                    this.dialogVisible = false
                }
            },
            changeStart(value) {
                this.date_start = value
            },
            changeEnd(value) {
                this.date_end = value
            }
        }
    }
</script>

<style scoped>
    .workWrapper{
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
