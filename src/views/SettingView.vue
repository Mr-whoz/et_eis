<template>
  <div style="display: flex; justify-content: center">
    <el-button type="primary" @click="checkNumber">
      <el-text size="large" style="color: white">开始测试</el-text>
    </el-button>
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
                  placeholder="单位"
                  size="large"
                  style="width: 9vw"
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
      <el-card header="频率设置" style="height: 42.5vh">
        <el-row :gutter="20">
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
          <el-col :span="8">
            <el-select v-model="startFrequencyUnit" size="large">
              <el-option
                v-for="item in startFrequencyUnitOption"
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
            <el-text size="large">终止频率：</el-text>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="endFrequency"
              size="large"
              placeholder="请输入 终止频率"
            />
          </el-col>
          <el-col :span="8">
            <el-select v-model="endFrequencyUnit" size="large">
              <el-option
                v-for="item in endFrequencyUnitOption"
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
          <el-col v-if="stepMode === 'linearChange'" :span="8">
            <el-input
              v-model="stepValue"
              size="large"
              placeholder="请输入 步进值"
            />
          </el-col>
          <el-col v-if="stepMode === 'linearChange'" :span="4"
            ><!-- 纯占位，无意义 --></el-col
          >
          <el-col v-if="stepMode !== 'linearChange'" :span="12"
            ><!-- 纯占位，无意义 --></el-col
          >
        </el-row>
        <br />
        <el-row :gutter="20">
          <el-col
            :span="4"
            style="display: flex; justify-content: right; align-items: center"
          >
            <el-text size="large">频点周期：</el-text>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="frequencyPointPeriod"
              size="large"
              placeholder="请输入 频点周期"
            />
          </el-col>
          <el-col :span="8">
            <el-select v-model="frequencyPointPeriodUnit" size="large">
              <el-option
                v-for="item in frequencyPointPeriodUnitOption"
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
    <!-- ---------------------------------------- 第2行第1列组件 结束 ---------------------------------------- -->

    <!-- ---------------------------------------- 第2行第2列组件 开始 ---------------------------------------- -->
    <el-col :span="12">
      <el-card header="其他设置" style="height: 42.5vh">
        <el-row :gutter="20">
          <el-col
            :span="4"
            style="display: flex; justify-content: right; align-items: center"
          >
            <el-text size="large">循环次数：</el-text>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="loopTimes"
              size="large"
              placeholder="请输入 循环次数"
            />
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
            <el-input
              v-model="collectInterval"
              size="large"
              placeholder="请输入 采集周期"
            />
          </el-col>
          <el-col :span="8">
            <el-select v-model="collectIntervalUnit" size="large">
              <el-option
                v-for="item in collectIntervalUnitOption"
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
            <el-text size="large">显示周期：</el-text>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="displayInterval"
              size="large"
              placeholder="请输入 显示周期"
            />
          </el-col>
          <el-col :span="8">
            <el-select v-model="displayIntervalUnit" size="large">
              <el-option
                v-for="item in displayIntervalUnitOption"
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
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

/* **************************************** 第1行第1列组件 开始 **************************************** */
const workMode = ref<string>("eis");

const constantMode = ref<string>("");
const constantModeOption = [
  { value: "constantCurrent", label: "恒流 CC" },
  { value: "constantVoltage", label: "恒压 CV" },
  { value: "constantPower", label: "恒功率 CP" },
];

const valueType = ref<string>("");
const valueTypeOption = [
  { value: "peakValue", label: "峰值" },
  { value: "rootMeanSquareValue", label: "有效值" },
  { value: "peakToPeakValue", label: "峰峰值" },
];

const value = ref<string>("");

interface Option {
  value: string;
  label: string;
}

const currentUnitOption: Option[] = [
  { value: "ampere", label: "A" },
  { value: "kiloampere", label: "kA" },
  { value: "milliampere", label: "mA" },
];

const voltageUnitOption: Option[] = [
  { value: "volt", label: "V" },
  { value: "kilovolt", label: "kV" },
  { value: "millivolt", label: "mV" },
];

const powerUnitOption: Option[] = [
  { value: "watt", label: "W" },
  { value: "kilowatt", label: "kW" },
  { value: "milliwatt", label: "mW" },
];

const unit = ref<string>("");
const unitOption = ref<Option[]>([
  { value: "", label: "" },
  { value: "", label: "" },
  { value: "", label: "" },
]);

