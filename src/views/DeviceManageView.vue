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
    <el-col>
            <br />
            <el-button
              size="large"
              @click="
              exportFileBrowser = true; "
              >数据导出
            </el-button>
          
           <el-button
              size="large"
              @click="deleteFileBrowser= true;"
              >删除文件
            </el-button>
            <el-button
              size="large"
              @click="renameFileBrowser= true;"
              >重命名文件
            </el-button>
          </el-col>
        
          <!-- ======================================== -->

    
<el-dialog v-model="exportFileBrowser" title="数据导出" width="30vw">
      <el-row>
        <el-col>
          <el-radio-group v-model="dataAmount">
            <!-- 全部导出的函数 -->
            <el-radio value="all" size="large">全部导出</el-radio>
                <!-- 按时间段导出的函数 -->
            <el-radio value="time" size="large" >按时间段导出</el-radio>
                 <!-- 按时间段导出的函数 -->
            <el-radio value="choiceDownload" size="large" >选择文件导出</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row>

      <!-- 按时间段导出时，显示时间选择器 -->
    <el-row v-if="dataAmount === 'time'" style="margin-top: 20px;">
      <el-col :span="24" style="margin-bottom: 10px;">
        <el-config-provider :locale="zhCn">
          <div class="demonstration" style="font-size:17px;">选择开始时间： </div>
          <el-date-picker
          v-model="startDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="YYYY-MM-DD HH:mm:ss.SSS"
          style="width: 100%;"
        /></el-config-provider>
      </el-col>
      <el-col :span="24"> <el-config-provider :locale="zhCn">
        <div class="demonstration" style="font-size:17px;">选择结束时间： </div>
        <el-date-picker
          v-model="endDate"
          type="datetime"
          placeholder="选择结束时间"
          value-format="YYYY-MM-DD HH:mm:ss.SSS"
          style="width: 100%;"
        /></el-config-provider>   
      </el-col>
    </el-row>

    <el-row v-if="dataAmount === 'choiceDownload'" style="margin-top: 20px;">
      <div class="demonstration" style="font-size:17px;">选择文件： </div>
      <el-row :span="24" style="margin-bottom: 10px;">
            <el-select
              v-model="selectChoiceFiles"
              multiple
              collapse-tags
              placeholder="选择导出文件"
              style="width: 240px">
              <el-option
                v-for="(item, index) in filesToDownload"
                :key="index"
                :label="item"
                :value="item"/>
            </el-select>
      </el-row>
    </el-row>
        <!-- 数据导出页面都需要下面展示的格式类型-->
    <br />
        <el-col>
          <el-checkbox-group v-model="dataFormat">
            <el-checkbox label="csv 格式" value="csv" />
            <el-checkbox label="xlsx 格式" value="xlsx" />
            <el-checkbox label="xls 格式" value="xls" />
            <el-checkbox label="txt 格式" value="txt" />
          </el-checkbox-group>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="exportFileBrowser = false">取消</el-button>
        <el-button 
        type="primary" 
        @click="exportData">
          确认
        </el-button>
      </template>
</el-dialog>
<!-- 数据导出部分结束 -->
<el-dialog v-model="deleteFileBrowser" title="删除文件" width="30vw">
  <el-row :span="24" style="margin-bottom: 10px;">
  </el-row>
      <el-row>
      <div class="demonstration" style="font-size:17px;">选择文件： </div>
      <el-tooltip :content=" '可多选删除'" placement="right-start">
            <el-select
              v-model="selectDeleteFiles"
              multiple
              collapse-tags
              placeholder="选择要删除的文件"
              style="width: 60%">
              <el-option
                v-for="(item, index) in filesToDownload"
                :key="index"
                :label="item"
                :value="item"/>
            </el-select>
          </el-tooltip>
      </el-row>
    
      <template #footer>
        <el-button @click="deleteFileBrowser = false">取消</el-button>
        <el-button type="primary" @click=" deleteFile">
          确认
        </el-button>
      </template>
