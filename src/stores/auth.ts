import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import bcrypt from "bcryptjs";

interface newOption {
  value: string;
  label: string;
}

type workStatusType = "idle" | "running" | "paused" | "error";

export const useAuthStore = defineStore("auth", () => {
  const isLoggedIn = ref<boolean>(false);
  const localUsername = ref<string>("");

  const storedWorkStatus = localStorage.getItem(
    "workStatus",
  ) as workStatusType | null;
  const workStatus = ref<workStatusType>(storedWorkStatus || "idle");

  // 监听 workStatus 的变化，并保存到 localStorage
  watch(workStatus, (newStatus) => {
    localStorage.setItem("workStatus", newStatus);
  });

  // 以下是保存 SettingView 中状态的变量
  const workMode = ref<string>("eis");
  const constantMode = ref<string>("");
  const valueType = ref<string>("");
  const value = ref<string>("");
  const unit = ref<string>("");
  const unitOption = ref<newOption[]>([
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
  ]);
  const currentPeak = ref<string>("");
  const currentPeakUnit = ref<string>("ampere");
  const voltagePeak = ref<string>("");
  const voltagePeakUnit = ref<string>("volt");
  const powerPeak = ref<string>("");
  const powerPeakUnit = ref<string>("watt");
  const startFrequency = ref<string>("");
  const startFrequencyUnit = ref<string>("hertz");
  const endFrequency = ref<string>("");
  const endFrequencyUnit = ref<string>("hertz");
  const stepMode = ref<string>("logarithmicChange");
  const stepValue = ref<string>("");
  const frequencyPointPeriod = ref<string>("");
  const frequencyPointPeriodUnit = ref<string>("millisecond");
  const loopTimes = ref<string>("");
  const collectInterval = ref<string>("");
  const collectIntervalUnit = ref<string>("millisecond");
  const displayInterval = ref<string>("");
  const displayIntervalUnit = ref<string>("second");

  const nyquistPlotData = ref({
    x: [] as number[],
    y: [] as number[],
    text: [] as number[],
  });
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
    loadSettingViewData(); // 页面加载时加载设置数据
    loadNyquistPlotData(); // 页面加载时恢复奈奎斯特图数据
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

  // 更新奈奎斯特图数据
  function updateNyquistPlotData(
    xData: number[],
    yData: number[],
    textData: number[],
  ) {
    nyquistPlotData.value.x = xData;
    nyquistPlotData.value.y = yData;
    nyquistPlotData.value.text = textData;
  }

  // 在 store 中增加保存和加载奈奎斯特图数据到 localStorage 的方法
  function saveNyquistPlotData() {
    localStorage.setItem(
      "nyquistPlotData",
      JSON.stringify(nyquistPlotData.value),
    );
  }

  function loadNyquistPlotData() {
    const savedData = localStorage.getItem("nyquistPlotData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      nyquistPlotData.value.x = parsedData.x;
      nyquistPlotData.value.y = parsedData.y;
      nyquistPlotData.value.text = parsedData.text;
    }
  }

  // 在页面加载时加载数据
  const storedNyquistData = localStorage.getItem("nyquistPlotData");
  if (storedNyquistData) {
    loadNyquistPlotData();
  }

  // 保存 SettingView 的状态到 localStorage
  function saveSettingViewData() {
    const settingViewData = {
      workMode: workMode.value,
      constantMode: constantMode.value,
      valueType: valueType.value,
      value: value.value,
      unit: unit.value,
      unitOption: unitOption.value,
      currentPeak: currentPeak.value,
      currentPeakUnit: currentPeakUnit.value,
      voltagePeak: voltagePeak.value,
      voltagePeakUnit: voltagePeakUnit.value,
      powerPeak: powerPeak.value,
      powerPeakUnit: powerPeakUnit.value,
      startFrequency: startFrequency.value,
      startFrequencyUnit: startFrequencyUnit.value,
      endFrequency: endFrequency.value,
      endFrequencyUnit: endFrequencyUnit.value,
      stepMode: stepMode.value,
      stepValue: stepValue.value,
      frequencyPointPeriod: frequencyPointPeriod.value,
      frequencyPointPeriodUnit: frequencyPointPeriodUnit.value,
      loopTimes: loopTimes.value,
      collectInterval: collectInterval.value,
      collectIntervalUnit: collectIntervalUnit.value,
      displayInterval: displayInterval.value,
      displayIntervalUnit: displayIntervalUnit.value,
    };
    localStorage.setItem("settingViewData", JSON.stringify(settingViewData));
  }

  // 加载 SettingView 的状态从 localStorage
  function loadSettingViewData() {
    const savedData = localStorage.getItem("settingViewData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      workMode.value = parsedData.workMode;
      constantMode.value = parsedData.constantMode;
      valueType.value = parsedData.valueType;
      value.value = parsedData.value;
      unit.value = parsedData.unit;
      unitOption.value = parsedData.unitOption;
      currentPeak.value = parsedData.currentPeak;
      currentPeakUnit.value = parsedData.currentPeakUnit;
      voltagePeak.value = parsedData.voltagePeak;
      voltagePeakUnit.value = parsedData.voltagePeakUnit;
      powerPeak.value = parsedData.powerPeak;
      powerPeakUnit.value = parsedData.powerPeakUnit;
      startFrequency.value = parsedData.startFrequency;
      startFrequencyUnit.value = parsedData.startFrequencyUnit;
      endFrequency.value = parsedData.endFrequency;
      endFrequencyUnit.value = parsedData.endFrequencyUnit;
      stepMode.value = parsedData.stepMode;
      stepValue.value = parsedData.stepValue;
      frequencyPointPeriod.value = parsedData.frequencyPointPeriod;
      frequencyPointPeriodUnit.value = parsedData.frequencyPointPeriodUnit;
      loopTimes.value = parsedData.loopTimes;
      collectInterval.value = parsedData.collectInterval;
      collectIntervalUnit.value = parsedData.collectIntervalUnit;
      displayInterval.value = parsedData.displayInterval;
      displayIntervalUnit.value = parsedData.displayIntervalUnit;
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

  watch(
    [
      workMode,
      constantMode,
      valueType,
      value,
      unit,
      unitOption,
      currentPeak,
      currentPeakUnit,
      voltagePeak,
      voltagePeakUnit,
      powerPeak,
      powerPeakUnit,
      startFrequency,
      startFrequencyUnit,
      endFrequency,
      endFrequencyUnit,
      stepMode,
      stepValue,
      frequencyPointPeriod,
      frequencyPointPeriodUnit,
      loopTimes,
      collectInterval,
      collectIntervalUnit,
      displayInterval,
      displayIntervalUnit,
    ],
    saveSettingViewData,
    { deep: true },
  );

  return {
    isLoggedIn,
    localUsername,

    workStatus,

    workMode,
    constantMode,
    valueType,
    value,
    unit,
    unitOption,
    currentPeak,
    currentPeakUnit,
    voltagePeak,
    voltagePeakUnit,
    powerPeak,
    powerPeakUnit,
    startFrequency,
    startFrequencyUnit,
    endFrequency,
    endFrequencyUnit,
    stepMode,
    stepValue,
    frequencyPointPeriod,
    frequencyPointPeriodUnit,
    loopTimes,
    collectInterval,
    collectIntervalUnit,
    displayInterval,
    displayIntervalUnit,

    fetchFileContent,
    login,
    logout,
    appendToFile,
    websocket,
    nyquistPlotData,
    updateNyquistPlotData,
    saveNyquistPlotData,
    loadNyquistPlotData,
  };
});
