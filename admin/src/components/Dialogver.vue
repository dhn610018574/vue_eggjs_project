<template>
     <div>
          <el-dialog :visible.sync="sasaDialogVisible.visible" width="40%" :modal="modal">
               <!-- <p class="lowVisp">您的版本过低，如需使用此功能，请免费升级至专业版，点击下方【免费试用】！</p>
               <span class="lowVis">
                    <p class="bd">专业版<span>（免费试用100天）</span></p>
                    <p class="gl">会员管理、营销活动管理、自动生成数据报表，节省人力成本，满足您的基础需求</p>
               </span>
               <p class="getUseing">
                    <a href="#" @click="go">免费试用</a>
               </p> -->
               <!-- <img v-if="serverType == '2'" src="../assets/css/img/low.png" alt="免费试用" @click="go" class="imgtos"> -->
               <img src="../assets/css/img/low2.png" alt="免费试用" @click="go" class="imgtos">
          </el-dialog>

          <!-- 请与管理员联系 -->
          <el-dialog title="温馨提示" :visible.sync="wxtsDialog" width="360px" :close-on-click-modal='false' :close-on-press-escape='false'>
               <p class="wxtsDialogp">您还没有访问权限，请与管理员联系</p>
               <span slot="footer" class="dialog-footer">
                    <!-- <el-button @click="dialogTableVisible = !dialogTableVisible">取 消</el-button> -->
                    <el-button type="primary" @click="wxtsDialog = !wxtsDialog">确 定</el-button>
               </span>
          </el-dialog>
     </div>
</template>
<script>
import utils from "@/utils/utils"
export default {
     props: {
          sasaDialogVisible:{
               type: Object,
               default: {
                    visible:false
               }
          },
          modal: {
          }
     },
     data() {
          return {
               indexUrl:'',
               serverType: '',
               wxtsDialog: false,
          };
     },
     created() {
          // 1 是标准版；2是专业版
          // this.serverType = sessionStorage.getItem('serverType')
          // this.serverType = 1
     },
     methods: {
          go(){
               // console.log(window.location.href);
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
               // console.log("Dialogver--- open");
               // window.open(this.indexUrl);
               let userSource = localStorage.getItem("userSource")
               if(userSource == 1){//管理员
                    window.open(this.indexUrl)
               }else{//非管理员
                    this.wxtsDialog = true
                    this.sasaDialogVisible.visible = false
               }
          }
     },
};
</script>
<style scoped>
.imgtos{
     width: 100%;
}
/* .el-dialog /deep/.el-dialog__body{
     background-color: #e2e2e2 !important;
}
.el-dialog__wrapper /deep/.el-dialog__header{
     text-align: center !important;
     background-color: bisque;
     width: 100%;
     height: 80px !important;
     font-weight: bold;
}
.el-dialog__wrapper /deep/.el-dialog__title{
     line-height: 40px;
} */
.lowVisp{
     /* display: block; */
     text-align: center;
     line-height: 50px;
     padding: 0 auto;
     font-size: 15px;
     margin-bottom: 20px;
}
.lowVis{
     /* background-color: bisque; */
     width: 400px;
     display: block;
     line-height: 60px;
     border: 1px solid #999;
     margin: 0 auto;
     background-color: #fff;
}
.lowVis p{
     line-height: 25px;
     text-align: center;
     /* margin-bottom: 10px; */
}
.bd{
     border-bottom: 1px solid #999;
}
/* .lowVis span{} */
.getUseing{
     margin-top: 60px;
     margin-bottom: 30px;
     text-align: center;
     /* display: inline-block; */
     /* margin: 0 auto; */
}
.getUseing a{
     background-color: #ea6060;
     padding: 12px 28px;
     font-size: 16px;
     border-radius: 4px;
     color: #fff;
}
</style>