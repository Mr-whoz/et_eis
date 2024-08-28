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
              @click="setWorkStatus('continue')"
              >继续
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              type="warning"
              size="large"
              style="font-size: 2.5vh"
              @click="setWorkStatus('pause')"
              >暂停
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              type="danger"
              size="large"
              style="font-size: 2.5vh"
              @click="setWorkStatus('stop')"
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
              <el-col>显示周期：{{ displayInterval }}</el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col>电流：{{ current }}</el-col>
            </el-row>
            <el-row>
              <el-col>电压：{{ voltage }}</el-col>
            </el-row>
            <el-row>
              <el-col>功率：{{ power }}</el-col>
            </el-row>
            <el-row>
              <el-col>频率：{{ frequency }}</el-col>
            </el-row>
            <el-row>
              <el-col>采集周期：{{ collectInterval }}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- ---------------------------------------- 第2行组件 结束 ---------------------------------------- -->
  <br />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
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
const workStatus = ref<workStatusType>("idle");

// 动态返回icon组件
const workStatusIcon = computed(() => {
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
const workStatusIconColor = computed(() => {
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
const workStatusTag = computed(() => {
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
const workStatusTagType = computed(() => {
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
          ElMessage.success("开始测试");
          workStatus.value = "running";
          shouldSetElapsedTime.value = true;
          setStartWorkTime();
          // 开始测试相关的代码
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
/* **************************************** 第1行组件 结束 **************************************** */

/* **************************************** 第2行组件 开始 **************************************** */
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

let intervalId: number | undefined;

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
</script>

<style scoped></style>
