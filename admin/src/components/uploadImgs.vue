<template>
    <div>
        <el-upload
                :class="(disabled || picList.length>=limit)?'disabled':''"
                :action="actionUrl"
                :limit="limit"
                :file-list="picList"
                :accept="acceptType"
                list-type="picture-card"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleFileRemove"
                :on-change="handleFileChange"
                :on-success="fileUploadSuccess"
                :on-exceed="handleExceed"
                :disabled="disabled">
            <i class="el-icon-plus"></i>
        </el-upload>
    </div>
</template>

<script>
    import Utils from '../utils/utils'
    export default {
        name: "uploadImgs",
        props: {
            acceptType: {
                type: String,
                default: '.jpg,.jpeg,.png'
            },
            maxSize: {
                type: Number,
                default: 20
            },
            imgList:{
                type:Array,
                default:function () {
                    return []
                }
            },
            disabled:{
                type:Boolean,
                default:false
            },
            limit: {
                type: Number,
                default: 3
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
            imgList: {
                handler: function(val, oldVal) {
                    if(val && val.length>0 && !this.hasClone){
                        this.hasClone = true
                        this.picList = Utils.deepClone(val,[])
                        //name和url必须有，用于展示图片
                        this.picList.forEach(item=>{
                            item.url = item.fileUrl
                            item.name = item.fileName
                        })
                    }
                },
                deep: true,
                immediate: true
            },
        },
        methods:{
            //文件上传成功
            fileUploadSuccess(res, file, fileList) {
                console.log(res)
                if (!res||res.code !== 200) {
                    if (res.type&&res.type === 'no_login') {
                        // localStorage.removeItem('aegeanUserInfo')
                        // top.location.href = top.location.href.split('/#/')[0] + '/#/login'
                        // 接口拦截，后端抛出错误信息
                    }else{
                        this.$message.error('上传失败，请重新上传');
                        fileList.splice(fileList.length-1,1);
                    }
                
                }
                this.$emit('uploadOver')
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 ${this.limit} 个文件`);
                return
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
            //删除图片
            handleFileRemove(file, fileList) {
                console.log(file,fileList)
                const vm = this
                // console.log('remove file =>', {...file});
                const temp = vm.picList.filter(item=>{
                    return item.url !=file.url
                })
                this.picList = temp
                this.$emit('getPicList',{picList:vm.picList})
            },
            //上传图片
            handleFileChange(file, fileList) {
                console.log(file,fileList)
                const vm = this
                if (file.status === 'success') {
                    vm.picList.push(Utils.formatViewFileVo(file))
                }
                this.$emit('getPicList',{picList:vm.picList})
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
    img{
        width: 100%;
        height: auto;
    }
</style>