<template>
    <div class="breadCrumb">
        <el-breadcrumb separator="/">
            <!-- <el-breadcrumb-item :to="{ path: '/' }" >首页</el-breadcrumb-item> -->
            <el-breadcrumb-item  v-for="(item,idx) in breadList" :key="idx" v-show="$route.path!='/'" >{{item.title}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script>
import bus from "@/utils/bus";
export default {
  name: "breadCrumb",
  data() {
    return {
    }
  },
  methods: {
  },
  watch: {
    breadList(val){
      // console.log(val)
    },
    $route(val){
      if(val){
        if(val.path=='/exchangeRecord'){
          bus.$emit("changeIndex",["eCouponManage", "exchangeRecord"])
        }
      }
    }
  },
  computed: {
    routerArr() {
      return this.$route.path.substr(1).split("/");
    }
  },
  props: {
    options: {
    },
    breadList: {}
  },
  mounted() {
  },
};
</script>
<style lang="less" scoped>
  .breadCrumb {
    margin : 15px 0 15px 20px;
  }
</style>