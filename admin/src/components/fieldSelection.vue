<!--
 * @Author: Dong HaiFeng
 * @Date: 2019-12-02 14:43:11
 * @LastEditTime: 2019-12-05 13:41:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \operation-h5\src\components\fieldSelection.vue
 -->
<template>
  <el-popover placement="bottom-start" trigger="click" class="floatRight" popper-class="field">
    <el-checkbox-group v-model="checkedCities" @change="groupChange">
      <el-row v-for="(item,index) in fields" :key="index">
        <el-checkbox :label="item.prop" :checked="true">{{item.label}}</el-checkbox>
      </el-row>
    </el-checkbox-group>
    <el-button class="tabControlBtn" icon="el-icon-menu" slot="reference"></el-button>
  </el-popover>
</template>
<script>
export default {
  data() {
    return {
      checkedCities: [],
      fields: []
    };
  },
  props: {
    refName: {
      // 默认的ref组件名 非必传, 如果不传则必须将table的 ref设置为 tabel
      type: String,
      default: "table"
    },
     fieldList: {
      // 默认的字段集合
      type: String,
      default: "fieldList"
    },
    callBack: {
      // 接收改变后的值得回调  非必传, 如果不传则必须定义字段数组名为: fieldList
      type: String,
      default: "$getFields"
    },
    special: {
      // 特殊结构处理标识
      type: Boolean,
      default: false
    }
  },
  mounted() {
    //渲染完成后获取表格中所有的字段prop和label
    let parent = this.findParent(this);
     parent.$refs[this.refName].$children.forEach(v => {
        if (v.prop && v.label) {
          this.fields.push({
            prop: v.prop,
            label: v.label
          });
        }
      });
  },
  methods: {
    // 改变后调用父元素的方法
    groupChange(val) {
      this.special
        ? this.$emit("callBack", val)
        : this.$parent.$parent[this.callBack](val,this.fieldList);
    },
    //递归查找
    findParent(param) {
      if (param.$parent.$refs[this.refName]) {
        return param.$parent;
      }
     return this.findParent(param.$parent);
    }
  }
};
</script>
<style scoped lang='less'>
button {
  width: 50px;
  height: 32px;
  padding: 8px;
}
</style>