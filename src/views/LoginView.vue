<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 95vh;
    "
  >
    <el-card
      style="
        display: flex;
        justify-content: center;
        width: 25vw;
        height: 40vh;
        border-radius: 10px;
      "
      shadow="always"
    >
      <el-text style="display: flex; justify-content: center; font-size: 4vh"
        >ET EIS 测试系统
      </el-text>
      <br />
      <br />
      <el-form :model="loginForm" :rules="loginRules">
        <el-form-item prop="username" label="账号">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button style="width: 20vw" type="primary" @click="onSubmit"
            >登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const loginForm = ref({
  username: "",
  password: "",
});

const router = useRouter();

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
};

const adminUsername = "admin";
const adminPassword = "admin";
const user1Username = "user1";
const user1Password = "user1";

const onSubmit = () => {
  if (
    (loginForm.value.username === adminUsername &&
      loginForm.value.password === adminPassword) ||
    (loginForm.value.username === user1Username &&
      loginForm.value.password === user1Password)
  ) {
    router.push("/status");
  } else {
    ElMessage.error("登录失败！账号或密码错误！");
  }
};
</script>

<style scoped></style>
