<template>
    <div class="wrapper">
        <div class="passwordWrapper">
            <el-input  class="input" v-model="passwordOld"  :maxlength=16 type="password" placeholder="输入原密码" icon="more" size="large" style="margin-top: 150px;"></el-input>
            <el-input  class="input" v-model="passwordNew1" :maxlength=16 type="password" placeholder="输入新密码" icon="more" size="large"></el-input>
            <el-input  class="input" v-model="passwordNew2" :maxlength=16 type="password" placeholder="重新输入新密码" icon="more" size="large"></el-input>
            <br><br>
            <el-button class="button" size="large" type="success" v-on:click="alterPassword()">确定</el-button>
        </div>   
    </div>
</template>

<script>
    export default{
        data: function() {
            return {
                passwordOld : '',
                passwordNew1: '',
                passwordNew2: ''
            }
        },
        methods: {
            alterPassword: function() {
                if(this.passwordOld.length >= 6 && this.passwordNew1.length >= 6 && this.passwordNew1 == this.passwordNew2 ){
                    this.$http({
                        method: 'get',
                        url: '/static/admin.json',
                        // url: '/api/admin/alterPasswordA',
                        headers: {
                            'Authorization': 'Bearer '+ localStorage.token
                        },
                        body: {
                            passwordOld: this.passwordOld,
                            passwordNew1: this.passwordNew1,
                            passwordNew2: this.passwordNew2
                        }
                    }).then( response => {
                        if(response.data.errno == 200) {
                            this.$notify({
                                title: '修改密码成功！',
                                type: 'success',
                                offset: 100
                            })
                            this.$router.replace('/Admin')
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
                else if(this.passwordOld.lenth < 6 || this.passwordNew1.length < 6 || this.passwordNew2.length < 6) {
                    this.$notify({
                        title: '密码位数必须多于6位',
                        type: 'warning',
                        offset: 100
                    })
                }
                else if(this.passwordNew1 != this.passwordNew2) {
                    this.$notify({
                        title: '两次输入不一致',
                        type: 'warning',
                        offset: 100
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .passwordWrapper{
        width: 400px;
        height: 500px;
        background: #FFFFFF;
        border: 1px solid #D3DCE6;
        margin: 0 auto;
        position: relative;
        top: 100px;
    }
    .input{
        width: 300px;
        height: 50px;
    }
    .button{
        margin: 30px auto;
        width: 200px;
    }
</style>