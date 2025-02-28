<template>
  <!-- ---------------------------------------- 第1行组件 开始 ---------------------------------------- -->
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card header="工作状态" style="height: 20vh">
        <el-row style="display: flex; align-items: center">
          <el-col :span="2">
            <el-icon :color="workStatusIconColor" size="5vh">
              <component :is="workStatusIcon" />
            </el-icon>
          </el-col>
          <el-col :span="2">
            <el-tag
              disable-transitions
              :type="workStatusTagType"
              size="large"
              style="font-size: 2.5vh"
              >{{ workStatusTag }}
            </el-tag>
          </el-col>
          <el-col :span="20"><!-- 纯占位，无意义 --></el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card header="状态设置" style="height: 20vh">
        <el-row>
          <el-col :span="6">
            <el-button
              type="primary"
              size="large"
              style="font-size: 2.5vh"
              @click="
                dialogVisible = true;
                newAction = 'continue';
              "
              >继续
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              type="warning"
              size="large"
              style="font-size: 2.5vh"
              @click="
                dialogVisible = true;
                newAction = 'pause';
              "
              >暂停
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              type="danger"
              size="large"
              style="font-size: 2.5vh"
              @click="
                dialogVisible = true;
                newAction = 'stop';
              "
              >停止
            </el-button>
          </el-col>
          <el-col :span="6"><!-- 纯占位，无意义 --></el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- ---------------------------------------- 第1行组件 结束 ---------------------------------------- -->
  <br />
  <!-- ---------------------------------------- 第2行组件 开始 ---------------------------------------- -->
  <el-row>
    <el-col>
      <el-card header="测试参数">
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col>开始时间：{{ startTime }}</el-col>
            </el-row>
            <el-row>
              <el-col>经过时间：{{ elapsedTime }}</el-col>
            </el-row>
            <el-row>
              <el-col>当前时间：{{ currentTime }}</el-col>
            </el-row>
            <el-row>
              <el-col
                >循环次数：当前轮数：{{ currentCycle }}，已完成轮数：{{ doneCycle }},
                总轮数：{{ totalCycle }}
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col>电流：{{ current }} {{ currentUnit }}</el-col>
            </el-row>
            <el-row>
              <el-col>电压：{{ voltage }} {{ voltageUnit }}</el-col>
            </el-row>
            <el-row>
              <el-col>功率：{{ power }} {{ powerUnit }}</el-col>
            </el-row>
            <el-row>
              <el-col>频率：{{ frequency }} {{ frequencyUnit }}</el-col>
            </el-row>
            <el-row>
              <el-col
                >采集周期：{{ collectInterval }}
                {{ collectIntervalUnit }}
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- ---------------------------------------- 第2行组件 结束 ---------------------------------------- -->
  <br />
  <!-- ---------------------------------------- 第3行组件 开始 ---------------------------------------- -->
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card header="设备保护门限" style="height: 22.5vh">
        <el-row>
          <el-col>电流峰值：{{ maxCurrent }} {{ maxCurrentUnit }}</el-col>
        </el-row>
        <el-row>
          <el-col>电压峰值：{{ maxVoltage }} {{ maxVoltageUnit }}</el-col>
        </el-row>
        <el-row>
          <el-col>功率峰值：{{ maxPower }} {{ maxPowerUnit }}</el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card header="设备参数" style="height: 22.5vh" s>
        <el-row>
          <el-col>设备型号：{{ deviceType }}</el-col>
          <el-col>系统版本号：{{ DeviceVersionNumber }}</el-col>
        </el-row>
        <el-row>
          <el-col
            >存储空间：已使用 {{ usedSpace }}  G ，剩余 {{ remainingSpace }} G
            ，总共 {{ totalSpace }} G
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- ---------------------------------------- 第3行组件 结束 ---------------------------------------- -->

  <!-- 弹出对话框二次确认 -->
  <el-dialog v-model="dialogVisible" title="二次确认" width="30vw">
    <el-text size="large"
      >{{
        "当前状态：" +
        workStatusText +
        "，确定要执行操作：" +
        newActionText +
        " 吗？"
      }}
    </el-text>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        @click="
          dialogVisible = false;
          setWorkStatus(newAction);
        "
      >
        确认
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  type Component,
  watch,
  onBeforeUnmount,
} from "vue";
import {
  CircleCloseFilled,
  Promotion,
  SuccessFilled,
  WarningFilled,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useAuthStore } from "@/stores/auth";

