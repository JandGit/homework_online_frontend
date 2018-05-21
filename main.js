import Vue from 'vue'
import axios from 'axios'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import './assets/reset.css'
import 'element-ui/lib/theme-default/index.css'

import App from './App'
import login from './views/login'

import indexS from './views/Student/indexS'
import noticeS from './views/Student/noticeS'
import workDoingS from './views/Student/workS/workDoingS'
import workDoneS from './views/Student/workS/workDoneS'
import workFinishS from './views/Student/workS/workFinishS'
import paperS from './views/Student/workS/paperS'
import passwordS from './views/Student/passwordS'

import indexT from './views/Teacher/indexT'
import noticeT from './views/Teacher/noticeT'
import addTopicT from './views/Teacher/topicT/addTopicT'
import queryTopicT from './views/Teacher/topicT/queryTopicT'
import addWorkT from './views/Teacher/workT/addWorkT'
import queryWorkT from './views/Teacher/workT/queryWorkT'
import workT from './views/Teacher/workT/workT'
import checkingWorkT from './views/Teacher/workT/checkingWorkT'
import checkedWorkT from './views/Teacher/workT/checkedWorkT'
import passwordT from './views/Teacher/passwordT'

import index from './views/Admin/index'
import teacher_mgr from './views/Admin/teacher_mgr'
import student_mgr from './views/Admin/student_mgr'
import class_mgr from './views/Admin/class_mgr'
import password from './views/Admin/password'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.prototype.$http = axios;
Vue.prototype.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$http.defaults.baseURL = 'http://120.78.91.156/';

// Vue.prototype.$http.defaults.withCredentials = true

Vue.config.productionTip = false;


const router = new VueRouter({
    // mode: 'history',
    routes: [
        {path: '/', component: login},
        {
            path: '/Student', component: indexS,
            children: [
                {path: 'noticeS', component: noticeS},
                {path: 'workDoingS', component: workDoingS},
                {path: 'workDoneS', component: workDoneS},
                {path: 'workFinishS', component: workFinishS},
                {path: 'paperS', component: paperS, name: 'paperS'},
                {path: 'passwordS', component: passwordS}
            ]
        },
        {
            path: '/Teacher', component: indexT,
            children: [
                {path: 'noticeT', component: noticeT},
                {path: 'addTopicT', component: addTopicT},
                {path: 'queryTopicT', component: queryTopicT},
                {path: 'addWorkT', component: addWorkT},
                {path: 'queryWorkT', component: queryWorkT},
                {path: 'workT', component: workT, name: 'workT'},
                {path: 'checkingWorkT', component: checkingWorkT},
                {path: 'checkedWorkT', component: checkedWorkT},
                {path: 'passwordT', component: passwordT},
            ]
        },
        {
            path: '/Admin', component: index,
            children: [
                {path: 'teacher_mgr', component: teacher_mgr},
                {path: 'student_mgr', component: student_mgr},
                {path: 'class_mgr', component: class_mgr},
                {path: 'password', component: password}
            ]
        }
    ]
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});

