import { ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import bcrypt from "bcryptjs";

export const useAuthStore = defineStore("auth", () => {
  const isLoggedIn = ref<boolean>(false);
  const localUsername = ref<string>("");
  const router = useRouter();

  // 检查localStorage中是否已经有登录状态
  const storedIsLoggedIn: string | null = localStorage.getItem("isLoggedIn");
  const storedUsername: string | null = localStorage.getItem("localUsername");
  if (storedIsLoggedIn === "true" && storedUsername) {
    isLoggedIn.value = true;
    localUsername.value = storedUsername;
  }

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
  }

  return { isLoggedIn, login, logout };
});
