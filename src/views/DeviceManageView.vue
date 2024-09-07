<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card header="用户管理" style="height: 25vh">
        <el-row>
          <el-col>
            <el-text size="large">当前登录用户：{{ storedUsername }}</el-text>
          </el-col>
        </el-row>
        <br />
        <el-row justify="start">
          <el-col :span="6">
            <el-button
              size="large"
              :disabled="!isAdmin"
              @click="addUserDialogVisible = true"
              >新增用户
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              size="large"
              :disabled="!isAdmin"
              @click="openChangePasswordDialog"
              >修改密码
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              size="large"
              :disabled="!isAdmin"
              @click="openDeleteUserDialog"
              >删除用户
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card header="网络设置" style="height: 25vh"></el-card>
    </el-col>
  </el-row>
  <br />
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card header="文件管理" style="height: 25vh"></el-card>
    </el-col>
    <el-col :span="12">
      <el-card header="程序升级" style="height: 25vh"></el-card>
    </el-col>
  </el-row>
  <br />
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card header="设备校准" style="height: 25vh"></el-card>
    </el-col>
    <el-col :span="12">
      <el-card header="重启复位" style="height: 25vh"></el-card>
    </el-col>
  </el-row>

  <!-- 新增用户对话框 -->
  <el-dialog title="新增用户" v-model="addUserDialogVisible" width="25vw">
    <el-form :model="newUserForm" :rules="newUserRules" v-loading="loading">
      <el-form-item prop="username" label="账号">
        <el-input
          v-model="newUserForm.username"
          placeholder="请输入账号"
          @keydown.enter="addUser"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input
          type="password"
          show-password
          v-model="newUserForm.password"
          placeholder="请输入密码"
          @keydown.enter="addUser"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addUserDialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        @click="
          addUserDialogVisible = false;
          addUser();
        "
        >确定
      </el-button>
    </template>
  </el-dialog>

  <!-- 修改密码对话框 -->
  <el-dialog
    title="修改密码"
    v-model="changePasswordDialogVisible"
    width="25vw"
  >
    <el-form>
      <el-form-item>
        <el-select v-model="selectedUser" placeholder="请选择用户">
          <el-option
            v-for="(user, index) in userList"
            :key="index"
            :label="user"
            :value="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          show-password
          v-model="newPassword"
          placeholder="请输入新密码"
          @keydown.enter="changePassword()"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="changePasswordDialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        @click="
          changePasswordDialogVisible = false;
          changePassword();
        "
        >确定
      </el-button>
    </template>
  </el-dialog>

  <!-- 删除用户对话框 -->
  <el-dialog title="删除用户" v-model="deleteUserDialogVisible" width="25vw">
    <el-form>
      <el-form-item>
        <el-select v-model="selectedUser" placeholder="请选择用户">
          <el-option
            v-for="(user, index) in userList"
            :key="index"
            :label="user"
            :value="index"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="deleteUserDialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        @click="
          deleteUserDialogVisible = false;
          deleteUser();
        "
        >确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import bcrypt from "bcryptjs";
import { ElMessage } from "element-plus";

const authStore = useAuthStore();
const storedUsername = localStorage.getItem("localUsername");
const isAdmin: boolean = storedUsername === "admin";

const userList = ref<string[]>([]);
const newPassword = ref<string>("");

// 定义用于新增用户表单的数据
const newUserForm = ref<{ username: string; password: string }>({
  username: "",
  password: "",
});

const newUserRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
};

const loading = ref<boolean>(false);

// 新增用户相关
const addUserDialogVisible = ref<boolean>(false);

const addUser = async (): Promise<void> => {
  loading.value = true;
  try {
    const userListContent = await authStore.fetchFileContent(
      "/login/user_list.txt",
    );

    // 检查用户名是否已存在
    if (userListContent.includes(newUserForm.value.username)) {
      ElMessage.error("用户名已存在！");
      return;
    }

    // 生成bcrypt加密的密码
    const hashedPassword: string = await bcrypt.hash(
      newUserForm.value.password,
      10,
    );

    // 将用户名和加密后的密码写入文件
    authStore.appendToFile("user_list.txt", newUserForm.value.username);
    authStore.appendToFile("password_list.txt", hashedPassword);

    // 这里要等待服务区传回用户添加成功的信息后才可以！
    ElMessage.success("用户添加成功！");
    addUserDialogVisible.value = false;
  } catch (error) {
    ElMessage.error("新增用户失败：" + error);
  } finally {
    loading.value = false;
  }
};

// 修改密码相关
const changePasswordDialogVisible = ref<boolean>(false);
const selectedUser = ref<number>(0);
// 修改密码对话框中过滤掉admin
const openChangePasswordDialog = async (): Promise<void> => {
  changePasswordDialogVisible.value = true;
  userList.value = (
    await authStore.fetchFileContent("/login/user_list.txt")
  ).filter((user) => user !== "admin");
};

const changePassword = async (): Promise<void> => {
  loading.value = true;
  try {
    const jsonObject: { [key: string]: any } = {};
    jsonObject["changePassword"] = selectedUser.value + 1;
    // 生成bcrypt加密的新密码
    jsonObject["newPassword"] = await bcrypt.hash(newPassword.value, 4);
    if (authStore.websocket) {
      (authStore.websocket as WebSocket).send(JSON.stringify(jsonObject));
    }

    // 这里要等待服务区传回修改密码的信息后才可以！
    ElMessage.success("修改密码成功！");
    selectedUser.value = 0;
    changePasswordDialogVisible.value = false;
  } catch (error) {
    ElMessage.error("修改密码失败：" + error);
  } finally {
    loading.value = false;
  }
};

// 删除用户相关
const deleteUserDialogVisible = ref<boolean>(false);
// 删除用户对话框中过滤掉admin
const openDeleteUserDialog = async (): Promise<void> => {
  deleteUserDialogVisible.value = true;
  userList.value = (
    await authStore.fetchFileContent("/login/user_list.txt")
  ).filter((user) => user !== "admin");
};

const deleteUser = async (): Promise<void> => {
  loading.value = true;
  try {
    const jsonObject: { [key: string]: any } = {};
    jsonObject["deleteUser"] = selectedUser.value + 1;
    if (authStore.websocket) {
      (authStore.websocket as WebSocket).send(JSON.stringify(jsonObject));
    }

    // 这里要等待服务区传回删除用户的信息后才可以！
    ElMessage.success("删除用户成功！");
    selectedUser.value = 0;
    deleteUserDialogVisible.value = false;
  } catch (error) {
    ElMessage.error("删除用户失败：" + error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped></style>
