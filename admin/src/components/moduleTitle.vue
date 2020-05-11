<template>
  <div id="moduleTitle">
    <div class="module-title">
      <i class="bold-line"></i>
      <span class="title-text">
        {{title}}
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'moduleTitle',
    props: {
      title: String,//模块标题
      default:''
    },
    data() {
      return {
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../assets/css/vars";
  @import "../assets/css/common";

  .module-title {
    padding: 6px 0 6px 14px;
    margin-bottom: 10px;
    position: relative;
    text-align: left;
    line-height: 22px;
  }


  .bold-line {
    background-color: @theme-color;
    position: absolute;
    top: 9px;
    left: 0;
    width: 4px;
    height: 17px;
    border-radius: 20px;
    vertical-align: bottom;
    margin-right: 4px;
  }

  .title-text {
    font-size: 16px;
    font-weight: 600;
    color: @aux-color;
  }

  
</style>