</el-dialog>


<el-dialog v-model="renameFileBrowser" title="重命名" width="30vw">

    <el-row>
      <div class="demonstration" style="font-size:17px;">选择文件： </div>
      <!-- v-for="(item, index) in filesToDownload" 
        v-for="(item, index) in testFiles"-->
      
    <el-select
              v-model="selectRenameFileName"
              collapse-tags
              placeholder="选择要改名文件"
              style="width: 240px">
              <el-option
               v-for="(item, index) in filesToDownload"
                :key="index"
                :label="item"
                :value="item"/>
            </el-select>
      
    </el-row>
    
    <br />
     <el-tooltip :content="selectRenameFileName || '请选择一个文件'" placement="right-start">
      <el-row>
              <el-input
                v-model="newFileName"
                placeholder="请输入新文件名"
              ></el-input>
     
          </el-row>
        </el-tooltip>
        <template #footer>
          <el-button @click="renameFileBrowser = false">取消</el-button>
          <el-button type="primary" @click="confirmRenameFile">
            确认
          </el-button>
        </template>
</el-dialog>


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
<!-- ****************************************************************************************************** -->
  <!-- 文件上传进度框 -->
  <el-dialog title="文件上传" v-model="FileFlowPrompt" width="25%">
    <el-steps :space="200" :active="1" finish-status="success">
      <el-step title="文件准备完成"></el-step>
      <el-step title="文件上传中"></el-step>
      <el-step title="文件上传完成"></el-step>
    </el-steps>
  </el-dialog>
  <el-dialog
    v-model="UpgradeConfirmation"
    title="是否升级系统"
    width="30%"
    center>
    <br />
    <span slot="footer" class="dialog-footer" >
      <el-button @click="UpgradeConfirmation=false" style="text-align: center;">取 消</el-button>
      <el-button type="primary" @click=escalationSignal() style="text-align: center;">确 定</el-button>
    </span>
  </el-dialog>
  <el-dialog
    v-model="updating"
    title="系统升级中，请勿关机!!!"
    width="30%"
    center>
  </el-dialog>
  <el-dialog
    v-model="upgradeFailure"
    title="升级失败！！!"
  >
    <br />
    <span slot="footer" class="dialog-footer" >
      <el-button @click="upgradeFailure=false" style="text-align: center;">确 定</el-button>
    </span>
  </el-dialog>

<!-- ****************************************************************************************************** -->
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
import { onMounted,
   ref,
   watch,
  } from "vue";
import { useAuthStore } from "@/stores/auth";
import bcrypt from "bcryptjs";
import axios from "axios";
import { ElMessage } from "element-plus";
//导入日期选择器中文包
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { saveAs } from "file-saver";//下载文件功能pnpm install file-saver
import * as XLSX from "@e965/xlsx"// 导入xlsx包
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

/* *******************************用户管理 开始**************************************** */
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
      newUserForm.value.password, 10 );

    // 将用户名和加密后的密码写入文件
    const jsonObject: { [key: string]: any } = {};
    jsonObject["username"] = newUserForm.value.username;
    jsonObject["password"] = hashedPassword;
    authStore.appendToFile( jsonObject );

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
const selectedUser = ref(0)
// 修改密码对话框中过滤掉admin
const openChangePasswordDialog = async (): Promise<void> => {
  changePasswordDialogVisible.value = true;
  userList.value = (
    await authStore.fetchFileContent("/login/user_list.txt"));
  // ).filter((user) => user !== "admin");
};

