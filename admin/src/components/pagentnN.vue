<!-- 
    文件名：[分页组件]
    作者：〈liwenhui〉
    描述：〈分页组件 and 可配置参数方法〉
    修改人：〈liwenhui〉
    修改时间：2019-12-04 | 2019-12-6
    修改内容：〈无〉
 -->
<template>
  <!-- 未查询到数据时：是否展示分页组件? 当前显示 -->
  <!-- <div class="contantPage" v-if="total > 0"> -->
  <div :class="['contantPage','align_right',{'is-fixed':fixed}]">
    <span class="toPage">共 {{total}} 条</span>
    <span class="toPage">
      前往
      <el-input type="text" class="getPage" size="mini" v-model="pageNum" @input="writePage"></el-input>页
    </span>
    <ul class="el-pager indexUI">
      <!-- 第一页 -->
      <li class="numbe" @click="handleChangePage(1)">
        <i type="button" :disabled="true" class="el-icon-d-arrow-left" style="font-size: 12px;"></i>
      </li>
      <!-- 往前翻页 -->
      <li class="numbe" @click="handleChangePage('reduce')">
        <i class="el-icon-arrow-left" style="font-size: 12px;"></i>
      </li>
      <!-- 页码 -->
      <li
        class="numbe"
        :class="{'active':page === internalCurrentPage }"
        v-for="(page,index) in pageSizeList"
        :key="index"
      >
        <i
          v-if="page"
          @click="handleChangePage(page)"
          style="min-width: 30px;height: 30px;display: inline-block;"
        >{{page}}</i>
        <i rel="external nofollow" v-else>...</i>
      </li>
      <!-- 往后翻页 -->
      <li class="numbe arrow-right" @click="handleChangePage('add')">
        <i class="el-icon-arrow-right" style="font-size: 12px;"></i>
      </li>
      <!-- 最后一页 -->
      <li class="numbe" @click="handleChangePage('end')">
        <i class="el-icon-d-arrow-right" style="font-size: 12px;"></i>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    // istotal: {type: Boolean, default: true},
    // totalPage: {type: Boolean, default: true},
    // 总条数
    total: Number,
    // 每页条数(默认20条)
    pageSize: {
      type: Number,
      default: 20
    },
    // 当前页(默认 1)
    currentPage: {
      currentPage: Number,
      default: 1
    },
    fixed:{
      type:Boolean,
      default:false
    }
  },
  watch: {
    total(newValue, oldValue) {
      // console.log('total--newValue----'+newValue)
      // console.log('total--oldValue----'+oldValue)
      this.init();
    },
    currentPage: {
      handler(newValue, oldValue) {
        this.pageNum = newValue
        // console.log('----- 当前页码 ----->'+newValue)
        this.internalCurrentPage = newValue;
        if (newValue == 1) {
          this.currentPageSize = 1;
          this.init();
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      internalCurrentPage: 1,
      totalPageSizes: 0,
      currentPageSize: 1,
      lastPage: false,
      pageNum: ""
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.totalPageSizes = this.internalPageCount;
      this.handleResetPage("constant");
      // 当数据不足20条时，默认只有 1 页
      if (this.pageSizeList.length == 0) {
        this.pageSizeList.push(1);
      }
    },
    /*
     * 翻页 && 校验逻辑控制
     */
    handleChangePage(val) {
      // 当前页
      let cur = this.internalCurrentPage;
      if (this.internalCurrentPage == val) return;
      let num = "";
      if (val === "end") {
        num = this.pageSizeList[this.pageSizeList.length - 1];
        if (num == 1) return; //如果只有一页，return
        if (cur == num) return; //如果已经是最后一页，return
      } else if (val === "add") {
        num = this.pageSizeList[this.pageSizeList.length - 1];
        if (cur == num) {
          //如果已经是最后一页，return
          return;
        } else {
          num = cur + 1;
        }
      } else if (val === "reduce") {
        num = this.pageSizeList.length;
        if (cur == 1) {
          //如果是第一页，return
          return;
        } else {
          num = cur - 1;
        }
      } else {
        num = val;
      }
      this.pageNum = num;
      this.internalCurrentPage = num;
      this.$emit("current-change", num);
    },
    handleResetPage(type) {
      let nowPageSize = this.currentPageSize * this.pageSize;
      // console.log('nowPageSize---->'+nowPageSize)
      if (nowPageSize >= this.totalPageSizes) {
        this.lastPage = true;
        nowPageSize = this.totalPageSizes;
      } else {
        this.lastPage = false;
      }
      let total = parseInt(this.currentPageSize - 1) * parseInt(this.pageSize);
      let initialSize = parseInt(total) + 1;
      if (type == "change") {
        this.internalCurrentPage = initialSize;
        this.$emit("current-change", this.internalCurrentPage);
      }
      if (initialSize > this.totalPageSizes) return;
    },
    writePage() {
      // 防止输入过快-----------可设置项
      setTimeout(() => {
        let num = Math.ceil(this.pageNum);
        if (num == 0) num = 1; //清空不输入时，默认时1
        if (num <= this.pageCount) {
          this.$emit("current-change", num);
        } else {
          console.log(
            `分页提示：最大 ${this.pageCount} 页，输入 ${num} 页...输入错误`
          );
        }
      }, 600);
    }
    // handlePageHome(){
    //     this.currentPageSize = 1;
    //     this.internalCurrentPage = 1;
    //     this.$emit('current-change',1)
    //     this.handleResetPage('constant');
    // },
    // handlePagePre(){
    //     this.currentPageSize --;
    //     this.handleResetPage('change');
    // },
    // handlePageNext(){
    //     this.currentPageSize ++;
    //     this.handleResetPage('change');
    // },
  },
  computed: {
    internalPageCount() {
      if (typeof this.total === "number") {
        return Math.ceil(this.total / this.pageSize);
      }
      return null;
    },
    // 计算分页数
    pageCount: function() {
      return this.total / this.pageSize > 0
        ? this.total % this.pageSize === 0
          ? this.total / this.pageSize
          : Math.ceil(this.total / this.pageSize)
        : 1;
    },
    // 计算页码展示位置-----------可设置项
    pageSizeList: {
      /*
       * 说明：get() 方法控制页码的展示效果
       * 总页数 <= 5 时，全部展示
       * 总页数 > 5 时，根据当前页，展示分页（参数可设置）
       */
      get() {
        let t = this.pageCount;
        // console.log(t);
        let c = this.currentPage;
        let arr = [];
        if (t === 1) {
          return arr;
        }
        // ------------------------------- 总页数  <=5 时，显示全部页码 -------------------------------
        // 设置：<=5 时，只显示前段12345，不显示...789...end（中间段 末尾页码）
        if (t <= 5) {
          for (let i = 1; i <= t; i++) {
            arr.push(i);
          }
          return arr;
        }
        // ------------------------------- 总页数 t > 5 时的情况 -------------------------------
        // 设置：前列显示5位；点击第5-->显示：前几页...end
        if (c <= 4) return [1, 2, 3, 4, 5, 0, t];
        // 设置：后列显示5位；点击倒数第5-->显示：1...末尾页码
        if (c >= t - 2) return [1, 0, t - 3, t - 2, t - 1, t];
        // 设置：中间显示3位；
        return [1, 0, c - 1, c, c + 1, 0, t];
      },
      set(val) {}
    }
  }
};
</script>
<style lang="less" scoped>
.contantPage {
  padding: 15px 0;
  font-size: 14px;
}
.toPage {
  color: #606266;
  margin-right: 10px;
}
.toPage /deep/.getPage {
  width: 60px;
  height: 28px;
  border-radius: 3px;
  border: 1px solid rgba(239, 242, 245, 1);
}
.getPage /deep/.el-input__inner {
  text-align: center !important;
}
.indexUI li {
  background: #f0f2f5;
  color: #606266;
  height: 30px;
  padding: 0;
  text-align: center;
  margin-right: 10px;
}
.el-pager li {
  min-width: 30px;
}
.indexUI li.active {
  background: #62bfc4;
  color: #fff;
}

.numbe {
  font-size: 14px;
}
// 随屏固定
.is-fixed{
  position: fixed;
  z-index: 99;
  left: auto;
  right: 50px;
  top: auto;
  bottom: 30px;
  background-color: #fff;
  padding: 10px;
  box-shadow:0px 0px 8px 4px rgba(0,0,0,0.04);
  border:1px solid rgba(228,231,237,1)
}
</style>