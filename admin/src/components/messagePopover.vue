<template>
    <div class="message_popover">
            <el-popover
                placement="bottom"
                trigger="hover">
                <ul class="popover-ul">
                    <li v-if="message1 != ''" class="popover-li" @click="toHome('specifiedMenu',message1.resourceId,'pending')">自助积分审核通知,您有（<span class="mes-num">{{message1.count}}</span>）条消息待审核。</li>
                    <li v-if="message2 != ''" class="popover-li" @click="toHome('specifiedMenu',message2.resourceId,'pending')">店铺内容审核通知,您有（<span class="mes-num">{{message2.count}}</span>）条消息待审核。</li>
                    <li v-if="message3 != ''" class="popover-li" @click="toHome('specifiedMenu',message3.resourceId,'pending')">店铺报修审核通知,您有（<span class="mes-num">{{message3.count}}</span>）条消息待审核。</li>
                    <li v-if="message4 != ''" class="popover-li" @click="toHome('specifiedMenu',message4.resourceId,'pending')">活动报名审核通知,您有（<span class="mes-num">{{message4.count}}</span>）条消息待审核。</li>
                </ul>
                <el-button class="popover-btn" slot="reference">
                    <span class="popover-icon" v-if="type == 'white'">
                        <span class="message-doct"></span>
                    </span>
                    <span class="popover-icon2" v-else>
                        <span class="message-doct"></span>
                    </span>
                </el-button>
            </el-popover>
            <span style="font-size: 15px;line-height: 70px;margin-left: -12px;">系统消息</span>
        </div>
    </div>
</template>
<script>
import Api from '../api/api'
import { type } from 'os';
export default {
    props:{
        type:String
    },
    data () {
        return {
            message1: {},
            message2: {},
            message3: {},
            message4: {},
        }
    },
    mounted(){
        this.getMessage();
    },
    methods:{
        //获取消息中心
        getMessage(){
            Api.getMessageInfo().then( res => {
                if(res.data.code == 200 ){
                    if(res.data.data){
                        this.message1 = res.data.data.integral ?  res.data.data.integral : '';
                        this.message2 = res.data.data.cmsContent ? res.data.data.cmsContent : '';
                        this.message3 = res.data.data.cmsRepair ? res.data.data.cmsRepair : '';
                        this.message4 = res.data.data.mmcApply ? res.data.data.mmcApply : '';
                    }else{
                        this.message1 = ''
                        this.message2 = ''
                        this.message3 = ''
                        this.message4 = ''
                    }
                }
            }).catch( err => {
                console.log(err)
            })
        },
         // 去首页
        toHome(type, id, status) {
            var data = {
                type: type, //group-组、menu-菜单
                id: id,
                status: status
            };
            localStorage.setItem("globalResourceInfo", JSON.stringify(data));

            if(this.type == 'white'){
                this.$router.push(`/home`);
            }else{
                this.$router.go(0)
            }
        }
    },
}
</script>
<style lang="less">
</style>
