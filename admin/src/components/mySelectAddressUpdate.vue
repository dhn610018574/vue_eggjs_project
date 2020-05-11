<template>
  <el-cascader
    :options="addressList"
    style="width:100%"
    ref="cascader"
    :props="props"
    v-model="cityArr"
    placeholder="请选择省市区"
    @change="cityChange"
    @visible-change="getValue"
  ></el-cascader>
</template>

<script>
import api from "../api/api";
import Utils from "../utils/utils";
import { constants } from "crypto";
export default {
  name: "my-select-address-update",
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      cityArr: [], //  省市区 code 数组
      addressList: [], // 省市区可选项
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          api.getRegionByCode(node.value).then(res => {
            let arr = [];
            res.data.data &&
              res.data.data.forEach(data => {
                arr.push({
                  label: data.adress,
                  value: data.adressCode,
                  children: [],
                  leaf:
                    data.adressCode == "710001" ||
                    data.adressCode == "810001" ||
                    data.adressCode == "820001"
                      ? true
                      : node.level >= 2
                });
              });
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(arr);
          });
        },
        checkStrictly: true
      },
      isGetFirst: false // 是否已经初始化
    };
  },
  created() {
    if (this.value.length > 0) {
    } else {
      this.getFirstList();
    }
  },
  methods: {
    getValue(val) {
      if (!val) {
        this.$emit("submit");
      }
    },
    // 组件初始化 获取省一级列表
    getFirstList() {
      //一级列表
      api.getRegionByCode().then(res => {
        res.data.data &&
          res.data.data.length &&
          res.data.data.forEach(item => {
            this.addressList.push({
              label: item.adress,
              value: item.adressCode,
              children: [],
              leaf: false
            });
          });
      });
    },
    cityChange(city) {
      // this.$emit('change',city)
    }
  },
  watch: {
    value: {
      // 监听父组件传入的省市区code数组
      handler(val, oldVal) {
        if (val.length > 0) {
          // 说明有值
          api.getRegionByCode().then(res => {
            // 一级列表
            res.data.data.forEach(item => {
              this.addressList.push({
                label: item.adress,
                value: item.adressCode,
                children: [],
                leaf: false
              });
            });
            // 判断传入的值是几级列表
            if (!val[1]) {
              // 没有第二级
              this.cityArr = Utils.deepClone(val, []); // 绑定省市区code值  请求省市区列表后进行回显
              return;
            }
            // 接受父组件 传入的省市区 code数组,当长度为3时再进行触发
            // 拿省code 获取下辖市列表  (香港 澳门 台湾,只有)
            api.getRegionByCode(val[0]).then(res => {
              this.addressList.forEach((item, index) => {
                if (item.value == val[0]) {
                  let arr = [];
                  item.children = [];
                  res.data.data.forEach(data => {
                    arr.push({
                      label: data.adress,
                      value: data.adressCode,
                      children: [],
                      leaf:
                        data.adressCode == "710001" ||
                        data.adressCode == "810001" ||
                        data.adressCode == "820001"
                          ? true
                          : false
                    });
                  });
                  this.$set(this.addressList[index], "children", arr); // 下辖市区列表已经生成
                  // 没有第三极
                  if (!val[2]) {
                    this.cityArr = Utils.deepClone(val, []); // 绑定省市区code值  请求省市区列表后进行回显
                    return;
                  }
                }
              });
              api.getRegionByCode(val[1]).then(res => {
                // 拿到市code 获取下辖区域列表
                this.addressList.forEach((provinceItem2, provinceIndex) => {
                  if (provinceItem2.value == val[0]) {
                    // 找到省
                    provinceItem2.children.forEach((cityItem, cityIndex) => {
                      // 找到市  把下辖区域添加进去
                      if (cityItem.value == val[1]) {
                        let arr = [];
                        cityItem.children = [];
                        res.data.data.forEach(data => {
                          arr.push({
                            label: data.adress,
                            value: data.adressCode,
                            children: [],
                            leaf: true
                          });
                        });
                        this.$set(
                          this.addressList[provinceIndex].children[cityIndex],
                          "children",
                          arr
                        ); // 下辖市区列表已经生成
                        this.cityArr = Utils.deepClone(val, []); // 绑定省市区code值  请求省市区列表后进行回显
                      }
                    });
                  }
                });
              });
            });
          });
        }
      },
      deep: true,
      immediate: true
    },
    cityArr: {
      handler(newValue) {
        this.$emit("handleAddressChange", newValue);
      },
      deep: true
    }
  }
};
</script>
