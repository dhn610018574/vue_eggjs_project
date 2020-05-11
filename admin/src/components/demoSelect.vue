
<template>
  <div>
    <el-select v-model="svalue" :placeholder="text" filterable>
      <el-option v-for="(item,idx) in options" :key="idx" :label='item.mallName' :value="item.mallCode"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "demoSelect",
  data() {
    return {
      svalue: "",
      text: ""
    };
  },
  watch: {
    //判断下拉框的值是否有改变
    svalue(val, oldVal) {
      if (val != oldVal) {
        this.$emit("input", this.svalue);
      }
    }
  },
  props: {
    value: {
      type: String
    },
    placeholder: {
      type: String
    },
    options:{}
  },
  mounted() {
    //初始话下拉框的值
    this.svalue = this.value;
    this.text = this.placeholder;
  }
};
</script>