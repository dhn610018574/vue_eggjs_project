<template>
  <el-container>
    <el-header>
      <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" @click="isCollapse=!isCollapse"></i>
      <img src="../assets/css/img/1.png" alt />
      <span @click="loginOut">{{userName}}</span>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse? '0px':'200px'">
        <el-menu
          default-active="1"
          :router="true"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
        >
          <el-menu-item v-for="item in route" :key="item.path" :index="item.path">
            <i class="el-icon-location"></i>
            <span>{{item.label}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Http from "@/api/api";
export default {
  data() {
    return {
      userName: "admin",
      isCollapse: true,
      route: [
        { path: "/index", label: "房源信息" ,Accesslevel:'1'},
        { path: "/account", label: "账号管理",Accesslevel:'0' }
      ]
    };
  },
  created() {
    this.userName = localStorage.getItem("userName");
    // if (localStorage.getItem("Accesslevel") !== "0") {
    //   this.route = this.route.filter(v => {
    //     return v.path === "/index";
    //   });
    // }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    loginOut() {
      this.$confirm("即将退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          Http.loginout().then(res => {
            if (res.data.code == 0) {
              localStorage.removeItem("auth_token");
              localStorage.removeItem("Accesslevel");
              localStorage.removeItem("userName");
              this.$router.push("/login");
              this.$message({
                type: "success",
                message: "登出成功!"
              });
            } else {
              this.$message.error("网络错误,请稍后再试");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.el-container {
  min-height:100% ;
  .el-header {
    background-color: #eee;
    text-align: right;
    line-height: 60px;
    padding-right: 50px;
    font-size: 24px;
    color: #fff;
    vertical-align: middle;
    .logo {
      width: 60px;
      height: 60px;
      float: left;
      background: url("../assets/css/img/u=1720133037,3770922886&fm=26&gp=0.jpg")
        no-repeat left center;
      background-size: 60px;
    }
    i {
      float: left;
      height: 60px;
      line-height: 60px;
      font-size: 40px;
      margin-left: 40px;
      color: #000;
    }
    img {
      height: 32px;
      vertical-align: middle;
      margin-right: 20px;
    }
    span {
      font-weight: 700;
      // text-decoration: underline;
      color: blue;
      cursor: pointer;
    }
  }
  .el-aside {
    .el-menu {
      height: 100%;
    }
  }
}
</style>
