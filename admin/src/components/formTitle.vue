<template>
  <div class="title"><span></span>{{desc}}</div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
  computed: {
      desc(){
          return  this.text
      }
  },
  props: {
    text: {
      type: String,
      default: "标题"
    }
  }
};
</script>
<style scoped lang='less'>
.title {
  font-weight: 700;
  position: relative;
  font-size: 18px;
  margin-bottom: 10px;
  padding-left: 15px;
  line-height: 18px;
}
.title span {
  position: absolute;
  height: 18px;
  top: -1px;
  left: 0;
  width: 4px;
  border-radius: 2px ;
  background-color: #5ccdba;
}
</style>