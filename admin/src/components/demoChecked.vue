
<template>
  <div>
     <el-checkbox-group  v-model="searchData">
        <el-checkbox v-for="item in options" :key="item.value" :label="item.value" :value="item.value">{{item.value}}</el-checkbox>
     </el-checkbox-group>
  </div>
</template>
 
<script>
// import {xx} from "../../api/index";
export default {
  name: "demoChecked",
  data() {
    return {
      searchData: []
    };
  },
  methods: {
  },
  watch: {
    //判断选择的值是否有改变
    searchData(val, oldVal) {
      if (val != oldVal) {
        this.$emit("select", this.searchData);
      }
    }
  },
  props: {
    options: {},
    value: {}
  },
  mounted() {
    this.searchData = this.value;
  }
};
</script>