dayjs.extend(duration);
const authStore = useAuthStore();

/* **************************************** 第1行组件 开始 **************************************** */
// type workStatusType = "idle" | "running" | "paused" | "error" | "finish";

// // 定义 workStatus 的时候，先从 localStorage 获取
// const storedWorkStatus = localStorage.getItem(
//   "workStatus",
// ) as workStatusType;
// 定义一个 ref 变量，用于存储 workStatus 的值
// const workStatus = ref<workStatusType>(storedWorkStatus || "idle");
  const workStatus = computed({
  get: () => authStore.workStatus,
  set: (value) => {
    authStore.workStatus = value;
  },
});



// 动态计算 icon 组件
const workStatusIcon = computed((): Component => {
  switch (workStatus.value) {
    case "idle":
      return SuccessFilled;
    case "finish":
      return SuccessFilled;
    case "running":
      return Promotion;
    case "paused":
      return WarningFilled;
    case "error":
      return CircleCloseFilled;
  }
});

// 动态计算 icon 颜色
const workStatusIconColor = computed((): string => {
  switch (workStatus.value) {
    case "idle":
      return "#67C23A";
    case "finish":
      return "#67C23A";
    case "running":
      return "#409EFF";
    case "paused":
      return "#E6A23C";
    case "error":
      return "#F56C6C";
  }
});

// 动态计算 tag 文本
const workStatusTag = computed((): string => {
  switch (workStatus.value) {
    case "idle":
      return "空闲";
    case "finish":
      return "完成";
    case "running":
      return "运行";
    case "paused":
      return "暂停";
    case "error":
      return "异常";
 
  }
});
/**
 * 动态计算 tag 类型----根据workStatus.value值自动计算  computed函数
 * 空闲：success
 * 完成：accomplish
 * 运行：primary
 * 暂停：warning
 * 异常：danger 
 * 
 */
const workStatusTagType = computed((): string => {
  switch (workStatus.value) {
    case "idle":
      return "success";
    case "finish":
      return "accomplish";
    case "running":
      return "primary";
    case "paused":
      return "warning";
    case "error":
      return "danger";
 
  }
});

// 设置workStatus
// 正常来说只会设置idle、running、paused这三个状态，error状态是出现异常时才设置的
const setWorkStatus = (newAction: string): void => {
  switch (workStatus.value) {
    case "idle":
      switch (newAction) {
        case "continue":
          ElMessage("当前是空闲状态，无需继续");
          break;
        case "pause":
          ElMessage("当前是空闲状态，无需暂停");
          break;
        case "stop":
          ElMessage("当前是空闲状态，无需停止");
          break;
        default:
          ElMessage.warning("变量newAction设置出错！");
      }
      break;
    case "running":
      switch (newAction) {
        case "continue":
          ElMessage("当前是运行状态，无需继续");
          break;
        case "pause":
          ElMessage.success("已经暂停");
          workStatus.value = "paused";
          setPauseWorkTime()
          // 暂停测试相关的代码
          break;
        case "stop":
          ElMessage.success("已经停止");
          workStatus.value = "idle";
          startTimestamp.value = 0;
          authStore.testStart = false;
          setEndWorkTime();
          // 停止测试相关的代码
          break;
        default:
          ElMessage.warning("变量newAction设置出错！");
      }
      break;
    case "paused":
      switch (newAction) {
        case "continue":
          ElMessage.success("已经继续");
          workStatus.value = "running";
          setStartWorkTime();
          // 继续测试相关的代码
          break;
        case "pause":
          ElMessage("当前是暂停状态，无需暂停");
          break;
        case "stop":
          ElMessage.success("已经停止");
          workStatus.value = "idle";
          startTimestamp.value = 0;
          authStore.testStart = false;
          setEndWorkTime();
          // 停止测试相关的代码
          break;
        default:
          ElMessage.warning("变量newAction设置出错！");
      }
      break;
    case "error":
      switch (newAction) {
        case "continue":
          ElMessage("当前是异常状态，无法继续");
          break;
        case "pause":
          ElMessage.success("已经停止");
          workStatus.value = "idle";
          startTimestamp.value = 0;
          authStore.testStart = false;
          setEndWorkTime();
          // 停止测试相关的代码
          break;
        case "stop":
          ElMessage.success("已经停止");
          workStatus.value = "idle";
          startTimestamp.value = 0;
          authStore.testStart = false;
          setEndWorkTime();
          // 停止测试相关的代码
          break;
        default:
          ElMessage.warning("变量newAction设置出错！");
      }
      break;
    default:
      ElMessage.warning("变量workStatus设置出错！");
  }
};

