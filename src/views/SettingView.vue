<template>
  <div style="display: flex; justify-content: center" :span="10">
      <el-col :span="12">
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
        </el-row>
        <el-col :span="2"> <!-- 纯占位，无意义 --> </el-col>
      </el-col>
      <el-col :span="12">
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
          <el-col type="primary" @click="checkNumber" :span="6">
            <el-button size="large"
                       style="color: white; background-color: blue; font-size: 2.5vh;"
                       type="danger"
              >开始
            </el-button>
          </el-col>
        </el-row>
      </el-col>
  </div>
  <div style="height: 1vh"></div>
  <el-row :gutter="20">
    <!-- ---------------------------------------- 第1行第1列组件 开始 ---------------------------------------- -->
    <el-col :span="12">
      <el-card header="工作模式" style="height: 35vh">
        <el-radio-group v-model="workMode" style="display: table">
          <el-radio
            value="eis"
            size="large"
            style="width: 40vw; height: 6.5vh"
            border
            >EIS
          </el-radio>
          <div style="height: 2.5vh"></div>
          <el-radio
            value="constant"
            size="large"
            style="width: 40vw; height: 6.5vh"
            border
          >
            <el-row :gutter="10">
              <el-col :span="6">
                <el-select
                  v-model="constantMode"
                  placeholder="工作模式"
                  size="large"
                  style="width: 9vw"
                  :disabled="isEISSelected"
                  @change="handleConstantModeChange"
                >
                  <el-option
                    v-for="item in constantModeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select
                  v-model="valueType"
                  placeholder="值类型"
                  size="large"
                  style="width: 9vw"
                  :disabled="isEISSelected || notConstantModeSelected"
                >
                  <el-option
                    v-for="item in valueTypeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-input
                  v-model="value"
                  size="large"
                  style="width: 9vw"
                  placeholder="值"
                  :disabled="isEISSelected || notConstantModeSelected"
                />
              </el-col>
              <el-col :span="6">
                <el-select
                  v-model="unit"
                  size="large"
                  style="width: 9vw"
                  placeholder="单位"
                  :disabled="isEISSelected || notConstantModeSelected"
                >
                  <el-option
                    v-for="item in unitOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-radio>
          <div style="height: 2.5vh"></div>
          <el-row :gutter="20">
          <el-col
            :span="4"
            style="display: flex; justify-content: right; align-items: center"
          >
            <el-text size="large">电流模式：</el-text>
          </el-col>
          <el-col :span="8">
            <el-select v-model="currentMode" size="large" placeholder="">
              <el-option
                v-for="item in currentModeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          >
        </el-row>
        </el-radio-group>
      </el-card>
    </el-col>
    <!-- ---------------------------------------- 第1行第1列组件 结束 ---------------------------------------- -->

    <!-- ---------------------------------------- 第1行第2列组件 开始 ---------------------------------------- -->
    <el-col :span="12">
      <el-card header="测试保护门限" style="height: 35vh">
        <el-row :gutter="20">
          <el-col
            :span="4"
            style="display: flex; justify-content: right; align-items: center"
          >
            <el-text size="large">电流峰值：</el-text>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="currentPeak"
              size="large"
              placeholder="请输入 电流峰值"
            />
          </el-col>
          <el-col :span="8">
            <el-select v-model="currentPeakUnit" size="large">
              <el-option
                v-for="item in currentPeakUnitOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="4"><!-- 纯占位，无意义 --></el-col>
        </el-row>
        <br />
        <el-row :gutter="20">
          <el-col
            :span="4"
            style="display: flex; justify-content: right; align-items: center"
          >
            <el-text size="large">电压峰值：</el-text>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="voltagePeak"
              size="large"
              placeholder="请输入 电压峰值"
            />
          </el-col>
          <el-col :span="8">
            <el-select v-model="voltagePeakUnit" size="large">
              <el-option
                v-for="item in voltagePeakUnitOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="4"><!-- 纯占位，无意义 --></el-col>
        </el-row>
        <br />
        <el-row :gutter="20">
          <el-col
            :span="4"
            style="display: flex; justify-content: right; align-items: center"
          >
            <el-text size="large">功率峰值：</el-text>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="powerPeak"
              size="large"
              placeholder="请输入 功率峰值"
            />
          </el-col>
          <el-col :span="8">
            <el-select v-model="powerPeakUnit" size="large">
              <el-option
                v-for="item in powerPeakUnitOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="4"><!-- 纯占位，无意义 --></el-col>
        </el-row>
      </el-card>
    </el-col>
    <!-- ---------------------------------------- 第1行第2列组件 结束 ---------------------------------------- -->
  </el-row>
  <div style="height: 1vh"></div>
  <el-row :gutter="20">
    <!-- ---------------------------------------- 第2行第1列组件 开始 ---------------------------------------- -->
    <el-col :span="12">
      <el-card header="频率设置" style="height: 50vh">
        <el-row :gutter="20">
          <el-col
            :span="4"
            style="display: flex; justify-content: right; align-items: center"
          >
            <el-text size="large">步进方式：</el-text>
          </el-col>
          <el-col :span="8">
            <el-select v-model="stepMode" size="large">
              <el-option
                v-for="item in stepModeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input
              v-if="stepMode === 'linearChange'"
              v-model="stepValue"
              size="large"
              placeholder="请输入 步进值"
            />
          </el-col>
          <el-col v-if="stepMode === 'linearChange'" :span="4"
            ><!-- 纯占位，无意义 --></el-col>
          <el-col v-if="stepMode !== 'linearChange'" :span="12"
            ><!-- 纯占位，无意义 --></el-col>
        </el-row>
        <br />
        <el-row :gutter="20" v-if="stepMode !== 'Custommode'">
          <!-- 等于随机频率测试时隐藏  v-if!="stepMode === 'Custommode'"-->
          <el-col
            :span="4"
            style="display: flex; justify-content: right; align-items: center"
          >
            <el-text size="large">起始频率：</el-text>
          </el-col>
          
          <el-col :span="8">
            <el-input
              v-model="startFrequency"
              size="large"
              placeholder="请输入 起始频率"
            />
          </el-col>
          <el-col :span="10">
            <el-col style="display: flex; justify-content: right; align-items: center">
              <el-text size="large">赫 兹 （最小是0.1Hz，最大是1000Hz）</el-text>
            </el-col>
          </el-col>

          <el-col :span="4"><!-- 纯占位，无意义 --></el-col>
        </el-row>
        <br />
        <el-row :gutter="20" v-if="stepMode === 'logarithmicChange' || stepMode === 'linearChange' ">
          <el-col :span="4" style="display: flex; justify-content: right; align-items: center"
          >
          <!-- 等于随机频率测试时隐藏 Custommode-->
            <el-text size="large">终止频率：</el-text>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="endFrequency"
              size="large"
              placeholder="请输入 终止频率"
            />
          </el-col>

          <el-col :span="10">
            <el-col style="display: flex; justify-content: right; align-items: center">
              <el-text size="large">赫 兹 （最小是0.1Hz，最大是1000Hz）</el-text>
            </el-col>
          </el-col>

          <el-col :span="4"><!-- 纯占位，无意义 --></el-col>
        </el-row>
        <br />
        <el-row :gutter="20">
          <el-col
            :span="4"
            style="display: flex; justify-content: right; align-items: center"
          >
            <el-text size="large">频点次数：</el-text>
          </el-col>
          <el-col :span="8">
           <el-select v-model="frequencyPointPeriod" size="large" placeholder="请选择频点次数">
              <el-option
                v-for="item in unm"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="4"><!-- 纯占位，无意义 --></el-col>
        </el-row>



        <br />
        <el-row :gutter="20">
          <el-col
            :span="4"
            style="display: flex; justify-content: right; align-items: center"
          >
            <el-text size="large">循环次数：</el-text>
          </el-col>
          <el-col :span="8">
            <el-select v-model="loopTimes" size="large" placeholder="请选择循环次数">
              <el-option
                v-for="item in unm"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="12"><!-- 纯占位，无意义 --></el-col>
        </el-row>
        <br />
        <el-row :gutter="20">
          <el-col
            :span="4"
            style="display: flex; justify-content: right; align-items: center"
          >
            <el-text size="large">采集周期：</el-text>
          </el-col>
          <el-col :span="8">
            <el-select v-model="collectInterval" size="large" placeholder="请输入 采集周期">
              <el-option
                v-for="item in collectIntervalArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
            <el-col
              :span="3"
              style="display: flex; justify-content: right"
            >
              <el-text size="large">毫 秒/ms</el-text>
            </el-col>

          <el-col :span="4"><!-- 纯占位，无意义 --></el-col>
        </el-row>
        <br />
        <el-row :gutter="20"></el-row>




      </el-card>
    </el-col>
    <!-- ---------------------------------------- 第2行第1列组件 结束 ---------------------------------------- -->

    <!-- ---------------------------------------- 第2行第2列组件 开始 ---------------------------------------- -->
    <el-col :span="12">
      <el-card header="随机频率测试" style="height: 50vh">
          <el-row :gutter="20">
            <el-col :span="4">
            <el-tooltip 
              v-if="stepMode !== 'Custommode'"
              content="请选择为随机频率测试模式" 
              placement="top"
            >
              <el-upload :before-upload="beforeUpload">
                <el-button 
                  type="primary" 
                  :disabled="stepMode !== 'Custommode'"
                >
                  上传文件
                </el-button>
              </el-upload>
            </el-tooltip>

              <el-upload v-else :before-upload="beforeUpload">
                <el-button type="primary">
                  上传文件
                </el-button>
              </el-upload>
            </el-col>

          <el-col :span="1"><!-- 纯占位，无意义 --></el-col>
            <el-col :span="10"><el-input
              v-model="savefileName"
              size="large"
              placeholder="还未选择文件"
              :disabled="true"
              style="color: gray;"
            ></el-input></el-col>
            <el-col :span="1"><!-- 纯占位，无意义 --></el-col>
            <el-button size="large" @click="templateDownload = true">
        <el-text size="large">下载模板</el-text>
      </el-button>
          </el-row>

          <!-- 在这里添加表格 -->
          <el-row :gutter="20">

            <el-table :data="fileData" 
          
            height="250"
            style="width: 100%">

            <!-- 频率列 -->
            <el-table-column
              prop="sequence"
              label="序列"
              
            ></el-table-column>
            <el-table-column
              prop="frequency"
              label="频率"
            ></el-table-column>
          </el-table>
        </el-row> 
  <el-dialog v-model="templateDownload" title="模板下载" width="30vw">
    <el-text size="large">请选择要下载的模板格式（可多选）：</el-text>
    <br />
    <!-- 设置了large但不知道为什么不生效 -->
    <el-checkbox-group v-model="dataFormat" size="large">
      <el-checkbox label="xls" value="xls" size="large" />
      <el-checkbox label="xlsx" value="xlsx" size="large" />
    </el-checkbox-group>
    <template #footer>
      <el-button @click="templateDownload = false">取消</el-button>
      <el-button
        type="primary"
        @click="
          templateDownload = false;
          confirmDownload();
        "
        >确认
      </el-button>
    </template>
  </el-dialog>
      </el-card>
    </el-col>
    <!-- ---------------------------------------- 第2行第2列组件 结束 ---------------------------------------- -->
    </el-row>
    <el-dialog v-model="successDialogVisible" title="参数检查" width="30vw">
    <el-result
      icon="success"
      title="参数检查成功！请问是否开始测试？"
      style="height: 25vh"
    >
    </el-result>
    <template #footer>
      <el-button @click="successDialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        @click="
          successDialogVisible = false;
          newAction = 'continue';
          dialogVisible = false;
          startTest();
        "
        >确认
      </el-button>
    </template>
    </el-dialog>
    <el-dialog
    v-model="errorDialogVisible"
    title="参数检查"
    width="30vw"
    :before-close="handleErrorDialogClose"
    >
    <el-result icon="error" title="参数检查失败！错误原因如下："></el-result>
    <div v-for="message in errorMessage">
      {{ message }}
    </div>
    <template #footer>
      <el-button @click="handleErrorDialogClose">取消</el-button>
      <el-button type="primary" @click="handleErrorDialogClose"
        >确认
      </el-button>
    </template>
    </el-dialog>
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
import { computed,
         ref,
        type Component
       } from "vue";
