<template>
    <div class="header">
        <!-- icon -->
        <div class="logo">
            <img class="logoImg" src="../assets/css/img/ions.png">
        </div>

        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        
        <div class="header-right">
            <div class="header-user-con">
                <!-- 商场选择 -->
                <demoSelect v-if="mallCode" class="selectShop" :options='selectList' :value='mallCode' placeholder='请选择商场' @input="getValue"/>
                <!-- 全屏显示 -->
                <!-- <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div> -->

                <!-- 系统消息 --><!-- <message-popover :type="black"></message-popover> -->
                <div class="systemc" @click="getSystemMsg">
                    <img src="../assets/css/img/message.png">
                    <span>系统消息</span>
                    <div class="haveMsg" v-show="hasMsgFlag"> </div>
                </div>
                
                <!-- 用户头像 -->
                <div class="user-avator">
                    <!-- <img src="../../assets/img/img.jpg" /> -->
                </div>

                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="changePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <el-drawer 
            :close-on-click-modal="false" 
            :visible.sync="infoVisible" 
            :title="systemTitle" 
            class="drawerwidth"
            >
            <!-- 123
            <li v-for></li> -->
            <ul class="popover-ul systemMsgUl">
                <!-- 
                "messageType":0,
                "messageContent":"普通消息days",
                "messageArgs":"days=90天&args2=000",
                "messageStatus":0,
                cont1,
                cont2
                -->
                <li class="sysmsgNum parl">系统消息：<span>({{ newSystemInfo }})</span></li>
                <li v-show="systemMsgiszero" class="noSystemMsg parl">暂无消息！</li>

                <li v-for="(item, i) in systemMsg" :key="i" class="popover-li parl">
                    <!-- 0-未读  1-已读 -->
                    <p v-if="item.messageType == '1'">
                        <span class="unRead" v-if="item.messageStatus == '0'"> </span>
                        <span class="read" v-else> </span>
                        {{ item.cont1 }}
                        <span class="marked">{{ item.messageArgs }}</span>
                        {{ item.cont2 }}
                        <br>
                        <a @click.stop="xfsj" class="renewal">续费/升级</a>
                    </p>
                    <p v-else-if="item.messageType == '3' || item.messageType == '2'">
                        <span class="unRead" v-if="item.messageStatus == '0'"> </span>
                        <span class="read" v-else> </span>
                        {{ item.messageContent }}
                        <br>
                        <a @click.stop="wsxx" class="renewal">完善信息</a>
                    </p>
                    <!-- 
                        0-普通消息
                        1-版本时间提醒
                        2-审核消息
                        3-完善信息
                    -->
                    <p v-else>
                        <span class="unRead" v-if="item.messageStatus == '0'"> </span>
                        <span class="read" v-else> </span>
                        {{ item.messageContent }}
                    </p>
                </li>
            </ul>
            <span class="systemBom" v-if="serverDecs == '专业版'">
                <p>您的系统版本为{{serverDecs}}（免费100天）
                    <a @click.stop="xfsj" class="renewal knowMore">联系客服<i class="el-icon-arrow-right"></i></a>
                </p>
                <p>有效期为{{veBeginDateDecs}} - {{veEndDateDecs}}</p>
            </span>
            <span class="systemBom" v-else>
                <p>您的系统版本为标准版
                    <a @click.stop="xfsj" class="renewal knowMore">联系客服<i class="el-icon-arrow-right"></i></a>
                </p>
                <br>
            </span>
        </el-drawer>
        

        <el-dialog title="修改密码" :visible.sync="dialogTableVisible" width="600px" 
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            >
            <el-form :model="passwordInfo" isDeleted-icon label-width="120px" class="demo-ruleForm">
                <el-form-item label="旧密码：" prop="oldPassword" class="" :rules="[
                            { required: true, message: '请输入旧密码', trigger: 'blur' },
                            { max:30, message: '最大长度为30', trigger: 'blur' },
                        ]"
                >
                    <el-input type="text" v-model="passwordInfo.oldPassword" autocomplete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="新密码：" prop="newPassword" class="" :rules="[
                            { required: true, message: '请输入新密码', trigger: 'blur' },
                            { max:30, message: '最大长度为30', trigger: 'blur' },
                        ]"
                >
                    <el-input type="text" v-model="passwordInfo.newPassword" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = !dialogTableVisible">取 消</el-button>
                <el-button type="primary" @click="changePassword">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="温馨提示" :visible.sync="wxtsDialog" width="360px" 
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            >
            <p class="wxtsDialogp">您还没有访问权限，请与管理员联系</p>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogTableVisible = !dialogTableVisible">取 消</el-button> -->
                <el-button type="primary" @click="wxtsDialog = !wxtsDialog">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 请与管理员联系 -->
        <el-dialog title="温馨提示" :visible.sync="wxtsDialog" width="360px" 
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            >
            <p class="wxtsDialogp">您还没有访问权限，请与管理员联系</p>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogTableVisible = !dialogTableVisible">取 消</el-button> -->
                <el-button type="primary" @click="wxtsDialog = !wxtsDialog">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 我们会在1-3个工作日内与您联系，是否继续提交需求？ -->
        <el-dialog title="温馨提示" :visible.sync="dialogone" width="460px" 
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            >
            <p class="wxtsDialogp">我们会在1-3个工作日内与您联系，</p>
            <p class="wxtsDialogp">是否继续提交需求？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogone = !dialogone">取 消</el-button>
                <el-button type="primary" @click="getstatusDialog">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 申请成功，我们会在1-3个工作日内与您联系 -->
        <el-dialog title="申请成功" :visible.sync="dialogtwo" width="460px" 
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            >
            <p class="wxtsDialogp">申请成功，我们会在1-3个工作日内与您联系</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogtwo = !dialogtwo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 已经需要授权对接的状态，再点击，就弹3 -->
        <el-dialog title="温馨提示" :visible.sync="dialogthree" width="460px" 
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            >
            <p class="wxtsDialogp">我们会在1-3个工作日内与您联系，</p>
            <p class="wxtsDialogp">请保持电话畅通，谢谢！</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogthree = !dialogthree">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import bus from "@/utils/bus";
