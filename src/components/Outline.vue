<template>
  <el-container>
    <el-aside width="10vw">
      <el-row>
        <el-col :span="2"><!-- 纯占位，无意义 --></el-col>
        <el-col :span="8" style="display: flex; align-items: center"
          ><img src="@/assets/logo.png" alt="Logo" style="width: 2.5vw"
        /></el-col>
        <el-col :span="12" style="display: flex; align-items: start">
          <strong style="font-size: 1.25vw">ET EIS<br />测试系统</strong>
        </el-col>
        <el-col :span="2"><!-- 纯占位，无意义 --></el-col>
      </el-row>
      <!-- 调整与上方的距离 -->
      <div style="margin: 1vh"></div>
      <el-row style="height: 90vh">
        <el-col>
          <el-menu
            router
            :default-active="$route.path"
            background-color="#304156"
            text-color="#FFFFFF"
            active-text-color="#409EFF"
            style="height: 100%; border-radius: 5px"
          >
            <el-menu-item index="/status">
              <el-icon>
                <Odometer />
              </el-icon>
              &nbsp;&nbsp;状态
            </el-menu-item>
            <el-menu-item index="/setting">
              <el-icon>
                <Setting />
              </el-icon>
              &nbsp;&nbsp;设置
            </el-menu-item>
            <el-menu-item index="/dataDisplay">
              <el-icon>
                <DataLine />
              </el-icon>
              &nbsp;&nbsp;数据显示
            </el-menu-item>
            <el-menu-item index="/tool">
              <el-icon>
                <Tools />
              </el-icon>
              &nbsp;&nbsp;工具
            </el-menu-item>
            <el-menu-item index="/deviceManage">
              <el-icon>
                <Management />
              </el-icon>
              &nbsp;&nbsp;设备管理
            </el-menu-item>
            <br />
            <el-menu-item style="pointer-events: none">
              <el-icon>
                <Message />
              </el-icon>
              &nbsp;&nbsp;意见反馈
            </el-menu-item>
            <div style="display: flex; justify-content: center">
              <img src="@/assets/qrcode.svg" alt="QRCode" style="width: 8vw" />
            </div>
            <br />
            <br />
            <el-menu-item @click="handleLogout">
              <el-icon>
                <SwitchButton />
              </el-icon>
              &nbsp;&nbsp;退出登录
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-aside>
    <el-container>
      <el-main>
        <RouterView />
      </el-main>
      <el-footer>
        <el-text size="large" style="display: flex; justify-content: center"
          >Copyright © 2024-2025 仪测科技. All Rights Reserved.
        </el-text>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter, RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
  DataLine,
  Management,
  Message,
  Odometer,
  Setting,
  SwitchButton,
  Tools,
} from "@element-plus/icons-vue";

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = (): void => {
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped></style>