import { SuccessFilled,
         Promotion,
         WarningFilled,
         CircleCloseFilled,
 } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import * as XLSX from "@e965/xlsx";

let timeValue = ref(0)
const authStore = useAuthStore();
const func: { [key: string]: any } = {};

/* **************************************** 状态组件  组件 开始 **************************************** */
// 动态返回icon组件
const workStatusIcon = computed((): Component => {
  switch (authStore.workStatus) {
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
    default:
      return SuccessFilled;
  }
});

// 动态返回icon颜色
const workStatusIconColor = computed((): string => {
  switch (authStore.workStatus) {
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
    default:
      return "#67C23A";
  }
});

// 动态返回tag文本
const workStatusTag = computed((): string => {
  switch (authStore.workStatus) {
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
    default:
      return "空闲";
  }
});

// 动态返回tag类型
const workStatusTagType = computed((): string => {
  switch (authStore.workStatus) {
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
    default:
      return "success";
  }
});

// 设置workStatus
// 正常来说只会设置idle、running、paused这三个状态，error状态是出现异常时才设置的
const setWorkStatus = (newAction: string): void => {
  switch (authStore.workStatus) {
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
          // workStatus.value = "paused";
          setPauseWorkTime()
          // 暂停测试相关的代码
          break;
        case "stop":
          ElMessage.success("已经停止");
          // workStatus.value = "idle";
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
          // workStatus.value = "running";
          setStartWorkTime();
          // 继续测试相关的代码
          break;
        case "pause":
          ElMessage("当前是暂停状态，无需暂停");
          break;
        case "stop":
          ElMessage.success("已经停止");
          // workStatus.value = "idle";
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
          // workStatus.value = "idle";
          startTimestamp.value = 0;
          authStore.testStart = false;
          setEndWorkTime();
          // 停止测试相关的代码
          break;
        case "stop":
          ElMessage.success("已经停止");
          // workStatus.value = "idle";
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
  shouldSetElapsedTime.value = true
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
const dialogVisible = ref<boolean>(false);
const workStatusText = computed((): string => {
  switch (authStore.workStatus) {
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

const startTimestamp = computed({
  get: () => authStore.testStartTime,
  set: (value: number) => Number(authStore.testStartTime = Number(value)),
});

const shouldSetElapsedTime = computed({
  get: () => authStore.testStart,
  set: (value:boolean) => (authStore.testStart = (value)),
});

/* **************************************** 状态组件  组件 结束 **************************************** */


/* **************************************** 第1行第1列组件 开始 **************************************** */
const workMode = computed({
  get: () => authStore.workMode,
  set: (value: string) => (authStore.workMode = value),
});

const constantMode = computed({
  get: () => authStore.constantMode,
  set: (value: string) => (authStore.constantMode = value),
});
const constantModeOption = [
  { value: "constantCurrent", label: "恒流 CC" },
  { value: "constantVoltage", label: "恒压 CV" },
];

const valueType = computed({
  get: () => authStore.valueType,
  set: (value: string) => (authStore.valueType = value),
});
const valueTypeOption = [
  { value: "peakValue", label: "峰值" },
  { value: "rootMeanSquareValue", label: "有效值" },
  { value: "peakToPeakValue", label: "峰峰值" },
];
/* 这里会出现浮点数，需要优化 */
const value = computed({
  get: () => authStore.value,
  set: (newValue: string) => (authStore.value = newValue),
});

interface Option {
  value: string;
  label: string;
};

const currentUnitOption: Option[] = [
  { value: "ampere", label: "安/A" },
  { value: "kiloampere", label: "千安/kA" },
  { value: "milliampere", label: "毫安/mA" },
];

const voltageUnitOption: Option[] = [
  { value: "volt", label: "安/V" },
  { value: "kilovolt", label: "千安/kV" },
  { value: "millivolt", label: "毫安/mV" },
];

const unit = computed({
  get: () => authStore.unit,
  set: (value: string) => (authStore.unit = value),
});
const unitOption = computed({
  get: () => authStore.unitOption,
  set: (value: Option[]) => (authStore.unitOption = value),
});

const isEISSelected = computed((): boolean => {
  return workMode.value === "eis";
});

const notConstantModeSelected = computed((): boolean => {
  return constantMode.value === "";
});

const handleConstantModeChange = (): void => {
  switch (constantMode.value) {
    case "constantCurrent":
      authStore.unit = "ampere";
      unit.value = authStore.unit;
      unitOption.value = currentUnitOption;
      break;
    case "constantVoltage":
      authStore.unit = "volt";
      unit.value = authStore.unit;
      unitOption.value = voltageUnitOption;
      break;
  }
};
/* **************************************** 第1行第1列组件 结束 **************************************** */

/* **************************************** 第1行第2列组件 开始 **************************************** */
const currentPeak = ref( authStore.currentPeak || '');
const currentPeakUnit = computed({
  get: () => authStore.currentPeakUnit,
  set: (value: string) => (authStore.currentPeakUnit = value),
});
const currentPeakUnitOption = [
  { value: "ampere", label: "安/A" },
  { value: "kiloampere", label: "千安/kA" },
  { value: "milliampere", label: "毫安/mA" },
];

const voltagePeak = ref( authStore.voltagePeak || '');
const voltagePeakUnit = computed({
  get: () => authStore.voltagePeakUnit,
  set: (value: string) => (authStore.voltagePeakUnit = value),
});
const voltagePeakUnitOption = [
  { value: "volt", label: "伏/V" },
  { value: "kilovolt", label: "千安/kV" },
  { value: "millivolt", label: "毫伏/mV" },
];

const powerPeak = ref( authStore.powerPeak || '');
const powerPeakUnit = computed({
  get: () => authStore.powerPeakUnit,
  set: (value: string) => (authStore.powerPeakUnit = value),
});
const powerPeakUnitOption = [
  { value: "watt", label: "瓦/W" },
  { value: "kilowatt", label: "千瓦/kW" },
  { value: "milliwatt", label: "毫瓦/mW" },
];
/* **************************************** 第1行第2列组件 结束 **************************************** */

/* **************************************** 第2行第1列组件 开始 **************************************** */
const startFrequency = computed({
  get: () => authStore.startFrequency,
  set: (value: string) => (authStore.startFrequency = value),
});
const startFrequencyUnit = computed({
  get: () => authStore.startFrequencyUnit,
  set: (value: string) => (authStore.startFrequencyUnit = value),
});

const endFrequency = computed({
  get: () => authStore.endFrequency,
  set: (value: string) => (authStore.endFrequency = value),
});
const endFrequencyUnit = computed({
  get: () => authStore.endFrequencyUnit,
  set: (value: string) => (authStore.endFrequencyUnit = value),
});

const unm = [{value:1, label:'1'}];  
for (let i = 2; i <= 60; i++) {  
  unm.push({  
    value: i,  
    label: i.toString()  
  });  
}  

const stepMode = computed({
  get: () => authStore.stepMode,
  set: (value: string) => (authStore.stepMode = value),
});
const stepModeOption = [
  { value: "logarithmicChange", label: "对数变化" },
  { value: "linearChange", label: "线性变化" },
  { value: "singlePoint", label: "单点" },
  { value: "Custommode", label: "随机频率测试" },
];
const currentMode = computed({
  get: () => authStore.currentMode,
  set: (value: string) => (authStore.currentMode = value),
});
const currentModeOption = [
  { value: "directCurrent", label: "直流电" },
  { value: "alternatingCurrent", label: "交流电" },
];
const stepValue = computed({
  get: () => authStore.stepValue ,
  set: (value: string) => (authStore.stepValue = value),
});
const frequencyPointPeriod = computed({
  get: () => (authStore.frequencyPointPeriod ?? '1'),
  set: (value: string) => (authStore.frequencyPointPeriod = value),
});

const frequencyPointPeriodUnit = computed({
  get: () => authStore.frequencyPointPeriodUnit,
  set: (value: string) => (authStore.frequencyPointPeriodUnit = value),
});




const stepTransitValueArr = computed({
  get: ():number[] => authStore.stepValueArr,
  set: (value:number[]) => (authStore.stepValueArr = value),
});

const uploadFrequency = computed({
  get: ():number[] => authStore.uploadFrequency,
  set: (value:number[]) => (authStore.uploadFrequency = value),
});

const stepValueArr = computed(() => {
  const step = Number(stepValue.value);
  const startFreq = Number(startFrequency.value);
  const endFreq = Number(endFrequency.value);
  if (isNaN(step) || step < 41) {
    return [];
  }
  const num = (endFreq - startFreq) / (step - 1);
  const result: number[] = [];
  for (let i = 0; i < step; i++) {
    result.push(startFreq + i * num);
  }
  return result;
});

/* **************************************** 第2行第1列组件 结束 **************************************** */

/* **************************************** 第2行第2列组件 开始 **************************************** */
const loopTimes = computed({
  get: () => (authStore.loopTimes ?? '1'),
  set: (value: string) => (authStore.loopTimes = value),
});
const collectInterval = computed({
  get: () => authStore.collectInterval,
  set: (value: string) => (authStore.collectInterval = value),
});
const collectIntervalUnit = computed({
  get: () => authStore.collectIntervalUnit,
  set: (value: string) => (authStore.collectIntervalUnit = value),
});
const collectIntervalArr = [{ value: 0.5, label: '0.5' }];
for (let i = 1; i <= 5; i+=0.5) {  
  collectIntervalArr.push({  
    value: i,  
    label: i.toString(),
  });  
}

//上传excle并解析数据的部分
interface FileDataItem {
  sequence: number;
  frequency: number;
}
const fileData = ref<FileDataItem[]>([]);

const allowedFileExtension: string[] = ["xlsx", "xls"];
const savefileName = ref(""); // 保存上传的文件名
const uploadfrequencies=ref<number[]>([]);

// 文件上传之前的检查和处理
const beforeUpload = (file: File) => {
  const fileExtension: string | undefined = file.name
  .split(".")
  .pop()
  ?.toLowerCase();

  if (!fileExtension || !allowedFileExtension.includes(fileExtension)) {
    ElMessage.error("只允许上传 xlsx、xls 格式的文件！请重新选择！");
    return false;
  }
  savefileName.value = file.name; 
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // 跳过第一行标题行，直接读取数据内容 生成一个二维数组，第一维度为序号，第二维度为值
    const rawArray  =  XLSX.utils.sheet_to_json(sheet, { header: 1, range: 1 });
    // 假设 rawArray 是一个包含对象的数组，每个对象都有 sequence 和 frequency 属性
    // 你需要在这里进行类型断言，以确保 TypeScript 知道 rawArray 的具体类型
    fileData.value = (rawArray as any[][]).map(row => {
      return {
        sequence: row[0],
        frequency: row[1],
      } as FileDataItem;
    });
    // uploadfrequencies.value = fileData.value.map(item => item.frequency);
    uploadfrequencies.value = fileData.value
  .filter(item => item.frequency > 0)
  .map(item => item.frequency);
  uploadFrequency.value=fileData.value
  .filter(item => item.frequency > 0)
  .map(item => item.frequency);
     };
  reader.readAsArrayBuffer(file);
  return false; // 
};



const templateDownload = ref<boolean>(false);
const dataFormat = ref<string[]>(["xlsx"]);
 
const confirmDownload = (): void => {
  templateDownload.value = false;
  dataFormat.value.forEach((format) => {
    const link = document.createElement("a");
    link.href = `/eis_template/eis_SettingViewTemplate.${format}`;
    link.setAttribute("download", `eis_SettingViewtemplate.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

/* **************************************** 第2行第2列组件 结束 **************************************** */

const successDialogVisible = ref<boolean>(false);
const errorDialogVisible = ref<boolean>(false);
const errorMessage = ref<string[]>([]);

const checkNumber = (): void => {
  const checkValue: boolean = isEISSelected.value ? true : checkPositiveNumber(value.value); // 工作模式的值
  const checkCurrentPeak: boolean = checkPositiveNumber(currentPeak.value); // 电流峰值
  const checkVoltagePeak: boolean = checkPositiveNumber(voltagePeak.value); // 电压峰值
  const checkPowerPeak: boolean = checkPositiveNumber(powerPeak.value); // 功率峰值
  const checkStepValue: boolean = checkPositiveInteger(stepValue.value); // 步进次数
  const checkStartFrequency: boolean = checkPositiveNumber(startFrequency.value); // 起始频率
  const checkEndFrequency: boolean = checkPositiveNumber(endFrequency.value); // 终止频率
  const checkLoopTimes: boolean = checkPositiveInteger(loopTimes.value); // 循环次数
  const checkCollectInterval: boolean = checkPositiveNumber(collectInterval.value); // 采集周期
  const checkFrequencyPointPeriod: boolean = checkPositiveNumber(frequencyPointPeriod.value); // 频点次数
  const checkProtectedRetransmission = checkRunning(authStore.workStatus); //工作状态
  const checkFrequencyDomain: boolean = frequencyDomain(stepMode.value,checkEndFrequency, checkStartFrequency);
  const checkFrequencyDomainPrice: boolean = frequencyDomainPrice(startFrequency.value, endFrequency.value);
  const checkUpLoadFrequenciesIsNULL :boolean=(uploadfrequencies.value.length === 0 && stepMode.value === "Custommode" ? false : true);
  const checkUpLoadFrequenciesDataIsNULL :boolean = (uploadfrequencies.value.some((value)=>value == null) ? false : true)//是否含有空置 ==可跟需求取消

  

  const checkResult: boolean =//输出为ture时候，successDialogVisible.value = true;，否则触发下面的错误提示
    checkValue && // 工作模式的值
    checkCurrentPeak && // 电流峰值
    checkVoltagePeak && // 电压峰值
    checkPowerPeak && // 功率峰值
    ( stepMode.value !== "linearChange" ? true : checkStepValue ) && // 步进次数
    checkFrequencyDomainPrice &&
    checkFrequencyDomain &&  //频率范围
    checkLoopTimes && // 循环次数
    checkCollectInterval && // 采集周期
    checkProtectedRetransmission && //工作状态
    checkFrequencyPointPeriod&& //频点次数
    checkUpLoadFrequenciesDataIsNULL&& //检查上传文件是否含有空频率值
    checkUpLoadFrequenciesIsNULL; //检查上传文件是否为空

  if (checkResult) {
    successDialogVisible.value = true;
  } else {
    if (!isEISSelected.value) {
      if (!checkValue) {
        errorMessage.value.push(
          "工作模式的值为：" + (value.value === "" ? "空" : value.value),
        );
      }
    }
    if (!checkCurrentPeak) {
      errorMessage.value.push(
        "电流峰值为：" + (currentPeak.value === "" ? "空" : currentPeak.value),
      );
    }
    if (!checkVoltagePeak) {
      errorMessage.value.push(
        "电压峰值为：" + (voltagePeak.value === "" ? "空" : voltagePeak.value),
      );
    }
    if (!checkPowerPeak) {
      errorMessage.value.push(
        "功率峰值为：" + (powerPeak.value === "" ? "空" : powerPeak.value),
      );
    }

    if ( stepMode.value === "logarithmicChange" ||
         stepMode.value === "linearChange" ||
         stepMode.value === "singlePoint" ) {
      if(!checkStartFrequency){
          errorMessage.value.push("起始频率为：" +
          (startFrequency.value === "" ? "空" : startFrequency.value),);
      }
      if (!checkEndFrequency && stepMode.value !== "singlePoint" ) {
          errorMessage.value.push(
          "终止频率为：" +
            (endFrequency.value === "" ? "空" : startFrequency.value),);
      }
      if (!checkStepValue && stepMode.value === "linearChange" ) {
          errorMessage.value.push(
            "步进值：" + (stepValue.value === "" ? "空" : stepValue.value),
          );
      }
    }else if( stepMode.value === "Custommode"){
       if(!checkUpLoadFrequenciesIsNULL){
        errorMessage.value.push("数据文件未上传。");
       }if(!checkUpLoadFrequenciesDataIsNULL){
        errorMessage.value.push("数据文件中存在频率为空值。");
      }
    }

    if (!checkFrequencyDomainPrice ) {
        if(+startFrequency.value < 0.1 || +startFrequency.value > 1000 ) {
          errorMessage.value.push(
            "起始频率数值错误" + startFrequency.value);
        }
        if(+endFrequency.value < 0.1 || +endFrequency.value > 1000 ) {
          errorMessage.value.push(
            "终止频率数值错误" + endFrequency.value);
        }
        if(+startFrequency.value== +endFrequency.value  ) {
          errorMessage.value.push(
            "起始频率数值不能等于终止频率" );
        }
    }
    if (!checkLoopTimes ) {
      errorMessage.value.push(
        "循环次数为：" + (loopTimes.value === "" ? "空" : loopTimes.value),
      );
    }
    if (!checkCollectInterval) {
      errorMessage.value.push(
        "采集周期为：" +
          (collectInterval.value === "" ? "空" : collectInterval.value),
      );
    }
    if (!checkProtectedRetransmission) {
      errorMessage.value.push(
        "正在运行中。" 
      );
    };
    errorDialogVisible.value = true;
  }
};  

function frequencyDomainPrice(string1:string,string2:string): boolean {
  if(stepMode.value === "Custommode"){
    return true;
  }else{
    if(+string1 < 0.1 || +string1 > 1000 ||
      +string2 < 0.1 || +string2 > 1000){
      return false;
    }else {
      return true;
    }
}}

function frequencyDomain(string1:string,boolean1:boolean,boolean2:boolean): boolean {
  switch (string1) {
    case 'logarithmicChange':
    case 'linearChange':
      return (boolean1 && boolean2);
    case 'singlePoint':
      return boolean2;
    case 'Custommode':
      return true;
    default:
      return false;
  }
}

// 检查是否是正数
const checkPositiveNumber = (inputString: string | undefined): boolean => {
  const inputNumber: number = parseFloat(inputString ?? "");
  return !Number.isNaN(inputNumber) && inputNumber > 0 ;
};

// 检查是否是正整数
const checkPositiveInteger = (inputString: string | undefined): boolean => {
  const inputNumber: number = parseFloat(inputString ?? "");
  return (
    !Number.isNaN(inputNumber) &&
    Number.isInteger(inputNumber) &&
    inputNumber > 0
  );
};

const checkRunning = (inputString: string | undefined): boolean => {    
  // 使用空字符串作为未定义输入的回退值    
  const safeString = inputString ?? "";    
  // 如果字符串等于 "running"，返回 false，否则返回 true    
  return safeString !== "running";    
};
const handleErrorDialogClose = (): void => {
  errorDialogVisible.value = false;
  errorMessage.value = [];
  authStore.testStart = true;
  setWorkStatus(newAction.value);
};
const adjustValueByUnit = (value: number, unit: string): number => {
  switch (unit) {
    case "kiloampere":  //千安
    case "kilovolt":    //千伏
    case "kilowatt":    //千瓦
    case "kilohertz":   //千赫
    case "second":      //秒
      return value * 1000;
    case "milliampere": //毫安
    case "millivolt":   //毫伏
    case "milliwatt":   //毫瓦
    case "millihertz":  //毫赫
    case "microsecond": //微秒
      return value / 1000;
    default:
      return value;
  }
};

const adjustValueByType = (value: number, valueType: string): number => {
  switch (valueType) {
    case "rootMeanSquareValue":
      return value * Math.sqrt(2);
    case "peakToPeakValue":
      return value / 2;
    default:
      return value;
  }
};

/**
 * 函数作用：将设置视图中选择的参数转化为相应的JSON格式
 * 函数逻辑：
 * 1、转化工作模式，根据选择的工作模式以及恒压恒流 为相应的json字符串
 * 2、转化 电流峰值、 电压峰值、 功率峰值 为相应的json字符串
 * 3、根据 stepMode.value 转化为不同的json字符串
 * 3.2 、  Custommode和 liner 两种模式需要注意限制，不能超过41
  */   
const createSettingJson = (): string => {
  const jsonObject: { [key: string]: any } = {};

  // 工作模式 
  if (workMode.value === "eis") {
    jsonObject["mode"] = "eis";
  } else if (workMode.value === "constant") {
    switch (constantMode.value) {
      // 恒流s
      case "constantCurrent":
        jsonObject["mode"] = "cc";
        break;
      // 恒压
      case "constantVoltage":
        jsonObject["mode"] = "cv";
        break;
    }

    let tmpValue = parseFloat(value.value); // 值
    tmpValue = adjustValueByUnit(tmpValue, unit.value); // 单位
    tmpValue = adjustValueByType(tmpValue, valueType.value); // 值类型
    jsonObject["modeIdentifier"] = tmpValue;
  }

  // 电流峰值
  jsonObject["currentPeak"] = adjustValueByUnit(
    parseFloat(currentPeak.value),
    currentPeakUnit.value,
  );

  // 电压峰值
  jsonObject["voltagePeak"] = adjustValueByUnit(
    parseFloat(voltagePeak.value),
    voltagePeakUnit.value,
  );

  // 功率峰值
  jsonObject["powerPeak"] = adjustValueByUnit(
    parseFloat(powerPeak.value),
    powerPeakUnit.value,
  );


  switch (stepMode.value) {
    // 对数变化
    case "logarithmicChange":
      jsonObject["stepMode"] = 1;
      break;
    // 线性变化
    case "linearChange":
      if( (+stepValue.value) <= 41 ) {
        jsonObject["stepMode"] = 2;
        jsonObject["stepSize"] = parseFloat(stepValue.value); // 步进值
      }else {
        jsonObject["stepMode"] = 4;
         let JudgmentLock = 1;
         let countSize=1;
          for (let NUM = 1; NUM <= stepValueArr.value.length && NUM <= 41&&JudgmentLock==1; NUM++) {
          if(adjustValueByUnit( parseFloat(endFrequency.value),endFrequencyUnit.value)>100 && (stepValueArr.value[ NUM]>=100)){//当前大于100，不转json，只发送前一个为止

          jsonObject[`frequency${NUM}`] = stepValueArr.value[ NUM - 1];
          jsonObject[`frequencyPointPeriod${NUM}`] = adjustValueByUnit(
          parseFloat(frequencyPointPeriod.value),frequencyPointPeriodUnit.value);
          // stepValueArr.value.splice(0,NUM);
          JudgmentLock=0;
          }else{
            jsonObject[`frequency${NUM}`] = stepValueArr.value[ NUM - 1];
            jsonObject[`frequencyPointPeriod${NUM}`] = adjustValueByUnit(
          parseFloat(frequencyPointPeriod.value),frequencyPointPeriodUnit.value);
          countSize++;
          }
          }
        stepValueArr.value.splice(0,countSize);
        stepTransitValueArr.value = stepValueArr.value
      }

      break;
    // 单点
    case "singlePoint":
      jsonObject["stepMode"] = 3;
      break;
    case "Custommode":
      jsonObject["stepMode"] = 5;


    while (authStore.uploadFrequency.length > 0) {
    // 限制每次最多处理 41 个数据
    const batchSize = Math.min(41, authStore.uploadFrequency.length);
    let i = 0;
    let currentBatch = [];
  
    // 处理当前批次数据
    while (i < batchSize) {
        const currentFrequency = authStore.uploadFrequency[i];

        // 如果遇到混合数据（大于 100 和小于 100），按顺序处理
        if (currentBatch.length === 0 || 
            (currentFrequency > 100 && currentBatch[currentBatch.length - 1] > 100) || 
            (currentFrequency <= 100 && currentBatch[currentBatch.length - 1] <= 100)) {
            // 将数据添加到当前批次
            currentBatch.push(currentFrequency);
            i++;
        } else {    
            break;// 数据类型发生变化，停止当前批次
        }
    }

    // 处理当前批次
    for (let j = 0; j < currentBatch.length; j++) {
        jsonObject[`frequency${j + 1}`] = currentBatch[j];
        jsonObject[`frequencyPointPeriod${j + 1}`] = adjustValueByUnit(
            parseFloat(frequencyPointPeriod.value),
            frequencyPointPeriodUnit.value
        );
    }
    // 从上传的频率数据中移除已处理的部分
    authStore.uploadFrequency.splice(0, currentBatch.length);
    break;//等待下次接收到需要触发的信号
    } 
    break;//等待下次接收到需要触发的信号
  };


  // 起始频率
  jsonObject["startFrequency"] = adjustValueByUnit(
    parseFloat(startFrequency.value),
    startFrequencyUnit.value,
  );
  // 终止频率
  jsonObject["endFrequency"] = adjustValueByUnit(
    
    parseFloat(endFrequency.value),
    endFrequencyUnit.value,
  );
  // 频点次数
  jsonObject["frequencyPointPeriod"] = adjustValueByUnit(
    parseFloat(frequencyPointPeriod.value),
    frequencyPointPeriodUnit.value,
  );

  switch (currentMode.value) {
    // 直流电
    case "directCurrent":
      jsonObject["currentMode"] = 0;
      break;
    // 交流电
    case "alternatingCurrent":
      jsonObject["currentMode"] = 1;
      break;
  };

  // 循环次数
  jsonObject["loopTimes"] = parseInt(loopTimes.value);

  // 采集周期
  jsonObject["collectInterval"] = adjustValueByUnit(
    parseFloat(collectInterval.value),
    collectIntervalUnit.value,
  );

  //获取开始测试的时间挫
  timeValue.value = Date.now();
  jsonObject["timeStamp"] = Math.floor(timeValue.value / 1000)
  // // 给服务器发送用户信息
  jsonObject["user"] = localStorage.getItem('selectedUser');
  
  return JSON.stringify(jsonObject);
}; 


/**
 * 函数作用：点击开始测试时，触发的函数
 * 函数逻辑：
 * 1、将当前页面选择的testdata 的值传入 createSettingJson函数转化为所需的json协议
 * 2、------------------------------------清空当前循环次数-----当前循环次数该功能还未完善，需要和fpga、嵌入式讨论具体怎么收发每轮完成时前端接收到的信号
 * 3、设置时间戳，将时间戳存储到authStore.testStartTime中
  */   
const startTest =  (): void => {
  // authStore.currentPeak[]

  // 开始测试相关的代码
  // 1、使用WebSocket发送JSON给服务器，内容为开始测试，功能详见需求文档2.3.4
  if (authStore.websocket) {
    func["testdata"] = createSettingJson();
    const Func: { [key: string]: any } = {};
    Func["func"] = func;
    (authStore.websocket as WebSocket).send(JSON.stringify(Func));
    authStore.currentPeak = currentPeak.value;
    authStore.voltagePeak = voltagePeak.value;
    authStore.powerPeak = powerPeak.value;
  }
  authStore.workStatus = 'running';stepMode
 
  // 清空当前循环次数
  authStore.currentCycle = 1;
  //获取开始测试的时间挫
    
  timeValue.value = Date.now();

  authStore.testStartTime = Math.floor(timeValue.value);
  // localStorage.setItem("testStartTime", timeValue.value.toString());  
   
};
</script>

<style scoped></style>
