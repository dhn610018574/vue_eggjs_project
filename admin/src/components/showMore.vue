<template>
  <div>
    <!-- <el-col :span="spans"> -->
        <div  @click="toggleShowMore" class="search-show-more">
                <span class="more">{{isShowMore?'收起':'展开更多'}}</span>
                <i class="icon-show-more el-icon-caret-bottom" :class="{ arrowRotate: isShowMore }"></i>
        </div>
    <!-- </el-col> -->
  </div>
</template>
<script>
export default {
  name: 'showMore',
  props:{
      isShowMore:{
          default:false,
          type:Boolean
      },
      spans :{
          default:3,
          type:Number
      }
 
  },

  methods :{
   toggleShowMore(){
       this.$emit('update:isShowMore',!this.isShowMore)
   }
  },
 
};
</script>
<style lang="less" scoped>
 @import "../assets/css/vars";
 @import "../assets/css/common";
 /** 搜索-展开更多 **/
.search-show-more {
  padding-left: 10px;
  cursor: pointer;
  color: @theme-color;
  line-height: 40px;
  .icon-show-more {
    transition: transform .3s;
  }
  span {
    display: inline-block;
    width: 100px;
    text-align: center;
    color: @theme-color;
    padding-right: 10px;
}
} 
</style>