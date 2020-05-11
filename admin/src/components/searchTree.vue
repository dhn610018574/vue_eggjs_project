<template>
  <div class="search-tree" v-if="searchTreeShow">
    <el-input v-model="searchTreeInput" :placeholder="placeholderInput" :disabled="isDisable"></el-input>
    <el-checkbox v-model="checkAllTreeFlag" @change="shopTreeCheckAll" v-if="shopTreeData.length" :disabled="isDisable">全选</el-checkbox>
    <el-tree
      :data="shopTreeData"
      :show-checkbox="true"
      :filter-node-method="shopTreeFilter"
      @node-click="shopTreeHandleNodeClick"
      @check="shopTreeCheck"
      @check-change="shopTreeCheckArray"
      node-key="uniqKey"
      :class="{'shopTreeSty': true, 'shopTreeErrSty': shopTreeErrFlag}"
      ref="shopTree"
      :default-checked-keys="shopTreeCheckedListTemp"
      :default-expanded-keys="shopTreeCheckedListTemp"
    ></el-tree>
  </div>
</template>

<script>
import { setTimeout } from "timers";
export default {
  name: "searchTree",
  props: {
    searchTreeShow: {
      type: Boolean
    },
    placeholderInput: {
      default: "请输入搜索的店铺名称",
      type: String
    },
    shopTreeData: {
      type: Array,
      required: true
    },
    shopTreeCheckboxShow: {
      type: Boolean
    },
    shopTreeErrFlag: {
      type: Boolean
    },
    shopTreeCheckedList: {
      type: Array
    },
    isDisable:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      // Input 店铺名称数据
      searchTreeInput: null,
      // Checkbox 全选标记数据
      checkAllTreeFlag: false,
      // 选中的节点展开展示数据
      shopTreeCheckedListTemp: [],
    };
  },
  created() {
    this.expandedFun();
  },
  watch: {
    shopTreeData() {
      this.checkAllTreeFlag = false;
    },
    searchTreeInput(val) {
      this.$refs.shopTree.filter(val);
    },
    shopTreeCheckedList: {
      handler(newValue, oldValue) {
        this.shopTreeCheckedListTemp = this.shopTreeCheckedList;
      },
      deep: true
    },
  },
  methods: {
    // 树形控件 - 展开至选中节点事件
    expandedFun() {
      setTimeout(() => {
        this.shopTreeCheckedListTemp = this.shopTreeCheckedList;
      });
    },
    // 多选框 - 全选事件
    shopTreeCheckAll(value) {
      console.log('全选');
      if (value === true) {
        this.$refs.shopTree.setCheckedNodes(this.shopTreeData);
        this.$emit("shopTreeCheckAll", this.$refs.shopTree.getCheckedNodes());
      } else {
        this.$refs.shopTree.setCheckedNodes([]);
        this.$emit("shopTreeCheckAll", this.$refs.shopTree.getCheckedNodes());
      }
    },
    // 树形控件 - 对树节点进行筛选事件
    shopTreeFilter(value, data) {
      console.log("Search-Tree-Value：", value);
      console.log("Search-Tree-Data", data);
      if (!value) return true;
      if (!data.label) return true;// data.label 如果为null会报错，无法继续循环查找下去
      return data.label.indexOf(value) !== -1;
    },
    // 树形控件 - 节点点击事件
    shopTreeHandleNodeClick(data, node) {
      console.log('点击节点');
      this.$emit("shopTreeHandleNodeClick", data, node);
    },
    // 树形控件 - 复选框点击事件
    shopTreeCheck(data, res) {
      console.log('复选点击');
      this.$emit("shopTreeCheck", data, res);
    },
    // 树形控件 - 节点选中状态变化事件
    shopTreeCheckArray(array, isChecked) {
      console.log('节点变化');
      this.$emit("shopTreeCheckArray", array, isChecked);
    }
  }
};
</script>

<style lang="less" scoped>
.shopTreeSty {
  box-sizing: border-box;
  border: 1px solid #fff;
}
.shopTreeErrSty {
  border-color: #fa5b5b;
}
</style>
