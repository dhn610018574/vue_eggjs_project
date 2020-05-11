<!--
 * @Author: ji.xuyu
 * @Date: 2020-02-03 17:20:39
 * @LastEditors  : ji.xuyu
 * @LastEditTime : 2020-02-11 15:59:15
 * @Description:  基础表格
 -->
<template>
  <div class="hx-grid"
       ref="grid">
    <!-- table表格 -->
    <el-table ref="table"
              :data="tableData"
              v-loading="loading"
              max-height="600"
              :border='border'
              :span-method="objectSpanMethod"
              @select="tableHandlerSelect"
              @selection-change="tableSelectionChange"
              @selet-all="tableHandlerSelectAll"
              @row-click="tableRowClick"
              @expand-change="expand"
              @current-change="tableCurrentChange"
              header-cell-class-name="hx-grid-header"
              row-class-name="hx-grid-row">
      <slot></slot>
    </el-table>

    <!-- 分页器 -->
    <el-pagination :total="totalRecords"
                   small
                   v-if="totalRecords == 0 ? false : true"
                   class="hx-grid-pagination"
                   layout="total, sizes, prev, pager, next"
                   @current-change="handlerCurrentChange"
                   @size-change="handlerSizeChange"
                   :page-sizes="[20,50,100,200,300]" />
  </div>
</template>

