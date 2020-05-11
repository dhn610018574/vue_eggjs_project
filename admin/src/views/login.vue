<template>
  <div class="login" @keyup.13="login">
    <div class="content">
      <h2>房源管理系统</h2>
      <el-form :model="loginFrom" :rules="rules" ref="loginForm" label-width="50px">
        <el-form-item label="账号" prop="username">
          <el-input
            placeholder="请输入账号"
            v-model="loginFrom.username"
            maxlength="20"
            autocomplete="off"
            ref="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="loginFrom.password"
            maxlength="16"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-button @click="login" type="primary" :disabled="loading">登 录</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import Http from "@/api/api";
export default {
  name: "login",
  data() {
    return {
      loginFrom: {
        username: "",
        password: ""
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: "请输入账户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.input.focus();
    });
  },
  methods: {
    login(e) {
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          let params = this.loginFrom;
          this.loading = true;
          Http.login(params)
            .then(res => {
              console.log(res.data);
              this.loading = false;
              if (res.data && res.data.code == 0) {
                let { auth_token, type } = res.data.data;
                localStorage.setItem("auth_token",  auth_token);
                localStorage.setItem("Accesslevel", type);
                localStorage.setItem("userName", this.loginFrom.username);
                this.$message.success("登录成功 !");
                this.$router.push("/index");
              } else {
                this.$message.error("账号或者密码错误,请重新输入");
              }
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.login {
  display: flex;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  .content {
    width: 35%;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 30px;
    text-align: center;
    h2 {
      margin: 20px;
    }
    .el-button {
      width: 100%;
      margin-top: 10px;
    }
  }
}
i {
  position: absolute;
  right: 5px;
  top: 13px;
}
</style>

