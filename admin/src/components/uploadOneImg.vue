<template>
    <div>
        <el-upload
                :class="(disabled || picList.length>=1)?'disabled':''"
                :action="actionUrl"
                :accept="acceptType"
                list-type="picture-card"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-success="fileUploadSuccess"
                :disabled="disabled">
             <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
    import Utils from '../utils/utils'
    export default {
        name: "uploadOneImg",
        props: {
            acceptType: {
                type: String,
                default: '.jpg,.jpeg,.png'
            },
            maxSize: {
                type: Number,
                default: 20
            },
            disabled:{
                type:Boolean,
                default:false
            },
            imgUrl :{
                type: String,
                default:''
            }
        },
        data(){
            return {
                dialogVisible:false,
                actionUrl: '/api-aegean/zuul/investment/e/upload/publicAttach',
                picList:[],
                hasClone : false,

            }
        },
        watch:{
            imgUrl: {
                handler: function(val, oldVal) {
                   if(val){

                   }
                },
                deep: true,
                immediate: true
            },
        },
        methods:{
            //文件上传成功
            fileUploadSuccess(res, file, fileList) {
                console.log(res.code,res,file,fileList)
                // if (!res||res.code !== 200) {
                //     // if (res.type&&res.type === 'no_login') {
                //     //     // localStorage.removeItem('aegeanUserInfo')
                //     //     // top.location.href = top.location.href.split('/#/')[0] + '/#/login'
                //     //     // 接口拦截，后端抛出错误信息
                //     // }else{
                //     //     this.$message.error('上传失败，请重新上传');
                //     //     fileList.splice(fileList.length-1,1);
                //     // }
                
                // }
                if(res.code==200){
                    console.log('cur',file)
                    let tmp = {
                        fileUrl:res.data.fileUrl,
                        fileName:res.data.fileName,
                    }
                    this.imgUrl = res.data.fileUrl
                    this.$emit('getImg',{...tmp})
                }
            },
            //检查文件
            checkFile(file) {
                let allowTypes = this.acceptType.split(',');
                let arr = file.name.split('.');
                let type = '.' + arr[arr.length - 1].toLowerCase();
                const isType = allowTypes.indexOf(type) > -1;
                const isSize = file.size / 1024 / 1024 < this.maxSize;
                if (!isType) {
                    this.$message.error('上传文件格式有误');
                    return false
                }
                if (!isSize) {
                    this.$message.error(`上传文件不能超过${this.maxSize}MB`);
                    return false
                }
                return true;
            },
            beforeAvatarUpload(file) {
                return this.checkFile(file);
            },
        },
    }
</script>

<style lang="less" scoped>
.disabled {
    /deep/.el-upload--picture-card{
        display: none;
        }
    }

    .avatar {
         width: 100%;
        height: 100%;
    }
</style>