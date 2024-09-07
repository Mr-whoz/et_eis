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
        <el-row>
          <el-col :span="6">
            <el-button
              size="large"
              :disabled="!isAdmin"
              @click="openUserListDialog()"
              >用户列表
            </el-button>
          </el-col>
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
      <el-card header="网络设置" style="height: 25vh">
        <el-row>
          <el-col>
            <el-text size="large"
              >当前设备IP地址：{{ deviceIPAddress }}
            </el-text>
          </el-col>
        </el-row>
        <br />
        <el-row>
          <el-col>
            <el-button
              size="large"
              :disabled="!isAdmin"
              @click="openResetIPDialog"
              >重设IP
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <br />
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card header="文件管理" style="height: 25vh">
        <!-- 需要等后端服务器实现相应功能，暂时做不了 -->
        <!-- 前端通过AJAX请求（如Axios）从后端获取文件结构的JSON数据，并根据数据渲染出类似文件浏览器的界面。你可以使用Vue 3 结合Element Plus中的树形组件（<el-tree>）来显示文件夹结构。 -->
        <!-- 前端还可以根据用户操作（如点击文件夹、选择文件）发送对应的API请求，执行后端的文件操作（如读取文件内容、删除文件、上传文件等）。 -->
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card header="程序升级" style="height: 25vh">
        <el-row>
          <el-col>
            <br />
            <el-button
              size="large"
              :disabled="!isAdmin"
              @click="triggerFileInput"
              >选择文件
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <br />
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card header="设备校准" style="height: 25vh"></el-card>
    </el-col>
    <el-col :span="12">
      <el-card header="重启复位" style="height: 25vh">
        <br />
        <el-button size="large" :disabled="!isAdmin" @click="openRebootDialog"
          >重启设备
        </el-button>
        <el-button size="large" :disabled="!isAdmin" @click="openResetDialog"
          >复位设备
        </el-button>
      </el-card>
    </el-col>
  </el-row>

  <!-- 查看用户对话框 -->
  <el-dialog title="用户列表" v-model="userListDialogVisible" width="25vw">
    <el-form>
      <el-form-item>
        <el-select v-model="selectedUser" placeholder="用户列表">
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
      <el-button
        @click="
          userListDialogVisible = false;
          selectedUser = 0;
        "
        >关闭
      </el-button>
    </template>
  </el-dialog>

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

  <!-- 重设IP对话框 -->
  <el-dialog title="重新设置IP地址" v-model="resetIPDialogVisible" width="25vw">
    <el-form>
      <el-form-item>
        <el-text size="large"
          >请输入新的IP地址，格式：192.168.x.y，x和y都是2到254之间的整数：
        </el-text>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="newIPAddress"
          placeholder="请输入新的IP地址"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="resetIPDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="resetIPAddress">确定</el-button>
    </template>
  </el-dialog>

  <!-- 隐藏的文件输入框 -->
  <input
    ref="fileInput"
    type="file"
    @change="handleFileChange"
    style="display: none"
  />

  <!-- 重启确认对话框 -->
  <el-dialog title="确认重启" v-model="rebootDialogVisible" width="30%">
    <span>确定要重启设备吗？</span>
    <template #footer>
      <el-button @click="rebootDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmReboot">确认</el-button>
    </template>
  </el-dialog>

  <!-- 复位确认对话框 -->
  <el-dialog title="确认复位" v-model="resetDialogVisible" width="30%">
    <span>确定要复位设备吗？</span>
    <template #footer>
      <el-button @click="resetDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmReset">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import bcrypt from "bcryptjs";
import axios from "axios";
import { ElMessage } from "element-plus";

const authStore = useAuthStore();
const storedUsername = localStorage.getItem("localUsername");
const isAdmin: boolean = storedUsername === "admin";

const userList = ref<string[]>([]);
const newPassword = ref<string>("");

const userListDialogVisible = ref<boolean>(false);
const openUserListDialog = async (): Promise<void> => {
  userListDialogVisible.value = true;
  userList.value = await authStore.fetchFileContent("/login/user_list.txt");
};

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

const deviceIPAddress = ref<string>("");

const resetIPDialogVisible = ref<boolean>(false);
const newIPAddress = ref<string>("");

const openResetIPDialog = (): void => {
  resetIPDialogVisible.value = true;
};

const resetIPAddress = (): void => {
  const ipRegex: RegExp = /^192\.168\.(\d{1,3})\.(\d{1,3})$/;
  const match: RegExpMatchArray | null = newIPAddress.value.match(ipRegex);

  if (!match) {
    ElMessage.error("IP地址格式不正确！");
    return;
  }

  const x = parseInt(match[1]);
  const y = parseInt(match[2]);

  if (x < 2 || x > 254 || y < 2 || y > 254) {
    ElMessage.error("IP地址格式不正确！");
    return;
  }

  // 如果验证通过，通过WebSocket发送消息
  const jsonObject = { newIPAddress: newIPAddress.value };
  if (authStore.websocket) {
    (authStore.websocket as WebSocket).send(JSON.stringify(jsonObject));
  }

  // 这里要等待服务区传回删除用户的信息后才可以！
  ElMessage.success("IP地址已重新设置！");
  resetIPDialogVisible.value = false;
};

// 引用input元素
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);

// 点击按钮时，触发文件选择窗口
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click(); // 通过ref触发隐藏的input标签
  }
};

// 处理文件选择事件
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]; // 获取选择的文件

    // 创建FormData对象，准备上传
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    try {
      // 使用axios发送文件
      // 需要替换网址为服务器的真实网址！！！！！！！！！！
      const response = await axios.post("http://127.0.0.1:8080/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      ElMessage.success("文件上传成功！");
    } catch (error) {
      ElMessage.error("文件上传失败：" + error);
    }
  }
};

// 控制对话框的显示状态
const rebootDialogVisible = ref(false);
const resetDialogVisible = ref(false);

// 打开重启确认对话框
const openRebootDialog = () => {
  rebootDialogVisible.value = true;
};

// 打开复位确认对话框
const openResetDialog = () => {
  resetDialogVisible.value = true;
};

// 确认重启
const confirmReboot = () => {
  if (authStore.websocket) {
    if (authStore.websocket) {
      (authStore.websocket as WebSocket).send(
        JSON.stringify({ action: "rebootDevice" }),
      );
    }
    ElMessage.success("重启请求已发送！");
  }
  rebootDialogVisible.value = false;
};

// 确认复位
const confirmReset = () => {
  if (authStore.websocket) {
    if (authStore.websocket) {
      (authStore.websocket as WebSocket).send(
        JSON.stringify({ action: "rebootServer" }),
      );
    }
    ElMessage.success("复位请求已发送！");
  }
  resetDialogVisible.value = false;
};
</script>

<style scoped></style>
