<template>
    <div class="wrapper">
        <el-table class="table" :data="workDoingSList" border>
            <el-table-column label="发布日期" prop="date_start"></el-table-column>
            <el-table-column label="截至日期" prop="date_end"></el-table-column>
            <el-table-column label="作业名称" prop="title"></el-table-column>
            <el-table-column label="发布人" prop="author"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="success" v-on:click="start(scope.$index, scope.row)">编辑作业</el-button>
                </template>           
            </el-table-column>
        </el-table>
    </div>
</template>
 
<script>
export default {
  created: function() {
    this.$http({
      method: "POST",
      url: "/api/student/homeworks",
      data: {
        homework_type: "unfinished"
      }
    }).then(response => {
      if (response.data.result === 0) {
        this.workDoingSList = response.data.data.homeworks;
      } else {
        this.$notify({
          title: "未知错误！",
          type: "success",
          offset: 100
        });
        this.$router.replace("/");
      }
    });
  },
  data: function() {
    return {
      workDoingSList: []
    };
  },
  methods: {
    start(index, row) {
      this.$router.push({
        name: "paperS",
        params: { hw_id: row.hw_id, mark: -1 }
      });
    }
  }
};
</script>

<style scoped>
.table {
  width: 70%;
  margin: 0 auto;
  position: relative;
  top: 100px;
  text-align: left;
}
</style>