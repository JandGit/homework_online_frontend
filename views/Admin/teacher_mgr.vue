<template>
  <div class="wrapper">
    <el-input class="searchInput" placeholder="请输入要搜索的任意关键字" icon="search"
              v-model="searchTeacher" :focus="watchEnter()"
              v-on:click="search()"></el-input>
    <el-table class="table" :data="queryTeachers" border>
      <el-table-column label="教师编号" width="180" prop="t_id"></el-table-column>
      <el-table-column label="教师姓名" width="180" prop="t_name"></el-table-column>
      <el-table-column label="管理班级" width="200" prop="class_list"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" type="success" v-on:click="openAlter(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" v-on:click="deleteTeacher(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="增加老师" v-model="dialogVisible">
      <el-form :model="teacher">
        <el-form-item label="教师编号：" label-width="100px">
          <el-input v-model="teacher.id" :maxlength=30></el-input>
        </el-form-item>
        <el-form-item label="教师姓名：" label-width="100px">
          <el-input v-model="teacher.name" :maxlength=30></el-input>
        </el-form-item>
        <el-form-item label="面向班级：" label-width="100px">
          <el-select v-model="teacher.class" multiple placeholder="请选择班级" size="large">
            <el-option v-for="item in class_list" :label="item.class_name" :value="item.class_id" :key="item.class_id">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button v-on:click="dialogVisible=false">取消</el-button>
          <el-button type="success" v-on:click="addTeacher()">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-button class="button" type="success" size="large" icon="plus" v-on:click="dialogVisible=true"></el-button>
    <el-dialog title="修改教师信息" v-model="dialogFormVisible">
      <el-form :model="alterTeacher">
        <el-form-item label="教师编号：" label-width="100px">
          <el-input v-model="alterTeacher.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="教师姓名：" label-width="100px">
          <el-input v-model="alterTeacher.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="面向班级：" label-width="100px">
          <el-select v-model="alterTeacher.class" multiple placeholder="请选择班级" size="large">
            <el-option v-for="item in class_list" :label="item.class_name" :value="item.class_id" :key="item.class_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-on:click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" v-on:click="alterTeacherA()">确 定</el-button>
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
  created: function () {
    this.$http({
      method: 'post',
      url: '/api/admin/teacher_list',
      data: {
        search: ""
      }
    }).then(response => {
      if (response.data.result == 0) {
        this.teachers = response.data.data.teachers;
        this.queryTeachers = this.teachers.slice(0, this.pageSize);
      } else {
        this.$notify({title: '未知错误！', type: 'success', offset: 100})
      }
    });
    this.$http({
      method: 'get',
      url: '/api/admin/class_info'
    }).then((response) => {
      if(response.data.result == 0) {
        for(var i = 0; i < response.data.class_list.length; i++) {
          this.class_list.push({
            class_id: response.data.class_list[i].class_id,
            class_name: response.data.class_list[i].class_name
          })
        }
      } else {
        this.$notify({
          title: '获取数据错误！',
          type: 'success',
          offset: 100
        })
      }
    })
  },
  data: function () {
    return {
      teachers: [],
      queryTeachers: [],
      teacher: {
        id: 0,
        name: "",
        class: []
      },
      alterTeacher: {
        id: 0,
        name: "",
        class: [],
      },
      alterRow: {},
      dialogVisible: false,
      class_list: [],
      dialogFormVisible: false,
      searchTeacher: "",
      pageSize: 10
    }
  },
  computed: {
    total: function () {
      return this.teachers.length;
    }
  },
  methods: {
    watchEnter: function () {
      var self = this;
      window.addEventListener("keyup", function (e) {
        if (e.keyCode == 13) {
          self.search();
        }
      })
    },
    search: function () {
      this.$http({
        method: 'get',
        url: '/static/admin.json',
        // url: '/api/admin/queryTeacherA',
        headers: {
          'Authorization': 'Bearer' + localStorage.token
        },
        body: {
          searchValue: this.searchValue
        }
      }).then((response) => {
        if (response.data.errno == 200) {
          this.teachers = response.data.queryTeacherA,
            this.queryTeachers = this.teachers.slice(0, this.pageSize);
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
    openAlter: function (index, row) {
      this.dialogFormVisible = true;
      this.alterTeacher.id = row.id;
      this.alterTeacher.name = row.name;
      for (var i = 0; i < row.class.length; i++) {
        this.alterTeacher.class[i] = row.class[i];
      }
      this.alterRow = row;
    },
    alterTeacherA: function () {
      if (this.alterTeacher.name != "" && this.alterTeacher.class != "") {
        this.$http({
          method: 'get',
          url: '/static/admin.json',
          // url: '/api/admin/alterTeacherA',
          headers: {
            'Authorization': 'Bearer ' + localStorage.token
          },
          body: {
            "id": this.alterTeacher.id,
            "name": this.alterTeacher.name,
            "class": this.alterTeacher.class
          }
        }).then((response) => {
          if (response.data.errno == 200) {
            this.alterRow.id = this.alterTeacher.id;
            this.alterRow.name = this.alterTeacher.name;
            this.alterRow.class = this.alterTeacher.class;
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
    deleteTeacher: function (index, row) {
      this.$confirm('此操作将永久删除该教师，是否继续？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'get',
          url: '/static/admin.json',
          // url: '/api/admin/deleteTeacherA',
          headers: {
            'Authorization': 'Bearer ' + localStorage.token
          },
          body: {
            "name": row.name,
            "class": row.class
          }
        }).then((response) => {
          if (response.data.errno == 200) {
            this.teachers.splice(index, 1),
              this.queryTeachers.splice(index, 1)
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
    addTeacher: function () {
      if (this.teacher.name.length > 0 && this.teacher.class.length > 0) {
        this.$http({
          method: 'post',
          url: '/api/admin/add_teacher',
          data: {
            t_id: this.teacher.id,
            t_name: this.teacher.name,
            class_list: this.teacher.class
          }
        }).then((response) => {
          if (response.data.result == 0) {
            this.dialogVisible = false;
            this.teachers.push(this.teacher);
            this.queryTeachers = this.teachers.slice(0, this.pageSize);
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
    handleCurrentChange: function (now) {
      this.queryTeachers = this.teachers.slice((now - 1) * this.pageSize, now * this.pageSize)
    }
  }
}
</script>

<style scoped>
  .searchInput {
    width: 70%;
    margin: 0 auto 10px;
    position: relative;
    top: 100px;
    text-align: left;
  }

  .table {
    width: 70%;
    margin: 0 auto;
    text-align: left;
    position: relative;
    top: 100px;
  }

  .button {
    position: fixed;
    bottom: 50px;
    right: 50px;
    width: 80px;
    height: 80px;
    border-radius: 100%;
  }

  .dialog-footer {
    text-align: right;
  }

  .block {
    position: relative;
    top: 120px;
  }
</style>
