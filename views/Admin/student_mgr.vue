<template>
  <div class="wrapper">
  <el-input class="searchInput" placeholder="请输入要搜索的任意关键字" icon="search" v-model="searchStudent" :focus="watchEnter()"  v-on:click="search()"></el-input>
    <el-table class="table" :data="queryStudents" border>
        <el-table-column label="学生编号" width="180" prop="id"></el-table-column>
        <el-table-column label="学生姓名" width="180" prop="name"></el-table-column>
        <el-table-column label="管理班级" width="200" prop="class"></el-table-column>
        <el-table-column label="操作">
            <template scope="scope">
              <el-button size="small" type="success" v-on:click="openAlter(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="danger" v-on:click="deleteStudent(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>

      <el-dialog title="增加老师" v-model="dialogVisible">
      <el-form :model="student">
        <el-form-item label="学生编号：" label-width="100px">
          <el-input v-model="student.id" :maxlength=30></el-input>
        </el-form-item>       
        <el-form-item label="学生姓名：" label-width="100px">
          <el-input v-model="student.name" :maxlength=30></el-input>
        </el-form-item>               
        <el-form-item label="所在班级：" label-width="100px">
          <el-select v-model="student.class"  placeholder="请选择班级" size="large" >
            <el-option v-for="item in className" :label="item.label" :value="item.value" :key="item.id">
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
          <el-input v-model="alterStudent.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名：" label-width="100px">
          <el-input v-model="alterStudent.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所在班级：" label-width="100px">
         <el-select v-model="alterStudent.class"  placeholder="请选择班级" size="large" >
            <el-option v-for="item in className" :label="item.label" :value="item.value" :key="item.id">
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
    created: function() {
      this.$http({
              method: 'get',
              url: '/static/admin.json',
              // url: '/api/admin/operateStudentA',
              headers: {
                  'Authorization': 'Bearer '+ localStorage.token
              }
          }).then( response => {
              if(response.data.errno == 200) {
                  this.students = response.data.operateStudentA,
                  this.queryStudents = this.students.slice(0,this.pageSize);
              }
              else {
                  this.$notify({
                      title: '未知错误！',
                      type: 'success',
                      offset: 100
                  })
              }         
          }),
      this.$http({
                method: 'get',
                url: '/static/admin.json',
                // method: 'POST',
                // url: '/api/admin/classList',
                headers: {
                    'Authorization': 'Bearer '+ localStorage.token
                }
            }).then( (response) => {
                if(response.data.errno == 200) {
                    for(var i = 0; i < response.data.classList.length; i++ ) {
                        this.className.push({   
                            value: response.data.classList[i].class
                        })
                    }
                }
                else {
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
        students: [],
        queryStudents: [],
        student: {
          id: 0 ,
          name: "",
          class: ""
        },
        alterStudent:{
          id: 0,
          name: "",
          class: ""
        },
        alterRow: {},
        dialogVisible:false,
        className: [],
        dialogFormVisible: false,
        searchStudent: "",
        pageSize: 10
      }
    },
    computed: {
      total: function(){
        return this.students.length;
      }
    },
    methods: {
      watchEnter: function(){
        var self = this;
        window.addEventListener("keyup", function(e){
          if(e.keyCode == 13){
            self.search();
          }
        })
      },
      search: function(){
        this.$http({
          method: 'get',
          url: '/static/admin.json',
          // url: '/api/admin/queryStudentA',
          headers: {
            'Authorization': 'Bearer'+ localStorage.token
          },
          body: {
            searchValue: this.searchValue
          }
        }).then( (response) => {
          if(response.data.errno == 200){
            this.students = response.data.queryStudentA,
            this.queryStudents = this.students.slice(0,this.pageSize);
          }
          else{
            this.$notify({
              title: '未知错误！',
              type: 'success',
              offset: 100
            })
          }
        })
      },
      openAlter : function(index, row){
        this.dialogFormVisible = true;
        this.alterStudent.id = row.id;
        this.alterStudent.name = row.name;
        this.alterStudent.class = row.class;
        // for(var i=0;i<row.class.length;i++){
          // this.alterStudent.class[i] = row.class[i];
        // }
        this.alterRow = row;
      },
      alterStudentA: function(){
        if(this.alterStudent.name != "" &&  this.alterStudent.class != ""){
          this.$http({
            method: 'get',
            url: '/static/admin.json',
            // url: '/api/admin/alterStudentA',
            headers: {
                'Authorization': 'Bearer '+ localStorage.token
            },
            body: {
              "id": this.alterStudent.id,
              "name": this.alterStudent.name,
              "class": this.alterStudent.class
            }
          }).then( (response) => {
            if(response.data.errno == 200) {
              this.alterRow.id = this.alterStudent.id;
              this.alterRow.name = this.alterStudent.name;
              this.alterRow.class = this.alterStudent.class;
              this.dialogFormVisible = false;
            } 
            else {
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
      },
      deleteStudent : function(index, row) {
        this.$confirm('此操作将永久删除该学生，是否继续？','提示',{
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        method: 'get',
                        url: '/static/admin.json',
                        // url: '/api/admin/deleteStudentA',
                        headers: {
                             'Authorization': 'Bearer '+ localStorage.token
                        },
                        body: {
                            "name": row.name,
                            "class": row.class
                        }
                    }).then( (response) => {
                        if(response.data.errno == 200){
                            this.students.splice(index, 1),
                            this.queryStudents.splice(index, 1)
                        }
                        else {
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
      addStudent :function(){

             if(this.student.name != '' && this.student.class != ''){
                  this.$http({
                  method: 'get',
                  url: '/static/admin.json',
                  // url: '/api/admin/addStudentA',
                  headers: {
                           'Authorization': 'Bearer '+ localStorage.token
                  },
                  body: {
                    id: this.student.id, 
                    name: this.student.name,
                    class: this.student.class
                  }
              }).then( (response) => {
                  if(response.data.errno == 200) {
                      this.dialogVisible = false;
                      this.students.push(this.student);
                      this.queryStudents = this.students.slice(0,this.pageSize);
                  }
                  else {
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
      },
      handleCurrentChange: function(now){
          this.queryStudents = this.students.slice((now- 1)* this.pageSize, now* this.pageSize)
      }
    }
  }
</script>

<style scoped>
    .searchInput{
        width: 70%;
        margin: 0 auto 10px;
        position: relative;
        top: 100px;
        text-align: left;
    }
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
        .block{
        position: relative;
        top: 120px;
    }
</style>