const jsonObject: { [key: string]: any } = {}
const Func: { [key: string]: any } = {};
const setStartWorkTime = (): void => {
  shouldSetElapsedTime.value = true;
  jsonObject["action"] = "continue";
  Func["func"] = (jsonObject);
  if (authStore.websocket) {
    (authStore.websocket as WebSocket).send( JSON.stringify(Func))
  }
  authStore.workStatus = "running";
};
const setEndWorkTime = (): void => {
  jsonObject["action"] = "cancel";
  Func["func"] = (jsonObject);
  if (authStore.websocket) {
    (authStore.websocket as WebSocket).send( JSON.stringify(Func))
  }
  authStore.workStatus = "idle";
};
const setPauseWorkTime = (): void => {
  jsonObject["action"] = "pause";
  Func["func"] = (jsonObject);
  if (authStore.websocket) {
    (authStore.websocket as WebSocket).send(JSON.stringify(Func))
  }
  authStore.workStatus = "paused";
};
const newAction = ref<string>("");
/* **************************************** 第1行组件 结束 **************************************** */

/* **************************************** 第2行组件 开始 **************************************** */
const current = computed({
  get: () => authStore.current,
  set: (value: number) => Number(authStore.current = Number(value)),
});
const currentUnit = ref<string>("安/A");

const voltage = computed({
  get: () => authStore.voltage,
  set: (value: number) => Number(authStore.voltage = Number(value)),
});
const voltageUnit = ref<string>("伏/V");

const power = computed({
  get: () => authStore.power,
  set: (value: number) => Number(authStore.power = Number(value)),
});
const powerUnit = ref<string>("瓦/W");

const frequency = computed({
  get: () => authStore.frequency,
  set: (value: number) => Number(authStore.frequency = Number(value)),
});
const frequencyUnit = ref<string>("赫兹/Hz");

// const collectInterval = ref<number>(0);
// const collectIntervalUnit = ref<string>("毫秒/ms");
  const collectInterval = computed({
  get: () => authStore.collectInterval,
  set: (value: string) => (authStore.collectInterval = value),
});
const collectIntervalUnit = computed({
  get: () => authStore.collectIntervalUnit,
  set: (value: string) => (authStore.collectIntervalUnit = value),
});
const totalCycle = computed( () => authStore.loopTimes );
const currentCycle = computed( () => authStore.currentCycle );
const doneCycle = computed( () => ((currentCycle.value - 1) >= 0 ? (currentCycle.value - 1) : 0 ));

const currentTimestamp = ref<number>(0);
const startTimestamp = computed({
  get: () => authStore.testStartTime,
  set: (value: number) => Number(authStore.testStartTime = Number(value)),
});

const elapsedTimestamp = ref<number>(0);
const currentTime = ref<string>("");

const shouldSetElapsedTime = computed({
  get: () => authStore.testStart,
  set: (value:boolean) => (authStore.testStart = (value)),
});