import messagePopover from "@/components/messagePopover";
import HTTP from '@/api/api'
import utils from '@/utils/utils'
import Secret from '@/utils/secret'
export default {
    components: { messagePopover },
    data() {
        return {
            newSystemInfo: 0,
            preSaleStatus: false,
            dialogone: false,
            dialogtwo: false,
            dialogthree: false,
            wxtsDialog: false,//温馨提示
            veBeginDateDecs: '',
            veEndDateDecs: '',
            serverDecs: '',
            indexUrl:'',//跳转官网的地址
            // 系统消息
            infoVisible: false,
            systemTitle: "个人中心",
            systemMsgiszero:false,

            collapse: false,
            fullscreen: false,
            name: 'systemAdmin',
            message: 2,// 消息中心
            selectList: [],// 商场下拉列表
            dialogTableVisible: false,
            passwordInfo: {
                newPassword: "",
                oldPassword: "",
            },
            // black: "black",
            // 系统消息
            message1: {},
            message2: {},
            message3: {},
            message4: {},
            num: 0,//系统消息数
            hasMsgFlag:false,//消息提示-红点
            systemMsg: [
                // {
                // "messageType":0,
                // "messageContent":"",
                // "messageArgs":"",
                // "messageStatus":0,
                // "cont1":'',
                // "cont2":'',
                // }
            ],//消息
            systemMsgNum: 0,//消息条数
            mallCode:'',//商场code
            // changePasswordFrom: {},
            passwordInfo:{},
            isLowVersion: utils.getLocalStorage("isLowVersion", false),
            // sasaDialogVisible: {visible:false},
        };
    },
    computed: {
        username() {
            let username = localStorage.getItem('nickName');
            return username ? username : this.name;
        }
    },
    methods: {
        // 判断用户是否联系过---
        queryststussaas() {
            HTTP.saasgetGroupCompanyMall().then(res=>{
                if(res && res.data.code ==200 && res.data.data){
                    // console.log(res.data.data);
                    // preSaleStatus为true，代表已经发起过了，
                    this.preSaleStatus = res.data.data.preSaleStatus
                }
            }).catch({})
        },
        // 续费升级/联系客服的   申请---
        getstatusDialog (){
            HTTP.saasgroupCompanypreSale().then(res=>{
                // console.log(res);
                if(res && res.data.code ==200){
                    this.dialogtwo = true
                    this.dialogone = false
                }
            }).catch({})
        },
        // 续费升级 / 联系客服
        xfsj(){
            HTTP.saasgetGroupCompanyMall().then(res=>{
                if(res && res.data.code ==200 && res.data.data){
                    // console.log(res.data.data);
                    // preSaleStatus为true，代表已经发起过了，
                    this.preSaleStatus = res.data.data.preSaleStatus
                    if(this.preSaleStatus){
                        this.dialogthree = true
                    }else{
                        this.dialogone = true
                    }
                }
            }).catch({})
            // preSaleStatus为true，代表已经发起过了，
            // if(this.preSaleStatus){
            //     this.dialogthree = true
            // }else{
            //     this.dialogone = true
            // }
        },
        // 完善信息
        wsxx(){
            let userSource = localStorage.getItem("userSource")
            // userSource = 2
            if(userSource == 1){//管理员
                window.open(this.indexUrl)
            }else{//非管理员
                this.wxtsDialog = true
            }
        },
        getValue (val) {},
        // 修改密码
        changePassword() {
            if(this.passwordInfo.newPassword == '' || this.passwordInfo.oldPassword == ''){
                this.$message({ message: '请完善信息', type: 'warning'})
                return false
            }
            let params = {}
            params.newPassword = Secret.Encrypt(this.passwordInfo.newPassword)
            params.oldPassword = Secret.Encrypt(this.passwordInfo.oldPassword)
            HTTP.saasUpdatePassword(params).then(res=>{
                if(res && res.data.code == 200){
                    this.$message({ message: '修改成功', type: 'success'})
                    this.dialogTableVisible = false
                    this.$router.push("/login");
                }
            })
        },
        // 获取消息
        getMsg(){
            HTTP.systemCountUnReadMessage().then(res=>{
                if(res.data.code == 200){
                    this.num = res.data.data
                    console.log(`系统消息=数： ... ${res.data.data}`);
                    // 显示红点
                    if(res.data.data > 0){
                        this.hasMsgFlag = true
                        this.getSystemMsg()
                    }
                }
            })
        },
        getSystemMsg(){
            this.hasMsgFlag = false
            const params = {
                pageNum: 1,
                pageSize: 200,
            }
            let arr = []
            HTTP.systemQuerySystemMessage(params).then(res=>{
                if(res.data.code == 200 && res.data.data.records && res.data.data.records.length>0){
                    arr = res.data.data.records

                    this.systemMsgNum = res.data.data.records.length
                    for (let i = 0; i < arr.length; i++) {
                        if(arr[i].messageType == 1){
                            // 到期剩余天数<要高亮>
                            arr[i].messageArgs = arr[i].messageArgs.split('=')[1]//"days=90天"
                            let contArr = arr[i].messageContent.split('days')//把cont切2段，cont1 + arr[i].messageArgs + cont2
                            arr[i].cont1 = contArr[0]
                            arr[i].cont2 = contArr[1]
                            // 有到期提醒时，显示到期模块
                            // utils.setLocalStorage('duoToDate', arr[i].messageArgs)//把到期日期存在
                        }
                    }
                    // arr = []
                    // console.log("arr ---? system --->",arr);
                    if(arr.length && arr.length>0){
                        this.systemMsg = arr
                        this.systemMsgiszero = false
                    }else{
                        this.systemMsgiszero = true
                    }
                }else{
                    this.systemMsgiszero = true
                }
            })
            this.infoVisible = true
        },
        // 用户名下拉菜单选择事件
        async handleCommand(command) {
            if (command == 'loginout') {
                localStorage.removeItem('ms_username');
                await HTTP.saasLoginout().then(res=>{
                    // console.log(99,res);
                })
                utils.setLocalStorage("ESESSIONID", '')
                this.$router.push('/login')
            } 
            if(command == 'changePassword') {
                // if(this.isLowVersion == "false"){
                //     this.sasaDialogVisible.visible = true
                // } else {
                    this.dialogTableVisible = true
                // }
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        //时间戳转换
        formatToTime(timestamp) {
            if (timestamp) {
                const date = new Date(Number(timestamp)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                const Y = date.getFullYear() + '年';
                const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
                const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + '日';
                const h = date.getHours() + ':';
                const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':';
                const s = date.getSeconds();
                return Y + M + D;
            } else {
                return
            }
        },
    },
    created() {
        // 官网--完善信息
        console.log("header --- ", window.location.href);
        let baseUrl = window.location.href
        let token = localStorage.getItem("ESESSIONID")
        if(token && token!=''){
            if(baseUrl.indexOf('localhost:') > -1){
                this.indexUrl = `http://aimallsaas.dev.rscloud.com/perfect.html?token=${token}`
            }else if (baseUrl.indexOf('dev') > -1) {
                this.indexUrl = `http://aimallsaas.dev.rscloud.com/perfect.html?token=${token}`
            }else if (baseUrl.indexOf('uat1') > -1) {
                this.indexUrl = `http://aimallsaas.uat1.rscloud.com/perfect.html?token=${token}`
            } else if (baseUrl.indexOf('stag') > -1) {
                this.indexUrl = `https://saas-stag.aimall.cloud/perfect.html?token=${token}`// stg
            } else {
                this.indexUrl = `https://saas.aimall.cloud/perfect.html?token=${token}`// prd
            }
        }
        
        HTTP.systemQuerySystemMessage({
            pageNum: 1,
            pageSize: 200,
        }).then(res=>{
            if(res && res.data && res.data.code == 200 && res.data.data.records && res.data.data.records.length>0){
                let num=0
                for(let i=0;i<res.data.data.records.length;i++){
                    let item = res.data.data.records[i]
                    if(item.messageStatus == '0'){
                        this.hasMsgFlag = true
                        num++
                    }
                }
                this.newSystemInfo = num
            }
        })


        // if (document.body.clientWidth < 1500) {
        //     this.collapseChage();
        // }
        // 获取当前商场
        // this.selectList = utils.getSession('mallList', true)
        this.mallCode = utils.getLocalStorage("mallCode", false);
        HTTP.saasGetUserInfo().then(res=>{
            if (res.data.code === 200){
                this.selectList = res.data.data.mallList
                utils.setSession('serverType',res.data.data.groupCompany.serverType)
                utils.setLocalStorage('mallList',this.selectList)
                utils.setLocalStorage('userId',res.data.data.uniqueUserId)

                console.log(res.data.data.groupCompany);
            }
        })


        let serverDecs = sessionStorage.getItem('serverType')
        // 1 是标准版；2是专业版
        if(serverDecs == '1'){
            this.serverDecs = '标准版'
        }else if(serverDecs == '2'){
            this.serverDecs = '专业版'
        }

        let vstime = sessionStorage.getItem('versionStartTime')
        let vetime = sessionStorage.getItem("expirationTime")
        // sessionStorage.setItem('expirationTime',res.data.data.groupCompany.expirationTime)


        this.veBeginDateDecs = this.formatToTime(vstime)
        this.veEndDateDecs = this.formatToTime(vetime)

        this.queryststussaas()
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    /* color: #fff; */
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
    height: 70px;
    display: inline-block;
    font-size: 19px;
    margin-right: 15px;
}
.logo img{
    width: 240px;
    margin-top: 14px;
    margin-left: 20px;
}
.header .selectShop {
    float: right;
    width: 202px;
    line-height: 70px;
    margin-right: 50px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 50px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    font-size: 15px;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}


/* 系统消息 */
.sysMsg{
    position: relative;
    display: inline-block;
    height: 70px;
    line-height: 70px;
    font-size: 15px;
    /* width: 0 !important; */

}
.el-popover__reference{
    width: 100% !important;
    padding: 0 !important;
}

.systemc{
    position: relative;
    font-size: 15px;
    height: 70px;
    line-height: 70px;
    font-family: sans-serif;
}
.systemc img{
    width: 12px;
    height: 16px;
    position: absolute;
    top: 26px;
    left: -17px;
}
/* .sysMsg img{
    width: 12px;
    height: 16px;
    position: absolute;
    top: 26px;
    left: -17px;
}
.sysMsg span{
    font-family: sans-serif;
} */
.haveMsg{
    width: 6px;
    height: 6px;
    background-color: #F75B55;
    position: absolute;
    top: 26px;
    left: -9px;
    border-radius: 6px;
}


.systemMsgUl{
    padding: 20px 0;
    /* padding: 5px 10px 10px 10px; */
    overflow-y: scroll;
    /* max-height: 600px; */
    position: relative;
    display: block;
    height: 100%;
    overflow: hidden;
}
.parl{
    padding-right: 20px;
    padding-left: 20px;
}
.helloAdmin{
    margin-bottom: 15px;
    padding-top: 8px;
}
.helloAdmin strong{
    display: inline-block;
    padding-bottom: 20px;
    width: 100%;
    font-size: 18px;
    font-weight: 520;
    border-bottom: 1px solid #d8d8d8;
}
.sysmsgNum{
    line-height: 30px;
    margin-bottom: 15px;
    font-size: 16px;
}
.sysmsgNum span{
    color: lightcoral;
}
.popover-li{
    margin-bottom: 20px;
    position: relative;
    margin-left: 24px;
    line-height: 30px;
    font-size: 15px;
    margin-left: 50px;
    padding-left: 0;
}
.popover-li .marked{
    color: #ff5f5f;
    font-size: 16px;
    font-weight: 700;
}
.popover-li .read{
    display: inline-block;
    width: 8px;height: 8px;
    background-color: rgb(148, 148, 148);
    position: absolute;
    top: 10px;
    left: -20px;
    border-radius: 6px;
}
.popover-li .unRead{
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #ff5f5f;
    position: absolute;
    top: 10px;
    left: -20px;
    border-radius: 6px;
}
.renewal{
    width: 100px;
    /* height: 22px; */
    font-size: 14px;
    /* line-height: 20px; */
    text-align: center;
    display: inline-block;
    background-color: #0091ff;
    padding: 3px 5px;
    border-radius: 2px;
    border: 1px solid #0091ff;
    color: #f0f0f0;
    margin:0;
    /* float: left; */
}
.systemBom{
    position:fixed;
    /* left: 0; */
    bottom: 0;
    right: 0;
    min-width: 700px!important;
    width: 40%!important;
    font-size: 14px;
    border-top: 1px solid #d8d8d8;
    padding-top: 20px;
    /* width: 100%; */
    /* padding-bottom: 5px; */
    background-color: #fff;
}
.systemBom p{
    line-height: 28px;
    padding-left: 20px;
}
.systemBom a{
    /* float: right; */
    /* position: absolute; */
}
.drawerwidth{

}
.drawerwidth /deep/.el-drawer.rtl{
    min-width: 700px!important;
    width: 40%!important;
    overflow: auto;
}
.drawerwidth /deep/.el-drawer__header{
    margin-bottom: 0 !important;
    padding-bottom: 20px;
    border-bottom: 1px solid #d8d8d8;
}
.knowMore{
    margin-right: 28px;
    float: right;
}
/* .drawerwidth /deep/.el-drawer__header{
    line-height: 60px !important;
    height: 60px !important;
}
.drawerwidth /deep/.el-drawer__header span{
    line-height: 60px !important;
    height: 60px !important;
} */
.drawerwidth /deep/.el-drawer__header span:focus{
	outline:0
}
.noSystemMsg{
    font-size: 18px;
    text-align: center;
    color: #c2c2c2;
    margin-top: 80px;
}
.wxtsDialogp{
    text-align: center;
    margin: 20px 0;
    font-size: 15px;
}
</style>