const isEISSelected = computed((): boolean => {
  return workMode.value === "eis";
});

const notConstantModeSelected = computed((): boolean => {
  return constantMode.value === "";
});

const handleConstantModeChange = (): void => {
  switch (constantMode.value) {
    case "constantCurrent":
      unit.value = "ampere";
      unitOption.value = currentUnitOption;
      break;
    case "constantVoltage":
      unit.value = "volt";
      unitOption.value = voltageUnitOption;
      break;
    case "constantPower":
      unit.value = "watt";
      unitOption.value = powerUnitOption;
      break;
  }
};
/* **************************************** 第1行第1列组件 结束 **************************************** */

/* **************************************** 第1行第2列组件 开始 **************************************** */
const currentPeak = ref<string>("");
const currentPeakUnit = ref<string>("ampere");
const currentPeakUnitOption = [
  { value: "ampere", label: "A" },
  { value: "kiloampere", label: "kA" },
  { value: "milliampere", label: "mA" },
];

const voltagePeak = ref<string>("");
const voltagePeakUnit = ref<string>("volt");
const voltagePeakUnitOption = [
  { value: "volt", label: "V" },
  { value: "kilovolt", label: "kV" },
  { value: "millivolt", label: "mV" },
];

const powerPeak = ref<string>("");
const powerPeakUnit = ref<string>("watt");
const powerPeakUnitOption = [
  { value: "watt", label: "W" },
  { value: "kilowatt", label: "kW" },
  { value: "milliwatt", label: "mW" },
];
/* **************************************** 第1行第2列组件 结束 **************************************** */

/* **************************************** 第2行第1列组件 开始 **************************************** */
const startFrequency = ref<string>("");
const startFrequencyUnit = ref<string>("hertz");
const startFrequencyUnitOption = [
  { value: "hertz", label: "Hz" },
  { value: "kilohertz", label: "kHz" },
  { value: "millihertz", label: "mHz" },
];

const endFrequency = ref<string>("");
const endFrequencyUnit = ref<string>("hertz");
const endFrequencyUnitOption = [
  { value: "hertz", label: "Hz" },
  { value: "kilohertz", label: "kHz" },
  { value: "millihertz", label: "mHz" },
];

const stepMode = ref<string>("logarithmicChange");
const stepModeOption = [
  { value: "logarithmicChange", label: "对数变化" },
  { value: "linearChange", label: "线性变化" },
  { value: "singlePoint", label: "单点" },
];

const stepValue = ref<string>("");

const frequencyPointPeriod = ref<string>("");
const frequencyPointPeriodUnit = ref<string>("millisecond");
const frequencyPointPeriodUnitOption = [
  { value: "millisecond", label: "毫秒" },
  { value: "second", label: "秒" },
  { value: "microsecond", label: "微秒" },
];
/* **************************************** 第2行第1列组件 结束 **************************************** */

/* **************************************** 第2行第2列组件 开始 **************************************** */
const loopTimes = ref<string>("");

const collectInterval = ref<string>("");
const collectIntervalUnit = ref<string>("millisecond");
const collectIntervalUnitOption = [
  { value: "millisecond", label: "毫秒" },
  { value: "microsecond", label: "微秒" },
  { value: "second", label: "秒" },
];

const displayInterval = ref<string>("");
const displayIntervalUnit = ref<string>("second");
const displayIntervalUnitOption = [
  { value: "second", label: "秒" },
  { value: "millisecond", label: "毫秒" },
  { value: "microsecond", label: "微秒" },
];
/* **************************************** 第2行第2列组件 结束 **************************************** */

const successDialogVisible = ref<boolean>(false);
const errorDialogVisible = ref<boolean>(false);
const errorMessage = ref<string[]>([]);