// 定义 elapsedTime 的时候，先从 localStorage 获取
const elapsedTime1 = localStorage.getItem("elapsedTime",);
const elapsedTime = ref(elapsedTime1 || "");
  // 监听 elapsedTime 的变化
watch(elapsedTime, (newStatus) => {
  localStorage.setItem("elapsedTime", newStatus);
});
const startTime = ref<string>("");



/*功能：设置当前时间和间隔时间
* 1. 从本地存储获取开始时间
* 2.将当前时间转化为特定日期格式
* 3.计算间隔时间
* 4.调用setElapsedTime()函数设置间隔时间
*/
const setCurrentTimeAndElapsedTime = (): void => {
  if (authStore.isConnected) {
    const startTime1 = authStore.testStartTime;
    startTime.value = dayjs(startTime1).format("YYYY-MM-DD HH:mm:ss");
    if (authStore.testStart) {
      shouldSetElapsedTime.value = authStore.testStart;
    // 从本地存储获取时间戳
  }
    currentTimestamp.value = dayjs().valueOf();
    currentTime.value = dayjs(currentTimestamp.value).format(
      "YYYY-MM-DD HH:mm:ss",
    );
    // 更新 elapsedTime
    if (startTimestamp.value !== 0 ) {
      if (workStatus.value === "running" || workStatus.value === "paused") {
        if (shouldSetElapsedTime.value) {
          setElapsedTime(); 
        }
      }
    }
  }
};

let intervalId: number = 0;
//钩子函数，使得每隔一秒获取一次当前的时间
onMounted(() => {
  intervalId = window.setInterval(setCurrentTimeAndElapsedTime, 1000);
});
onUnmounted(() => {
  clearInterval(intervalId);
});


//处于测试状态时，将测试状态设置为true
if(workStatus.value==="running"){
  authStore.testStart=true
}



//经过时间的计算，需要放在开始时间之后，因为要通过开始时间的值来计算经过时间
const setElapsedTime = (): void => {
  elapsedTimestamp.value = currentTimestamp.value - startTimestamp.value;
  elapsedTime.value = dayjs.duration(elapsedTimestamp.value).format("HH:mm:ss");
};

/* **************************************** 第2行组件 结束 **************************************** */

/* **************************************** 第3行组件 开始 **************************************** */
const maxCurrent = computed({
  get: () => authStore.currentPeak,
  set: (value: number) => Number(authStore.currentPeak = String(value)),
});
const maxCurrentUnit = ref<string>("安/A");

const maxVoltage = computed({
  get: () => authStore.voltagePeak,
  set: (value: number) => Number(authStore.voltagePeak = String(value)),
});
const maxVoltageUnit = ref<string>("伏/V");

const maxPower = computed({
  get: () => authStore.powerPeak,
  set: (value: number) => Number(authStore.powerPeak = String(value)),
});
const maxPowerUnit = ref<string>("瓦/W");

const deviceType = ref<string>("ET-PEK010");

const usedSpace = computed( () => authStore.usedSpace ?? 0 );
const remainingSpace = computed( () => authStore.freeSpace ?? 0);
const totalSpace = ref( (usedSpace.value + remainingSpace.value) !== 0 ? 
                  (usedSpace.value + remainingSpace.value).toFixed(2) : 0 )

const DeviceVersionNumber = computed({
  get: () => authStore.DeviceVersionNumber,
  set: (value: string) => Number(authStore.DeviceVersionNumber = String(value)),
});

/* **************************************** 第3行组件 结束 **************************************** */

const dialogVisible = ref<boolean>(false);

const workStatusText = computed((): string => {
  switch (workStatus.value) {
    case "idle":
      return "空闲";
    case "running":
      return "运行";
    case "paused":
      return "暂停";
    case "error":
      return "异常";
    default:
      return "未知";
  }
});

const newActionText = computed((): string => {
  switch (newAction.value) {
    case "continue":
      return "继续";
    case "pause":
      return "暂停";
    case "stop":
      return "停止";
    default:
      return "未知";
  }
});
</script>

<style scoped></style>
