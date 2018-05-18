<template>
  <div class="wrapper">
    <el-input class="searchInput" placeholder="请输入要搜索的任意关键字" icon="search"
              v-model="searchTeacher" :focus="watchEnter()"
              v-on:click="search()"></el-input>
    <el-table class="table" :data="queryTeachers" border>
      <el-table-column label="教师编号" width="180" prop="t_id"></el-table-column>
      <el-table-column label="教师姓名" width="180" prop="t_name"></el-table-column>
      <el-table-column label="管理班级" width="200" prop="class_name_list"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" type="success" v-on:click="openAlter(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" v-on:click="deleteTeacher(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="增加老师" v-model="dialogVisible">
      <el-form :model="new_teacher">
        <el-form-item label="教师编号：" label-width="100px">
          <el-input v-model="new_teacher.t_id" :maxlength=30></el-input>
        </el-form-item>
        <el-form-item label="教师姓名：" label-width="100px">
          <el-input v-model="new_teacher.t_name" :maxlength=30></el-input>
        </el-form-item>
        <el-form-item label="面向班级：" label-width="100px">
          <el-select v-model="new_teacher.class_list" multiple placeholder="请选择班级" size="large">
            <el-option v-for="item in all_class_list" :label="item.class_name" :value="item.class_id" :key="item.class_id">
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
          <el-input v-model="alterTeacher.t_id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="教师姓名：" label-width="100px">
          <el-input v-model="alterTeacher.t_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="面向班级：" label-width="100px">
          <el-select v-model="alterTeacher.class_list" multiple placeholder="请选择班级" size="large">
            <el-option v-for="item in all_class_list" :label="item.class_name" :value="item.class_id" :key="item.class_id">
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

        //将后台传来的class_list进一步解析，方便vue组件绑定数据
        for (var out_i = 0; out_i < this.teachers.length; out_i++) {
          var a_teacher = this.teachers[out_i];
          a_teacher.class_name_list = "";
          for (var in_i = 0; in_i < a_teacher.class_list.length; in_i++) {
            a_teacher.class_name_list += a_teacher.class_list[in_i].class_name;
            a_teacher.class_name_list += "; "
          }
        }

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
        this.all_class_list =  response.data.data.class_list;
        this.all_class_map.clear();
        for (var i = 0; i < this.all_class_list.length; i++) {
          var class_id = this.all_class_list[i].class_id;
          var class_name = this.all_class_list[i].class_name;
          this.all_class_map.set(class_id, class_name);
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
      new_teacher: {
        t_id: "",
        t_name: "",
        class_list: []
      },
      alterTeacher: {
        t_id: "",
        t_name: "",
        class_list: []
      },
      alterRow: {},
      dialogVisible: false,
      all_class_list: [],
      all_class_map: new Map(),
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
        method: 'post',
        url: '/api/admin/teacher_list',
        data: {
          search: this.searchTeacher
        }
      }).then((response) => {
        if (response.data.result == 0) {
          this.teachers = response.data.data.teachers;

          //将后台传来的class_list进一步解析，方便vue组件绑定数据
          for (var out_i = 0; out_i < this.teachers.length; out_i++) {
            var a_teacher = this.teachers[out_i];
            a_teacher.class_name_list = "";
            for (var in_i = 0; in_i < a_teacher.class_list.length; in_i++) {
              a_teacher.class_name_list += a_teacher.class_list[in_i].class_name;
              a_teacher.class_name_list += "; "
            }
          }

          this.queryTeachers = this.teachers.slice(0, this.pageSize);
        } else {
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
      this.alterTeacher.t_id = row.t_id;
      this.alterTeacher.t_name = row.t_name;
      this.alterTeacher.class_list = row.class_list;
      this.alterRow = row;
    },
    alterTeacherA: function () {
      if (this.alterTeacher.t_id.length > 0 &&
          this.alterTeacher.t_name.length > 0 &&
          this.alterTeacher.class_list.length > 0) {

        var new_class_ids = this.alterTeacher.class_list;
        this.alterTeacher.class_name_list = "";
        for (var i = 0; i < this.alterTeacher.class_list.length; i++) {
          this.alterTeacher.class_name_list +=
            this.all_class_map.get(this.alterTeacher.class_list[i])
        }
        this.alterTeacher.class_name_list = new_class_names;

        this.$http({
          method: 'post',
          url: '/api/admin/modify_teacher',
          data: {
            "old_t_id": this.alterRow.t_id,
            "new_t_id": this.alterTeacher.t_id,
            "new_t_name": this.alterTeacher.t_name,
            "new_class_list": new_class_ids
          }
        }).then((response) => {
          if (response.data.result == 0) {
            this.alterRow.t_id = this.alterTeacher.t_id;
            this.alterRow.t_name = this.alterTeacher.t_name;
            this.alterRow.class_list = this.alterTeacher.class_list;
            this.alterRow.class_name_list = this.alterTeacher.class_name_list;
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
          method: 'post',
          url: '/api/admin/del_teacher',
          data: {
            "t_id": row.t_id
          }
        }).then((response) => {
          if (response.data.result == 0) {
            this.teachers.splice(index, 1);
            this.queryTeachers.splice(index, 1)
          } else {
            this.$notify({
              title: '未知错误！',
              type: 'success',
              offset: 100
            })
          }
        })
      })
    },
    addTeacher: function () {
      if (this.new_teacher.t_name.length > 0 &&
            this.new_teacher.class_list.length > 0) {
        var new_class_ids = [];
        var new_class_names = [];
        for (var i = 0; i < this.new_teacher.class_list.length; i++) {
          new_class_ids[i] = this.new_teacher.class_list[i].class_id;
          new_class_names[i] = this.new_teacher.class_list[i].class_name;
        }
        this.new_teacher.class_name_list = new_class_names;

        this.$http({
          method: 'post',
          url: '/api/admin/add_teacher',
          data: {
            t_id: this.new_teacher.t_id,
            t_name: this.new_teacher.t_name,
            class_list: new_class_ids
          }
        }).then((response) => {
          if (response.data.result == 0) {
            this.dialogVisible = false;
            this.teachers.push(this.new_teacher);
            this.queryTeachers = this.teachers.slice(0, this.pageSize);
          } else {
            this.$notify({
              title: '未知错误！',
              type: 'success',
              offset: 100
            })
          }
        })
      } else {
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
