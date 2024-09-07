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
              <el-col>现在时间：{{ currentTime }}</el-col>
            </el-row>
            <el-row>
              <el-col
                >循环次数：当前轮数：{{ currentCycle }}，已完成轮数：{{
                  doneCycle
                }}，总轮数：{{ totalCycle }}
              </el-col>
            </el-row>
            <el-row>
              <el-col
                >显示周期：{{ displayInterval }}
                {{ displayIntervalUnit }}
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
        </el-row>
        <el-row>
          <el-col
            >存储空间：已使用 {{ usedSpace }} {{ usedSpaceUnit }}，剩余
            {{ remainingSpace }} {{ remainingSpaceUnit }}，总共
            {{ totalSpace }} {{ totalSpaceUnit }}
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

dayjs.extend(duration);

/* **************************************** 未完成函数 开始 **************************************** */
const setStartWorkTime = (): void => {
  clearStartTime();
  clearElapsedTime();
  setStartTime();
};

const setEndWorkTime = (): void => {};
/* **************************************** 未完成函数 结束 **************************************** */

/* **************************************** 第1行组件 开始 **************************************** */
type workStatusType = "idle" | "running" | "paused" | "error";

// 定义 workStatus 的时候，先从 localStorage 获取
const storedWorkStatus = localStorage.getItem(
  "workStatus",
) as workStatusType | null;
const workStatus = ref<workStatusType>(storedWorkStatus || "idle");

// 监听 workStatus 的变化，将其保存到 localStorage
watch(workStatus, (newStatus) => {
  localStorage.setItem("workStatus", newStatus);
});

// 动态返回icon组件
const workStatusIcon = computed((): Component => {
  switch (workStatus.value) {
    case "idle":
      return SuccessFilled;
    case "running":
      return Promotion;
    case "paused":
      return WarningFilled;
    case "error":
      return CircleCloseFilled;
    default:
      return SuccessFilled;
  }
});

// 动态返回icon颜色
const workStatusIconColor = computed((): string => {
  switch (workStatus.value) {
    case "idle":
      return "#67C23A";
    case "running":
      return "#409EFF";
    case "paused":
      return "#E6A23C";
    case "error":
      return "#F56C6C";
    default:
      return "#67C23A";
  }
});

// 动态返回tag文本
const workStatusTag = computed((): string => {
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
      return "空闲";
  }
});

// 动态返回tag类型
const workStatusTagType = computed((): string => {
  switch (workStatus.value) {
    case "idle":
      return "success";
    case "running":
      return "primary";
    case "paused":
      return "warning";
    case "error":
      return "danger";
    default:
      return "success";
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
          // 暂停测试相关的代码
          break;
        case "stop":
          ElMessage.success("已经停止");
          workStatus.value = "idle";
          shouldSetElapsedTime.value = false;
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
          // 继续测试相关的代码
          break;
        case "pause":
          ElMessage("当前是暂停状态，无需暂停");
          break;
        case "stop":
          ElMessage.success("已经停止");
          workStatus.value = "idle";
          shouldSetElapsedTime.value = false;
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
          shouldSetElapsedTime.value = false;
          setEndWorkTime();
          // 停止测试相关的代码
          break;
        case "stop":
          ElMessage.success("已经停止");
          workStatus.value = "idle";
          shouldSetElapsedTime.value = false;
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

const newAction = ref<string>("");
/* **************************************** 第1行组件 结束 **************************************** */

/* **************************************** 第2行组件 开始 **************************************** */
const current = ref<number>(0);
const currentUnit = ref<string>("A");

const voltage = ref<number>(0);
const voltageUnit = ref<string>("V");

const power = ref<number>(0);
const powerUnit = ref<string>("W");

const frequency = ref<number>(0);
const frequencyUnit = ref<string>("Hz");

const collectInterval = ref<number>(0);
const collectIntervalUnit = ref<string>("毫秒");

const displayInterval = ref<number>(0);
const displayIntervalUnit = ref<string>("毫秒");

const totalCycle = ref<number>(0);
const currentCycle = ref<number>(0);
const doneCycle = ref<number>(0);

const currentTimestamp = ref<number>(0);
const startTimestamp = ref<number>(0);
const elapsedTimestamp = ref<number>(0);
const currentTime = ref<string>("");
const startTime = ref<string>("");
const elapsedTime = ref<string>("");

const shouldSetElapsedTime = ref<boolean>(false);

const setCurrentTimeAndElapsedTime = (): void => {
  currentTimestamp.value = dayjs().valueOf();
  currentTime.value = dayjs(currentTimestamp.value).format(
    "YYYY-MM-DD HH:mm:ss",
  );

  // 更新 elapsedTime
  if (startTimestamp.value !== 0 && startTime.value !== "") {
    if (workStatus.value === "running" || workStatus.value === "paused") {
      if (shouldSetElapsedTime.value) {
        setElapsedTime();
      }
    }
  }
};

let intervalId: number = 0;

onMounted(() => {
  intervalId = window.setInterval(setCurrentTimeAndElapsedTime, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const setStartTime = (): void => {
  startTimestamp.value = dayjs().valueOf();
  startTime.value = dayjs(startTimestamp.value).format("YYYY-MM-DD HH:mm:ss");
};

const clearStartTime = (): void => {
  startTimestamp.value = 0;
  startTime.value = "";
};

const setElapsedTime = (): void => {
  elapsedTimestamp.value = currentTimestamp.value - startTimestamp.value;
  elapsedTime.value = dayjs.duration(elapsedTimestamp.value).format("HH:mm:ss");
};

const clearElapsedTime = (): void => {
  elapsedTimestamp.value = 0;
  elapsedTime.value = "";
};
/* **************************************** 第2行组件 结束 **************************************** */

/* **************************************** 第3行组件 开始 **************************************** */
const maxCurrent = ref<number>(0);
const maxCurrentUnit = ref<string>("A");

const maxVoltage = ref<number>(0);
const maxVoltageUnit = ref<string>("V");

const maxPower = ref<number>(0);
const maxPowerUnit = ref<string>("W");

const deviceType = ref<string>("ET-PEK010");

const totalSpace = ref<number>(0);
const totalSpaceUnit = ref<string>("M");
const usedSpace = ref<number>(0);
const usedSpaceUnit = ref<string>("M");
const remainingSpace = ref<number>(0);
const remainingSpaceUnit = ref<string>("M");
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
