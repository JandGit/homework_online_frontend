<template>
    <div class="wrapper">
        <div class="paper">
            <span>{{this.paper.title}}</span>
            <br><br>
            <!-- <span style="text-align: left; display: block; float: left">{{this.audiences}}</span> -->
            <span style="text-align: right; display: block;">{{this.paper.author}}</span>
            <br>
            <div class="topics">
              <!-- topic.answerValueT -->
              <!-- topic.answerExplain -->
                <topic v-for="(topic, index) in paper.questions"
                     v-on:listen="doing"
                    :key = "topic.ques_id"
                    :index = "index"
                    :id = "topic.ques_id"
                    :question = "topic.ques_content"
                    :type = "topic.ques_type"
                    :status = "topic.status"
                    :answer = "topic.answer"
                    :answerValueS = "topic.stu_answer"
                    answerValueT = " "
                    answerExplain = " "
                    >
                </topic>
                <br><br>
                <span v-if="this.paper.status === 'checked'" style="color: red;">批注：{{this.paper.comment}}</span>
                <br><br>
                <span v-if="this.paper.status === 'checked'" style="text-align: center; display: block; font-size: 50px; color: red; text-decoration: underline; font-weight: bold;">&nbsp;{{this.paper.score}}分&nbsp;</span>
            </div>
            <el-button class="submit" v-on:click="show = true" size="large" type="success" :disabled="this.disabled">提交作业</el-button>
            <el-dialog title="提示" v-model="show" size="small" top="30%">
                <span>确定提交作业吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button v-on:click="show = false">取 消</el-button>
                    <el-button type="success" v-on:click="submit()">确 定</el-button>
                </span>
            </el-dialog>
        </div>  
    </div>
</template>

<script>
import topic from "../../../components/topic";
export default {
  components: {
    topic
  },
  created: function() {
    var hwId
    if(this.$route.params.hw_id) {
      hwId = this.$route.params.hw_id
    }
    // var homeworkId = this.$ou;
    // if(this.$route.params.mark == -1) {
    //     url = '/api/student/workDoingS'
    // }
    // else if(this.$route.params.mark == 0 ) {
    //     url = '/api/student/workDoneS'
    // }
    // else if(this.$route.params.mark == 1) {
    //     url = '/api/student/workFinishS'
    // }
    this.$http({
      method: "POST",
      url: '/api/student/homework_detail',
      data: {
        'hw_id': hwId
      }
    }).then(response => {
        if(response.data.result === 0) {
            this.paper = response.data.data;
          if (this.paper.status == "checked") {
            this.disabled = true;
          }
        } else {
          this.$notify({
              title: '未知错误！',
              type: 'success',
              offset: 100
          })
          this.$router.replace("/");
      }
    });
  },
  data: function() {
    return {
      paper: {},
      mark: 1,
      disabled: false,
      show: false
    };
  },
  computed: {
    audiences: function() {
      if (this.paper.audiences) {
        var audiences = "";
        for (var i = 0; i < this.paper.audiences.length; i++) {
          audiences = audiences + " " + this.paper.audiences[i];
        }
        return audiences;
      }
    }
  },
  methods: {
    submit: function() {
      this.show = false;
      this.$http({
        method: "POST",
        url: "/api/student/commit_homework",
        // data: {
        //   // token: localStorage.token,
        //   workDoingS: this.paper
        // }
        data: this.paper
      }).then(response => {
        if (response.data.result == 0) {
          this.$notify({
            title: "提交作业成功！",
            type: "success",
            offset: 100
          });
          this.$router.back();
        } else {
          this.$notify({
            title: "未知错误！",
            type: "success",
            offset: 100
          });
        }
      });
    },
    doing: function(now, id) {
      this.paper.questions[id].stu_answer = now;
    }
  }
};
</script>

<style scoped>
.paper {
  width: 800px;
  margin: 0 auto;
  position: relative;
  top: 50px;
}
.topics {
  text-align: left;
  border: 1px solid #d3dce6;
  padding: 50px;
}
.submit {
  margin: 30px;
  width: 200px;
  height: 50px;
}
</style>