<!--
 * @Author: your name
 * @Date: 2019-12-16 15:41:20
 * @LastEditTime: 2019-12-16 15:49:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \operation-h5\src\components\searchBtn.vue
 -->
<template>
  <el-row>
    <el-button type="primary" size="small" plain @click="reset" >重置</el-button>
    <el-button type="primary" size="small" @click="search">查询</el-button>
    <el-button type="primary" size="small" @click="exportFn" v-if="hasExprotFn">导出</el-button>
  </el-row>
</template>
<script>
export default {
  name: 'searchBtn',
  props: {
      hasExprotFn: {
          type: Boolean,
          default: false
      }
  },
  data() {
    return {};
  },
  methods: {
    //重置
    reset() {
        this.$emit('reset')
    },
    // 搜索
    search() {
        this.$emit('search')
    },
    // 导出
    exportFn() {
        this.$emit('exportFn')
    }
  }
};
</script>