const checkNumber = (): void => {
  const checkValue: boolean = isEISSelected.value
    ? true
    : checkPositiveNumber(value.value); // 工作模式的值
  const checkCurrentPeak: boolean = checkPositiveNumber(currentPeak.value); // 电流峰值
  const checkVoltagePeak: boolean = checkPositiveNumber(voltagePeak.value); // 电压峰值
  const checkPowerPeak: boolean = checkPositiveNumber(powerPeak.value); // 功率峰值
  const checkStartFrequency: boolean = checkPositiveNumber(
    startFrequency.value,
  ); // 起始频率
  const checkEndFrequency: boolean = checkPositiveNumber(endFrequency.value); // 终止频率
  const checkFrequencyPointPeriod: boolean = checkPositiveNumber(
    frequencyPointPeriod.value,
  ); // 频点周期
  const checkLoopTimes: boolean = checkPositiveInteger(loopTimes.value); // 循环次数
  const checkCollectInterval: boolean = checkPositiveNumber(
    collectInterval.value,
  ); // 采集周期
  const checkDisplayInterval: boolean = checkPositiveNumber(
    displayInterval.value,
  ); // 显示周期

  const checkResult: boolean =
    checkValue && // 工作模式的值
    checkCurrentPeak && // 电流峰值
    checkVoltagePeak && // 电压峰值
    checkPowerPeak && // 功率峰值
    checkStartFrequency && // 起始频率
    checkEndFrequency && // 终止频率
    checkFrequencyPointPeriod && // 频点周期
    checkLoopTimes && // 循环次数
    checkCollectInterval && // 采集周期
    checkDisplayInterval; // 显示周期

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
    if (!checkStartFrequency) {
      errorMessage.value.push(
        "起始频率为：" +
          (startFrequency.value === "" ? "空" : startFrequency.value),
      );
    }
    if (!checkEndFrequency) {
      errorMessage.value.push(
        "终止频率为：" +
          (endFrequency.value === "" ? "空" : endFrequency.value),
      );
    }
    if (!checkFrequencyPointPeriod) {
      errorMessage.value.push(
        "频点周期为：" +
          (frequencyPointPeriod.value === ""
            ? "空"
            : frequencyPointPeriod.value),
      );
    }
    if (!checkLoopTimes) {
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
    if (!checkDisplayInterval) {
      errorMessage.value.push(
        "显示周期为：" +
          (displayInterval.value === "" ? "空" : displayInterval.value),
      );
    }

    errorDialogVisible.value = true;
  }
};

// 检查是否是正数
const checkPositiveNumber = (inputString: string | undefined): boolean => {
  const inputNumber: number = parseFloat(inputString ?? "");
  return !Number.isNaN(inputNumber) && inputNumber > 0;
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

const handleErrorDialogClose = (): void => {
  errorDialogVisible.value = false;
  errorMessage.value = [];
};

const adjustValueByUnit = (value: number, unit: string): number => {
  switch (unit) {
    case "kiloampere":
    case "kilovolt":
    case "kilowatt":
    case "kilohertz":
    case "second":
      return value * 1000;
    case "milliampere":
    case "millivolt":
    case "milliwatt":
    case "millihertz":
    case "microsecond":
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

const createSettingJson = (): string => {
  const jsonObject: { [key: string]: any } = {};

  // 工作模式
  if (workMode.value === "eis") {
    jsonObject["mode"] = "eis";
  } else if (workMode.value === "constant") {
    switch (constantMode.value) {
      // 恒流
      case "constantCurrent":
        jsonObject["mode"] = "cc";
        break;
      // 恒压
      case "constantVoltage":
        jsonObject["mode"] = "cv";
        break;
      // 恒功率
      case "constantPower":
        jsonObject["mode"] = "cp";
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

  switch (stepMode.value) {
    // 对数变化
    case "logarithmicChange":
      jsonObject["stepMode"] = 1;
      break;
    // 线性变化
    case "linearChange":
      jsonObject["stepMode"] = 2;
      jsonObject["stepSize"] = parseFloat(stepValue.value); // 步进值
      break;
    // 单点
    case "singlePoint":
      jsonObject["stepMode"] = 3;
      break;
  }

  // 频点周期
  jsonObject["frequencyPointPeriod"] = adjustValueByUnit(
    parseFloat(frequencyPointPeriod.value),
    frequencyPointPeriodUnit.value,
  );

  // 循环次数
  jsonObject["loopTimes"] = parseInt(loopTimes.value);

  // 采集周期
  jsonObject["collectInterval"] = adjustValueByUnit(
    parseFloat(collectInterval.value),
    collectIntervalUnit.value,
  );

  // 显示周期不用传给服务器

  return JSON.stringify(jsonObject);
};

const startTest = (): void => {
  // 开始测试相关的代码
  // 1、使用WebSocket发送JSON给服务器，内容为开始测试，功能详见需求文档2.3.4
  if (authStore.websocket) {
    (authStore.websocket as WebSocket).send(createSettingJson());
  }
};
</script>

<style scoped></style>
