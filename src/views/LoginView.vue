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
      <el-form :model="loginForm" :rules="loginRules" v-loading="loading">
        <el-form-item prop="username" label="账号">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
            @keydown.enter="onSubmit"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            type="password"
            show-password
            v-model="loginForm.password"
            placeholder="请输入密码"
            @keydown.enter="onSubmit"
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
import { useAuthStore } from "@/stores/auth";
import { ElMessage } from "element-plus";

// 用于生成预设密码的代码
// import bcrypt from "bcryptjs";
// const password = "yckj2024admin"; // yckj2024admin // user1
// const salt = bcrypt.genSaltSync(4); // 最小是4，不能设置大了，否则校验很慢
// const hashedPassword = bcrypt.hashSync(password, salt);
// console.log(hashedPassword);

const loginForm = ref<{ username: string; password: string }>({
  username: "",
  password: "",
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
};

const loading = ref<boolean>(false);

const authStore = useAuthStore();

const onSubmit = async (): Promise<void> => {
  loading.value = true; // 开启加载动画

  try {
    await authStore.login(loginForm.value.username, loginForm.value.password);
  } catch (error) {
    ElMessage.error("登录失败！" + error);
  } finally {
    loading.value = false; // 结束加载动画
  }
};
</script>

<style scoped></style>
