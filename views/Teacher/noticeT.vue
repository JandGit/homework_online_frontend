<template>
    <div class="wrapper">
          <el-table class="table" :data="notices" border>         
              <el-table-column label="日期" prop="date"></el-table-column>
              <el-table-column label="标题" prop="title"></el-table-column>
              <el-table-column label="发布人" prop="author"></el-table-column>
              <el-table-column label="操作">
                  <template scope="scope">
                      <el-button size="small" type="success" v-on:click="alterNoticeT(scope.$index, scope.row)">编辑</el-button>
                      <el-button size="small" type="danger" v-on:click="deleteNoticeT(scope.$index, scope.row)">删除</el-button>
                  </template>
              </el-table-column>
              <el-table-column type="expand">
                <template scope="props">
                        <el-form>
                            <el-form-item label="内容：">
                                <span>{{ props.row.content }}</span>
                            </el-form-item>
                        </el-form>
                </template>
              </el-table-column>            
          </el-table>
          <el-dialog title="增加公告" v-model="dialogVisible">
              <el-form :model="notice">
                  <el-form-item label="面向班级：" label-width="100px">
                       <el-select v-model="notice.class_list" multiple placeholder="请选择班级" size="large" >
                           <el-option
                                v-for="item in this.g_all_class" :label="item.class_name" :value="item.class_id" :key="item.class_id">
                           </el-option>
                       </el-select>
                  </el-form-item>
                  <el-form-item label="公告标题：" label-width="100px">
                      <el-input v-model="notice.title" :maxlength=30></el-input>
                  </el-form-item>               
                  <el-form-item label="公告内容：" label-width="100px">
                      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="notice.content" :maxlength=100></el-input>
                  </el-form-item>
                  <div class="dialog-footer">
                      <el-button v-on:click="dialogVisible=false">取消</el-button>
                      <el-button type="success" v-on:click="addNoticeT()">确定</el-button>
                  </div>
              </el-form>
          </el-dialog>
          <el-button class="button" type="success" size="large" icon="plus" v-on:click="dialogVisible=true"></el-button>
    </div>
</template>

<script>
    export default{
        created: function() {
            this.$http({
                method: 'get',
                url: '/api/teacher/get_notices'
            }).then( response => {
                if(response.data.result == 0) {
                    this.notices = response.data.data.notices;
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
            });
            this.$http({
                method: 'get',
                url: '/api/teacher/teach_class'
            }).then( response => {
                if(response.data.result == 0) {
                    this.g_all_class = response.data.data.class_list;
                } else if (response.data.result == this.ERRCODE_RELOGIN) {
                    this.$message("登录信息过期，请重新登录");
                    this.$router.replace("/");
                } else {
                    this.$message({
                        message: '未知错误！',
                        type: 'warn',
                        offset: 100
                    })
                }         
            })
        },
        data: function() {
            return {
                notices: [],
                notice: {
                    class_list: [],
                    title: '',
                    content: ''                
                },
                g_all_class: [],
                userName: '',
                className: [],
                dialogVisible: false,
                ERRCODE_RELOGIN: 1
            }
        },
        computed: {
            currentDate: function () {
                var currentDate = new Date()
                var month = currentDate.getMonth() + 1
                var day = currentDate.getDate()
                if(month<10){
                    month = String('0'+month)
                }
                if(day<10){
                    day = String('0'+day)
                }
                return currentDate.getFullYear() + '-' + month +'-' + day
            }
        },
        methods:{
            alterNoticeT: function(index,row) {
                this.$prompt('请输入要修改的内容','提示',{
                    inputValue: row.content,
                }).then(({value}) => {
                    this.$http({
                        method: 'POST',
                        url: '/api/teacher/alterNoticeT',
                        headers: {
                            'Authorization': 'Bearer '+ localStorage.token
                        },
                        body: {
                            "id": row.id,
                            "content": value
                        }
                    }).then( response => {
                        if(response.data.errno == 200) {
                            row.content = value;
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
                        message: '取消输入！'
                    })
                })
            },
            deleteNoticeT: function(index,row) {
                this.$confirm('此操作将永久删除该公告，是否继续？','提示',{
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        method: 'POST',
                        url: '/api/teacher/del_notice',
                        data: {
                            "notice_id": row.notice_id
                        }
                    }).then( response => {
                        if(response.data.result == 0){
                            this.notices.splice(index,1)
                        } else if (response.data.result == this.ERRCODE_RELOGIN) {
                            this.$message("登录信息过期，请重新登录");
                            this.$router.replace("/");
                        } else {
                            this.$message({
                                message: '未知错误！',
                                type: 'warn',
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
            addNoticeT: function() {
                if(this.notice.title != '' && this.notice.audiences != '' &&　this.notice.content != ''){
                    this.$http({
                    method: 'POST',
                    url: '/api/teacher/add_notice',
                    data: {
                        title: this.notice.title,
                        class_list: this.notice.class_list,
                        content: this.notice.content        
                    }
                }).then(response => {
                    if(response.data.result == 0) {
                        this.dialogVisible = false;
                        this.$router.replace("/Teacher/noticeT");
                        this.$message({
                            message: '发布公告成功',
                            type: 'success'
                        })
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
                }
                else {
                    this.$notify({
                        title: '请填写内容！',
                        type: 'warning',
                        offset: 100
                    })
                }                   
            }
        }
    }
</script>

<style scoped>
    .table{
        width: 70%;
        margin: 0 auto;
        text-align: left;
        position: relative;
        top: 100px;
    }
    .button{
        position: fixed;
        bottom: 50px;
        right: 50px;
        width: 80px;
        height: 80px;
        border-radius: 100%;
    }
    .dialog-footer{
        text-align: right;
    }
</style>