const changePassword = async (): Promise<void> => {
  loading.value = true;
  try {
    const jsonObject: { [key: string]: any } = {};
    jsonObject["username"] = userList.value[Number(selectedUser.value)];
    // 生成bcrypt加密的新密码
    jsonObject["newPassword"] = await bcrypt.hash(newPassword.value, 4);
    if (authStore.websocket) {
    const func1: { [key: string]: any } = {};
    func1["changePassword"] = jsonObject;
    const Func: { [key: string]: any } = {};
    Func["usermanager"] = func1;
    const Func1: { [key: string]: any } = {};
    Func1["deviceManagement"] = Func;
    const func: { [key: string]: any } = {};
    func["func"] = Func1;
      (authStore.websocket as WebSocket).send(JSON.stringify(func));
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
    jsonObject["deleteUser"] = userList.value[Number(selectedUser.value)];
    if (authStore.websocket) {
    const Func: { [key: string]: any } = {};
    Func["usermanager"] = jsonObject;
    const Func1: { [key: string]: any } = {};
    Func1["deviceManagement"] = Func;
    const func: { [key: string]: any } = {};
    func["func"] = Func1;
      (authStore.websocket as WebSocket).send(JSON.stringify(func));
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

/* *******************************用户管理 结束**************************************** */

/* *******************************网络设置 开始**************************************** */

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
  const jsonObject = { ipAddress: newIPAddress.value };
  if (authStore.websocket) {
  const Func: { [key: string]: any } = {};
  Func["networkSettings"] = jsonObject;
  const Func1: { [key: string]: any } = {};
  Func1["deviceManagement"] = Func;
  const func: { [key: string]: any } = {};
  func["func"] = Func1;
    (authStore.websocket as WebSocket).send(JSON.stringify(func));
  }

  authStore.websiteIP = newIPAddress.value;
  // 这里要等待服务区传回删除用户的信息后才可以！
  ElMessage.success("IP地址已重新设置！");
  resetIPDialogVisible.value = false;
};

/* *******************************网络设置 结束**************************************** */


/* *******************************文件管理 开始**************************************** */




  //++++++++++++++++++++++++++++++++++++++++++++++数据导出功能开始++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const exportFileBrowser = ref<boolean>(false);    //数据导出的二次  确认/取消  信号
const dataAmount = ref<string>("all");
const dataFormat = ref<string[]>(["csv"]);
//导出开始时间
const startDate = ref<String | null>(null);
//导出结束时间
const endDate = ref<String | null>(null);
// 导出数据
const baseUrl = `http://${authStore.websiteIP}`; // 基础 URL
// const baseUrl = "http://192.168.137.99"; // 基础 URL
const fileListUrls =  ref<string[]>([]);
const tempKeyFilesToDownload = ref<  {[username: string]: string[];}>({});//存储用户名和对应文件列表的json对象
const filesToDownload = ref<string[]>([]); // 全部文件列表
const filteredFiles = ref<string[]>([]);//时间过滤后的文件列表
const selectChoiceFiles = ref<string[]>([]);//选择导出的文件列表
const fileDownloadUrls= ref<string[]>([]);//存储对应下载的url数组


/*
函数作用：分管理员和普通用户，管理员能够查看所有文件列表，普通用户只能查看自己的文件列表
函数返回值：将用户名作为键，文件列表作为值，添加到tempKeyFilesToDownload对象中
1、获取读取列表的url 
2、获取用户名和文件名的键值对tempKeyFilesToDownload   
3、获取全部文件列表存储到数组filesToDownload
----------------------需要注意后端是否有正确将数据存储到对应用户文件夹下
*/
const getAllFileList = async ( ) => {
  // 获取文件列表之前初始化数据
  fileListUrls.value = []; 
  tempKeyFilesToDownload.value= {};
  filesToDownload.value = [];
 // 如果是管理员，遍历所有用户的文件
 if (isAdmin) {
    try {
      // 获取含有数据文件的用户名列表
      const response= await fetch( `${baseUrl}/listfiles`);
      const fileusersList =await response.json();// 从URL读取的json数据读取用户列表{files: ["admin", "user1", "user2"]}
     
      // 遍历每个用户，添加文件 URL
      fileusersList.files.forEach((user: any) => {
      const url = `${baseUrl}/listfiles/${user}`;
      fileListUrls.value.push(url);
      });
        for(const url of fileListUrls.value){
        const response = await fetch(url);
        const data = await response.json();
      //生成json数据，用户名：文件名
      const match = url.match(/\/listfiles\/(\w+)/); // 提取用户名
      if (match && match[1]) {
       const username = match[1];
        tempKeyFilesToDownload.value[username] = data.files;
        // 将用户名作为键，文件列表作为值，添加到tempKeyFilesToDownload对象中
      }
    }
 
    // 遍历 tempKeyFilesToDownload 对象，将文件列表合并到 filesToDownload 中
    Object.values(tempKeyFilesToDownload.value).forEach(fileList => {
    // 过滤出所有以 .csv 结尾的文件并合并到 filesToDownload 中
    filesToDownload.value.push(...fileList.filter((file: string) => {
      return file.endsWith(".csv") &&!filesToDownload.value.includes(file);//includes确保不会重复添加
    }));
    });
 
    return tempKeyFilesToDownload;
    } catch (error) {
      console.error("获取用户列表失败:", error);
      return []; // 如果获取失败，返回空数组
    }
  } else {    // 普通用户只能查看自己的文件
  fileListUrls.value = []; 
  tempKeyFilesToDownload.value= {};
    const url = `${baseUrl}/listfiles/${storedUsername}`;
    fileListUrls.value.push(url);
        const response = await fetch(url);
        const data = await response.json();
      //生成json数据，用户名：文件名
      const match = url.match(/\/listfiles\/(\w+)/); // 提取用户名
      if (match && match[1]) {
       const username = match[1];
        tempKeyFilesToDownload.value[username] = data.files;
      }
    
      // 遍历 tempKeyFilesToDownload 对象，将文件列表合并到 filesToDownload 中
      Object.values(tempKeyFilesToDownload.value).forEach(fileList => {
    // 过滤出所有以 .csv 结尾的文件并合并到 filesToDownload 中
    filesToDownload.value.push(...fileList.filter((file: string) => {
      return file.endsWith(".csv") &&!filesToDownload.value.includes(file);//includes确保不会重复添加
    }));
    });
   
    return tempKeyFilesToDownload;
  }
}

/*
函数作用：筛选文件列表时调用的 日期检查函数，检查是否在时间范围内以及结束时间大于开始时间
函数返回值：true/false
*/

 //
 const checkDateRange = () => {
  if (!startDate.value || !endDate.value) {
    ElMessage.error('请填写完整的开始时间和结束时间！');
    return false; 
  }else if(endDate.value < startDate.value){
    ElMessage.error('结束时间必须大于开始时间！');
    return false;
  }else {
     //日期检查通过

     return true;
  }
};
    
/*
函数作用：筛选文件列表时先调用的checkDateRange函数，然后调用filterFilesByDate函数，根据选择的时间范围筛选文件列表
1、跟模具选择的日期范围，转化为ISO 8601格式
2、提取csv文件名称中的时间段----用于与当前选择过滤范围的 ISO 8601 格式的日期进行比较
3、将筛选后的文件列表存储到fileDate数组中
*/

const filterFilesByDate = (): void => {
  //检查时间筛选范围
  checkDateRange();
 //转换时间为 ISO 8601 格式
 const start = new Date((startDate.value || "").replace(" ", "T"));
  const end = new Date((endDate.value || "").replace(" ", "T"));
  
  filteredFiles.value = filesToDownload.value.filter((fileName) => {
    const match = fileName.match(/_(\d{8}_\d{6})_/); // 提取时间段，例如 20241118_092438
   
    if (match) {
      const fileDateStr = match[1];
      const fileDate = new Date(
        `${fileDateStr.slice(0, 4)}-${fileDateStr.slice(4, 6)}-${fileDateStr.slice(6, 8)}T${fileDateStr.slice(9, 11)}:${fileDateStr.slice(11, 13)}:${fileDateStr.slice(13)}`
      );
      return fileDate >= start && fileDate <= end;
    }
    return false;
  });
};


/*
函数作用：
1、调用getAllFileList();//等待获取tempKeyFilesToDownload、FilesToDownload的值
2、遍历键值对{username:filename},生成下载url数组fileDownloadUrls
函数返回值：fileDownloadUrls存储的是对应文件下载的url地址的数组
*/

const fetchFileList = async (): Promise<void> => {
await  getAllFileList();//等待获取tempKeyFilesToDownload、FilesToDownload:
fileDownloadUrls.value = [];
  try {
 
     // 遍历 tempKeyFilesToDownload 中的每个用户
     for (const username in tempKeyFilesToDownload.value) {
      if (tempKeyFilesToDownload.value.hasOwnProperty(username)) {
        const files = tempKeyFilesToDownload.value[username];
 
        // 遍历用户的文件列表，为每个文件生成下载 URL
        files.forEach((file: string) => {
          const downloadUrl = `${baseUrl}/download/${username}/${file}`;
          
          fileDownloadUrls.value.push(downloadUrl);  // 将生成的 URL 添加到 fileDownloadUrls 数组中
        });
      }
    }
  } catch (error) {
    console.error("获取文件列表失败：", error);
  }
};

/**
 * 函数作用：
 * 1、提供url下载链接，读取内容，解析为二维数组，根据选择的format格式导出文件
 * @param url 下载的url链接fetchFileList函数中获取，将值存储到fileDownloadUrls
 * @param format 导出格式
 */
// 下载并转换文件
const downloadAndConvert = async (url: string, format: string) => {
  try {
  
    // 1. 下载文件
    const response = await fetch(url);
    const fileContent = await response.text(); 

    // 2. 将 CSV 内容解析为二维数组
    const rows = fileContent.split("\n").map((line) => line.split(","));

    // 3. 根据格式导出文件
    const fileName = url.split("/").pop()?.replace(".csv", "") || "downloaded_file";
    switch (format) {
      case "csv":
        exportAsCsv(rows, fileName);
        break;
      case "xlsx":
        exportAsXlsx(rows, fileName);
        break;
      case "xls":
        exportAsXls(rows, fileName);
        break;
      case "txt":
        exportAsTxt(rows, fileName);
        break; 
    }
  } catch (error) {
    console.error("文件下载或转换失败：", error);
  }
};

// 导出为 CSV
const exportAsCsv = (data: string[][], fileName: string): void => {
  const csvContent = data.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${fileName}.csv`);
};

// 导出为 XLSX
const exportAsXlsx = (data: string[][], fileName: string): void => {
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const xlsxBlob = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([xlsxBlob], { type: "application/octet-stream" }), `${fileName}.xlsx`);
};

// 导出为 XLS
const exportAsXls = (data: string[][], fileName: string): void => {
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const xlsBlob = XLSX.write(workbook, { bookType: "xls", type: "array" });
  saveAs(new Blob([xlsBlob], { type: "application/octet-stream" }), `${fileName}.xls`);
};

// 导出为 TXT
const exportAsTxt = (data: string[][], fileName: string): void => {
  const txtContent = data.map((row) => row.join("\t")).join("\n");
  const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
  saveAs(blob, `${fileName}.txt`);
};



/**
 * 批量下载功能，全部下载和按时间段下载会调用此功能
 * @param files 传递文件名数组
 * @param format 传递导出格式
 */
const downloadFiles = async (files: string[], format: string) => {
  try {
    //循环比较文件名和URL最后的文件名，匹配后下载
    for (let file of files) {
    //获取URL的匹配的文件名
      const matchingUrls = fileDownloadUrls.value.filter(url => {
        const filename = url.split('/').pop();
        return filename === file ; // Match filename and format
      });
    // 如果找到了匹配的 URL，开始下载和转换
    if (matchingUrls.length > 0) {
        for (let url of matchingUrls) {
         
          // 调用 downloadAndConvert 函数进行文件下载和格式转换
          await downloadAndConvert(url, format);
        }
      }
    }
  } catch (error) {
    console.error("下载文件错误:", error);
  }

};

/**
 * 函数作用：全部下载导出功能实现
 * 参数：导出格式类型，再传递给downloadFiles函数
  */   
const downloadAll = async (format: string) => {
  await fetchFileList(); // 更新文件列表
  await downloadFiles(filesToDownload.value, format);
  // filesToDownload.value.forEach(async filesToDownloadURL => {
  //   await downloadAndConvert(filesToDownloadURL, format);
  // });
  
  //
};

/**
 * 函数作用：按时间段下载
 * 1、传递文件列表名称，得到在时间范围内的过滤文件列表filteredFiles
 * 2、将过滤后的文件列表传递给downloadFiles函数进行下载和转换
 * @param format 导出格式
 */
const downloadByTime = async (format: string) => {
  await fetchFileList(); // 更新文件列表
  filterFilesByDate();// 
  await downloadFiles(filteredFiles.value, format);

};

/**
 * 函数作用：按选择下载
 * 1、选择的文件列表传递给downloadFiles函数进行下载和转换
 * @param format 导出格式
 */
    const downloadByChoice = async (format: string) => {
      await downloadFiles(selectChoiceFiles.value, format);
    }

 /**
 * 函数作用：点击导出按钮时触发的函数
 * 1、根据dataAmount选择的值，调用三种不同形式的导出函数
 * 2、遍历 format 导出格式，根据选择的文件类型进行下载
 */   
  const exportData = async (): Promise<void> => {
  
   //日期检查函数，检查是否在时间范围内以及结束时间大于开始时间 exportAsXls(data, fileNameWithoutExt);
   if(dataAmount.value === 'all'){ 
    if(filesToDownload.value.length==0){ElMessage.error("没有数据！")}else{ 
      dataFormat.value.forEach(format => { downloadAll(format);   });
    ElMessage.success('导出成功');}
 
      }else if(dataAmount.value === 'time'){
        checkDateRange();//先检查日期是否符合条件
        filterFilesByDate() ;//先过滤文件列表，再导出
        if(filteredFiles.value.length === 0){ElMessage.error('没有符合的数据，无法导出');
        }else{   dataFormat.value.forEach(format => {downloadByTime(format);});  ElMessage.success('导出成功'); }
    }else if(dataAmount.value=='choiceDownload'){
      if(selectChoiceFiles.value.length === 0){ElMessage.error('没有选择文件，无法导出');
    }else if(dataAmount.value=='choiceDownload'){
      dataFormat.value.forEach(format => {downloadByChoice(format);});  ElMessage.success('导出成功')
    }
      selectChoiceFiles.value = [];// 清空选择列表
    }
    await fetchFileList();
  }

// 加载页面时自动读取文件列表
  onMounted(async () => {
      // 获取文件列表 URL
      await fetchFileList();
      await deleteFilesUrls();
  });


//++++++++++++++++++++++++++++++++++++++++++++++数据导出功能结束++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++选择文件删除或者重命名开始++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const deleteFileBrowser = ref<boolean>(false);    //数据导出的二次  确认/取消  信号
const renameFileBrowser = ref<boolean>(false);    //重命名的二次  确认/取消  信号selectDeleteFiles
const selectDeleteFiles = ref<string[]>([]);//选择删除的的文件列表
  const fileDeleteUrls = ref<string[]>([]);//选择删除的的文件列表
 /**
 * 函数作用：获取删除URL数组列表
 * 1、根据tempKeyFilesToDownload的键值对，将键名和值进行匹配，生成删除URL
 */   
  const deleteFilesUrls= async () => {
   await getAllFileList();
    for (const username in tempKeyFilesToDownload.value) {
  if (tempKeyFilesToDownload.value.hasOwnProperty(username)) {
    const userFiles = tempKeyFilesToDownload.value[username];
    // console.log(`Processing user: ${username}, files: ${userFiles}`);
    userFiles.forEach((file: string) => {
      const deleteUrl = `${baseUrl}/delete/${username}/${file}`;
      // console.log(`Generated delete URL: ${deleteUrl}`);
      fileDeleteUrls.value.push(deleteUrl);
    });
  }
}    
}
     
  
 /**
 * 函数作用：删除功能
 * 1、deleteFilesUrls，获取 删除URL数组
 * 2、遍历files文件列表，将 删除URL数组 通过过滤功能将最后一个/后的字符 和传递的文件名files进行匹配，匹配成功暂时存储到matchingUrls
 * 3.如果matchingUrls的长度大于0，开始执行删除，通过遍历matchingUrls然后fetch相应的url，删除成功后弹出提示信息
 * @param files 传递的文件名数组
  */   

const deleteFiles = async (files: string[]) => {
  await deleteFilesUrls();
  console.log("fileDeleteUrls.value",fileDeleteUrls.value)
    try {

      for(let file of files ){
      //获取匹配的文件名
      const matchingUrls = fileDeleteUrls.value.filter(url => {
        const filename = url.split('/').pop();
        return filename === file ; // Match filename and format
      });

      // 如果找到了匹配的 URL，开始删除
      if(matchingUrls.length > 0) {
        for(let url of matchingUrls) {
          await fetch(url, {
            method: "DELETE",
          });
        }ElMessage.success(`文件 ${file} 删除成功`);
      }else{ElMessage.error(`文件 ${file} 删除失败`);}
      }
      }catch (error) {
        console.error("文件删除错误:", error);
      }
    
    }
    

 /**
 * 函数作用：点击删除按钮时触发的函数
 * 1、确认用户是否选择需要删除的的文件，如果没有则selectDeleteFiles.value.length === 0，提示报错
 * 2、调用deleteFiles函数，执行删除操作
 * 3.删除完成后清空选择列表，并更新文件列表
 * 
  */   

const deleteFile = async () => {
  if (selectDeleteFiles.value.length === 0) {
  ElMessage.warning("请选择文件删除");
    return;
  }
  // 等待所有文件删除完成   await不能少，否则会在执行删除前更新完文件列表
  await deleteFiles(selectDeleteFiles.value);
  // 清空选择列表
  selectDeleteFiles.value = [];
  fileDeleteUrls.value=[];
  // 更新文件列表
  await fetchFileList();
};
// ++++++++++++++++++++++++更改文件名+++++++++++++++++
const selectRenameFileName = ref<string>();//选择要更改名字的文件名
const newFileName = ref<string>();//更新文件的新文件名

  watch(selectRenameFileName, (newValue) => {
  newFileName.value = newValue;
});

/**
 * 函数作用：确认重命名功能按钮时触发的功能
 * 1、确认用户是否选择文件名输入新文件名，没有则提示警告
 * 2、遍历循环，获取tempKeyFilesToDownload的用户名和对应的文件名，进行匹配{username：userFiles}
 * 3、username：userFiles里面包含了选择要改名的文件selectRenameFileName，则生成renameFiles
 * 4、将renameFiles填充到func1，func1填充到Func，Func填充到func，最后通过websocket发送给后端
 * 5、更新文件列表
  */   
const confirmRenameFile = async () => {
    if (selectRenameFileName.value && newFileName.value) {
    const renameFiles = [];
    // 遍历 tempKeyFilesToDownload 里的每个用户名和文件列表
    for (const username in tempKeyFilesToDownload.value) {
    if (tempKeyFilesToDownload.value.hasOwnProperty(username)) {
      const userFiles = tempKeyFilesToDownload.value[username];

      // 查找匹配的文件
      if (userFiles.includes(selectRenameFileName.value)) {
        // 文件匹配成功，填充 renameFiles 数组
        renameFiles.push({
          oldFileName: selectRenameFileName.value,
          newFileName: newFileName.value,
          user: username, // 将匹配到的用户名填入 user 字段
        });
        // 可以在找到匹配文件后结束循环，只需要找到一个文件
        break;
      }
    }
  }
    
    if(authStore.websocket){
  const func1: { [key: string]: any } = {};
    func1["renameFiles"] = renameFiles;
    const Func: { [key: string]: any } = {};
    // Func["fileManagement"] = JSON.stringify(func1);
    Func["fileManagement"] = func1;
    const Func1: { [key: string]: any } = {};
    Func1["deviceManagement"] = Func;
    const func: { [key: string]: any } = {};
    func ["func"] = Func1;
    console.log(JSON.stringify(func));
    (authStore.websocket as WebSocket).send(JSON.stringify(func));}
      ElMessage.success("重命名请求已发送")
  }else{
    ElMessage.warning("请选择需要更改的文件名或输入新文件名")
  }
  // 清空选择列表
   selectRenameFileName.value = "";
   await fetchFileList();//更新文件列表
  }




//++++++++++++++++++++++++++++++++++++++++++++++选择文件删除或者重命名结束++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



/* *******************************文件管理 结束**************************************** */


/* *******************************程序升级 开始**************************************** */
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
const FileFlowPrompt = ref<boolean>(false);
const UpgradeConfirmation = ref<boolean>(false);
const updating = ref<boolean>(false);
const upgradeFailure = ref<boolean>(false);

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]; // 获取选择的文件
    // 创建FormData对象，准备上传
    const formData = new FormData();
    formData.append("file", selectedFile.value);
    FileFlowPrompt.value = true;
    try {
      // 使用axios发送文件
      // 需要替换网址为服务器的真实网址！！！！！！！！！！
      // const response = await axios.post(`${authStore.websiteIP}/upload`, formData, {
      const response = await axios.post(`/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      ElMessage.success("文件上传成功！");
      FileFlowPrompt.value = false;
      UpgradeConfirmation.value = true;
    } catch (error) {
      ElMessage.error("文件上传失败：" + error);
      FileFlowPrompt.value = false;
    }
  }
};

function escalationSignal () {
    if (authStore.websocket) {
    const func: { [key: string]: any } = {};
    func["upgrade"] = true;
    const Func: { [key: string]: any } = {};
    Func["deviceManagement"] = JSON.stringify(func);
    const Func1: { [key: string]: any } = {};
    Func1["func"] = Func;
    (authStore.websocket as WebSocket).send(JSON.stringify(Func1));}
    UpgradeConfirmation.value = false;
    updating.value = true;
    setTimeout(()=> {
      updating.value = false;
      upgradeFailure.value = true;
    }, 300*1000);
}

/* *******************************程序升级 结束**************************************** */


/* *******************************设备校准 结束**************************************** */

//待完善


/* *******************************设备校准 结束**************************************** */

/* *******************************重启复位 开始**************************************** */
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
    const func: { [key: string]: any } = {};
    func["reboot"] = JSON.stringify(true);
    const Func: { [key: string]: any } = {};
    Func["deviceManagement"] = func;
    const Func1: { [key: string]: any } = {};
    Func1["func"] = Func;
    (authStore.websocket as WebSocket).send(
      JSON.stringify(Func1),
    );
    ElMessage.success("重启请求已发送！");
  }
  rebootDialogVisible.value = false;
};

// 确认复位
const confirmReset = () => {
  if (authStore.websocket) {
    const func: { [key: string]: any } = {};
    func["reset"] = JSON.stringify(true);
    const Func: { [key: string]: any } = {};
    Func["deviceManagement"] = func;
    const Func1: { [key: string]: any } = {};
    Func1["func"] = Func;
    (authStore.websocket as WebSocket).send(
      JSON.stringify( Func1 ),);
  }
  ElMessage.success("复位请求已发送！");
  resetDialogVisible.value = false;
};
/* *******************************测试复位 结束**************************************** */


</script>

<style scoped></style>
