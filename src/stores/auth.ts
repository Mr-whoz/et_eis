import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import bcrypt from "bcryptjs";

export const useAuthStore = defineStore("auth", () => {
  const isLoggedIn = ref<boolean>(false);
  const localUsername = ref<string>("");
  const router = useRouter();

  const getWebsocketUrl = (): string => {
    if (import.meta.env.MODE === "development") {
      // 开发环境，本地websocket服务器调试
      return "ws://127.0.0.1:5167/ws";
    } else if (import.meta.env.MODE === "production") {
      // 生成环境，嵌入式poco服务器调试
      return "ws://192.168.137.99:5167/ws";
    } else {
      return "";
    }
  };

  let websocket: WebSocket | null = null;

  // 每次刷新页面，下列代码都会重新执行
  // 检查localStorage中是否已经有登录状态
  const storedIsLoggedIn: string | null = localStorage.getItem("isLoggedIn");
  const storedUsername: string | null = localStorage.getItem("localUsername");
  if (storedIsLoggedIn === "true" && storedUsername) {
    isLoggedIn.value = true;
    localUsername.value = storedUsername;
    connectWebSocket(); // 页面加载时重新连接WebSocket
  }

  /* **************************************** 以下是函数部分 **************************************** */

  async function fetchFileContent(filePath: string): Promise<string[]> {
    const response = await fetch(filePath);
    const text = await response.text();
    // 先移除整个文本的首尾空白字符，再按行拆分，并移除每行的首尾空白字符
    return text
      .trim()
      .split("\r\n")
      .map((line) => line.trim());
  }

  async function login(username: string, password: string): Promise<void> {
    try {
      const userList = await fetchFileContent("/login/user_list.txt");
      const passwordList = await fetchFileContent("/login/password_list.txt");

      // 查找用户名是否存在
      const userIndex = userList.indexOf(username);
      if (userIndex === -1) {
        throw new Error("账号不存在！");
      }

      // 获取对应的加密密码
      const hashedPassword: string = passwordList[userIndex];

      // 验证密码
      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        hashedPassword,
      );
      if (isPasswordValid) {
        // 登录成功
        isLoggedIn.value = true;
        localUsername.value = username;
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("localUsername", username);
        await router.push("/status");
        ElMessage.success("登录成功！");
      } else {
        throw new Error("密码错误！");
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "未知错误！");
    }
  }

  function logout(): void {
    isLoggedIn.value = false;
    localUsername.value = "";
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("localUsername");
    disconnectWebSocket();
  }

  // 追加一行到文件末尾
  function appendToFile(fileName: string, content: string): void {
    const jsonObject: { [key: string]: any } = {};
    jsonObject[fileName] = content;
    (websocket as WebSocket).send(JSON.stringify(jsonObject));
  }

  // 连接WebSocket
  function connectWebSocket() {
    if (!websocket || websocket.readyState === WebSocket.CLOSED) {
      websocket = new WebSocket(getWebsocketUrl());

      websocket.onopen = (): void => {
        console.log("WebSocket连接成功");
        ElMessage.success("服务器连接成功！");
      };

      websocket.onmessage = (event): void => {
        console.log("收到WebSocket消息:", event.data);
      };

      websocket.onclose = (): void => {
        console.log("WebSocket已断开");
        websocket = null;
      };

      websocket.onerror = (error): void => {
        console.error("WebSocket错误:", error);
        if (websocket) {
          websocket.close(); // 确保websocket不是null时再关闭连接
        }
      };
    }
  }

  // 断开WebSocket
  function disconnectWebSocket() {
    if (websocket && websocket.readyState !== WebSocket.CLOSED) {
      websocket.close();
    }
  }

  // 当isLoggedIn变化时，连接或断开WebSocket
  watch(isLoggedIn, (newValue) => {
    if (newValue) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }
  });

  return {
    isLoggedIn,
    fetchFileContent,
    login,
    logout,
    appendToFile,
    websocket,
  };
});