<script>
import Http from "../../../utils/axios";
export default {
  name: "HxGrid",
  props: {
    // 表格的api接口--异步
    url: String,
    // 是否初始化加载表格
    isInitial: {
      type: Boolean,
      default: true
    },
    otherRow:{
      type: Boolean,
      default: true

    },
    methodsStatus: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    },
    // 是否用默认高度(440)
    defaultHeight: {
      type: Boolean,
      default: true
    },
    // false: params方式 true: data方式
    bodyParser: {
      type: Boolean,
      default: false
    },
    // 表格传递的参数--异步
    params: [Object],
    // 静态表格数据--同步(注:之后会根据data计算分页)
    data: {
      type: Array,
      default() {[]}
    },
    // 自适应高度(当设置autoHeight属性，所有高度无效)
    autoHeight: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      totalRecords: 0, // 总数
      loading: false,
      pageNum: 1,
      pageSize: 20,
      tableBody: null,
      tableHeader: null,
      tableData: []
    };
  },
  computed: {
    _grid() {
      return this.$refs["grid"];
    },
    table() {
      return this.$refs["table"];
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        // this.tableData=val
        // if(Array.isArray(val.records)) {
        //     this.tableData = val.records;
        //     this.totalPages =val.totalPages
        // }
      }
    }
  },

  mounted() {
    this.isInitial && !this.data && this.tableInitial();
  },

  methods: {
    /**
       * @description: 
       * @param {type} 
       * @return: 
       */
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
           if (row.menuType  === '1') {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else if(row.menuLevel === 4){
            return {
              rowspan: 0,
              colspan: 0
            };
          }

        }
      },
    /**
     * @name:
     * @description:
     * @param {type}
     * @return:
     */
    isObject(obj) {
      let type = typeof obj;
      return type === "function" || (type === "object" && !!obj);
    },
    /**
     * 表格的加载方法
     * @param {Boolean} repeat true:表格重新加载，pageSize重置10，pageNum重置1
     */
    async tableInitial(repeat = true) {
      if (repeat) {
        this.pageNum = 1;
        this.pageSize = 20;
        this.repeat = true;

        var timer = setTimeout(_ => {
          clearTimeout(timer);
          timer = null;
          this.repeat = false;
        });
      }
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ...this.params
      };
      console.log(process.env.API_ENV + this.url);
      try {
        this.loading = true;
        // const request = this.bodyParser
        //     ? { url: process.env.API_ENV+this.url, data: JSON.stringify(params)}
        //     : { url: process.env.API_ENV+this.url, params };
        if (this.methodsStatus) {
             await Http
            .get("/api-operation" + this.url, params)
            .then(res => {
              const data = res.data.data;
              this.loading = false;
              console.log(res.data)
              if (
                res.data.code==200 &&
                Array.isArray(data.records)
              ) {
                this.setLoadedData(data.records, data.totalRecords, data.pageNum);
              } else {
                this.setLoadedData();
              }
            });
        } else {
          await Http
            .post(`/api-operation` + this.url, params)
            .then(res => {
              const data = res.data.data;
              this.loading = false;
              if (
                 res.data.code==200 &&
                Array.isArray(data.records)
              ) {
                this.setLoadedData(data.records, data.totalRecords, data.pageNum);
              } else {
                this.setLoadedData();
              }
            });
        }
        // this.calcTableMaxHeight()
      } catch (e) {
        this.setLoadedData();
        this.loading = false;
      }
    },
    /**
     * 设置table加载完成后的数据
     * @param {*} data
     * @param {*} totalRecords
     * @param {*} pages
     */
    setLoadedData(data = [], totalRecords = 0, pages = 1) {
      this.tableData = data;
      this.totalRecords = totalRecords;
      this.pageNum = pages;
    },

    /**
     * pageNum 改变时会触发
     * @param {Number} pageNum: 当前页pageNum
     */
    handlerCurrentChange(page) {
      console.log(page);
      this.pageNum = page;
      this.tableInitial(false);
    },

    /**
     * pageSize 改变时会触发
     * @param {Number} pageSize: 页条数size
     */
    handlerSizeChange(size) {
      console.log(size);
      this.pageSize = size;
      this.tableInitial(false);
    },

    /**
     * 当用户手动勾选数据行的 Checkbox 时触发的事件
     * @param {*} selection: 当前所有勾选的数组
     * @param {*} row
     */
    tableHandlerSelect(selection, row) {
      this.$emit.apply(this, ["select", ...arguments]);
    },

    /**
     * 当用户手动勾选全选 Checkbox 时触发的事件
     * @param {*} selection: 当前所有勾选的数组
     */
    tableHandlerSelectAll(selection) {
      this.$emit.apply(this, ["selet-all", ...arguments]);
    },

    /**
     * 当选择项发生变化时会触发该事件
     * @param {*} selection
     */
    tableSelectionChange(selection) {
      this.$emit.apply(this, ["selection-change", ...arguments]);
    },

    /**
     * 当某一行被点击时会触发该事件
     * @param {*} row
     * @param {*} event
     * @param {*} column
     */
    tableRowClick(row, event, column) {
      this.$emit.apply(this, ["row-click", ...arguments]);
    },

    /**
     * 当表格的当前行发生变化的时候会触发该事件
     * @param {*} currentRow
     * @param {*} oldCurrentRow
     */
    tableCurrentChange(currentRow, oldCurrentRow) {
      this.$emit.apply(this, ["current-change", ...arguments]);
    },
    /**
     * 当用户对某一行展开或者关闭的时候会触发该事件
     * @param {*} currentRow
     * @param {*} oldCurrentRow
     */
    expand(currentRow, oldCurrentRow) {
      this.$emit.apply(this, ["expand-change", ...arguments]);
    }
  }
};
</script>

<style lang="scss">
.hx-grid {
  /* max-width: ; */
  min-height: 230px;
  padding-bottom: 10px;
  background: #fff;
  .hx-grid-header {
    background: #fff;
  }
  .hx-grid-pagination {
    margin-top: 10px;
    text-align: right;
  }
  .el-table__body-wrapper {
    overflow: auto !important;
  }

  .el-table__body-wrapper::-webkit-scrollbar {
    width: 2px;
    height: 5px;
  }
  /*定义滚动条的轨道，内阴影及圆角*/
  .el-table__body-wrapper::-webkit-scrollbar-track {
    border-radius: 5px;
    background-color: rgba(167, 167, 167, 0.24);
  }
  /*定义滑块，内阴影及圆角*/
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    height: 2px;
    background: rgba(167, 167, 167, 0.24);
    border-radius: 5px;
  }
}
</style>


