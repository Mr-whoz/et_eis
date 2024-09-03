<template>
  <el-row :gutter="20">
    <!-- ---------------------------------------- 第1行第1列组件 开始 ---------------------------------------- -->
    <el-col :span="4">
      <br />
      <el-card header="实时数据">
        <el-row>
          <el-col>实时电流：{{ current }} {{ currentUnit }}</el-col>
        </el-row>
        <br />
        <el-row>
          <el-col>实时电压：{{ voltage }} {{ voltageUnit }}</el-col>
        </el-row>
        <br />
        <el-row>
          <el-col>实时阻抗：{{ impedance }} {{ impedanceUnit }}</el-col>
        </el-row>
        <br />
        <el-row>
          <el-col
            >实时阻抗实部：{{ impedanceRealPart }}
            {{ impedanceRealPartUnit }}
          </el-col>
        </el-row>
        <br />
        <el-row>
          <el-col
            >实时阻抗虚部：{{ impedanceImaginaryPart }}
            {{ impedanceImaginaryPartUnit }}
          </el-col>
        </el-row>
      </el-card>
      <br />
      <div style="display: flex; justify-content: center">
        <el-button size="large" type="primary" @click="">
          <el-text size="large" style="color: white">数据导出</el-text>
        </el-button>
      </div>
    </el-col>
    <!-- ---------------------------------------- 第1行第1列组件 结束 ---------------------------------------- -->

    <!-- ---------------------------------------- 第1行第2列组件 开始 ---------------------------------------- -->
    <el-col :span="20">
      <div ref="nyquistPlot"></div>
    </el-col>
    <!-- ---------------------------------------- 第1行第2列组件 结束 ---------------------------------------- -->
  </el-row>
  <br />
  <el-row>
    <el-col>
      <el-table :data="tableData" table-layout="auto" border>
        <el-table-column
          fixed
          :width="200"
          prop="time"
          label="时间"
          show-overflow-tooltip
        />
        <el-table-column prop="current" label="电流" show-overflow-tooltip />
        <el-table-column prop="voltage" label="电压" show-overflow-tooltip />
        <el-table-column prop="impedance" label="阻抗" show-overflow-tooltip />
        <el-table-column
          prop="impedanceRealPart"
          label="阻抗实部"
          show-overflow-tooltip
        />
        <el-table-column
          prop="impedanceImaginaryPart"
          label="阻抗虚部"
          show-overflow-tooltip
        />
        <el-table-column prop="phase" label="相位" show-overflow-tooltip />
        <el-table-column prop="frequency" label="频率" show-overflow-tooltip />
        <el-table-column prop="power" label="功率" show-overflow-tooltip />
      </el-table>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Plotly from "plotly.js-dist-min";
import locale from "plotly.js-locales/zh-cn";

Plotly.register(locale);

/* **************************************** 第1行第1列组件 开始 **************************************** */
const current = ref<number>(0);
const currentUnit = ref<string>("A");

const voltage = ref<number>(0);
const voltageUnit = ref<string>("V");

const impedance = ref<number>(0);
const impedanceUnit = ref<string>("Ω");

const impedanceRealPart = ref<number>(0);
const impedanceRealPartUnit = ref<string>("Ω");

const impedanceImaginaryPart = ref<number>(0);
const impedanceImaginaryPartUnit = ref<string>("Ω");
/* **************************************** 第1行第1列组件 结束 **************************************** */

/* **************************************** 第1行第2列组件 开始 **************************************** */
const nyquistPlot = ref<HTMLDivElement>();

const trace = {
  x: [
    22.18876, 20.28818, 21.5177, 23.85837, 26.94758, 30.89193, 35.59193,
    41.5116, 48.7025, 57.74167, 68.90192, 82.60716, 99.84415, 121.505, 149.9691,
    187.4242, 237.1123, 303.5806, 389.9037, 497.9197, 626.0485, 768.3243,
    914.2151,
  ],
  // 注意阻抗虚部要取相反数
  y: [
    30.881666, 30.84411, 34.71912, 40.5696, 48.3089, 57.77044, 69.21171,
    82.81869, 99.08334, 118.4924, 141.6743, 169.4477, 202.3268, 242.1719,
    288.4679, 342.3268, 402.8983, 468.3376, 534.3851, 594.0023, 638.979,
    661.9799, 655.8112,
  ],
  mode: "lines+markers",
  text: [
    1000, 794.3282, 630.9573, 501.1872, 398.1071, 316.2277, 350.1234, 199.5262,
    158.4893, 125.8925, 99.99997, 79.4328, 63.09571, 50.1187, 39.8107, 31.62276,
    25.11885, 19.95261, 15.84892, 12.58925, 9.999994, 7.943277, 6.309569,
  ],
  hovertemplate: "Zr: %{x}<br />Zm: %{y}<br />freq: %{text}<extra></extra>",
};

const layout = {
  title: "奈奎斯特图",
  xaxis: { title: "阻抗实部 Zr (mΩ)" },
  yaxis: { title: "阻抗虚部的相反数 -Zm (mΩ)" },
  aspectratio: { x: 1, y: 1 },
  font: { size: 14 },
};

const config: Partial<Plotly.Config> = {
  displayModeBar: true,
  displaylogo: false,
  modeBarButtonsToRemove: ["select2d", "lasso2d"],
  toImageButtonOptions: {
    scale: 2, // 将scale设置为2，图像将变得清晰
  },
  locale: "zh-CN",
};

const drawNyquistPlot = (): void => {
  if (nyquistPlot.value) {
    Plotly.newPlot(nyquistPlot.value, [trace], layout, config);
  }
};

onMounted(() => {
  drawNyquistPlot();
});
/* **************************************** 第1行第2列组件 结束 **************************************** */

/* **************************************** 第2行组件 开始 **************************************** */
const tableData = [
  {
    time: "2024-12-31 09:48:16.789",
    current: "2 A",
    voltage: "10 V",
    impedance: "5 Ω",
    impedanceRealPart: "3 Ω",
    impedanceImaginaryPart: "4 Ω",
    phase: "6 °",
    frequency: "800 Hz",
    power: "20 W",
  },
  {
    time: "2024-12-31 09:48:16.789",
    current: "2 A",
    voltage: "10 V",
    impedance: "5 Ω",
    impedanceRealPart: "3 Ω",
    impedanceImaginaryPart: "4 Ω",
    phase: "6 °",
    frequency: "800 Hz",
    power: "20 W",
  },
  {
    time: "2024-12-31 09:48:16.789",
    current: "2 A",
    voltage: "10 V",
    impedance: "5 Ω",
    impedanceRealPart: "3 Ω",
    impedanceImaginaryPart: "4 Ω",
    phase: "6 °",
    frequency: "800 Hz",
    power: "20 W",
  },
  {
    time: "2024-12-31 09:48:16.789",
    current: "2 A",
    voltage: "10 V",
    impedance: "5 Ω",
    impedanceRealPart: "3 Ω",
    impedanceImaginaryPart: "4 Ω",
    phase: "6 °",
    frequency: "800 Hz",
    power: "20 W",
  },
  {
    time: "2024-12-31 09:48:16.789",
    current: "2 A",
    voltage: "10 V",
    impedance: "5 Ω",
    impedanceRealPart: "3 Ω",
    impedanceImaginaryPart: "4 Ω",
    phase: "6 °",
    frequency: "800 Hz",
    power: "20 W",
  },
  {
    time: "2024-12-31 09:48:16.789",
    current: "2 A",
    voltage: "10 V",
    impedance: "5 Ω",
    impedanceRealPart: "3 Ω",
    impedanceImaginaryPart: "4 Ω",
    phase: "6 °",
    frequency: "800 Hz",
    power: "20 W",
  },
  {
    time: "2024-12-31 09:48:16.789",
    current: "2 A",
    voltage: "10 V",
    impedance: "5 Ω",
    impedanceRealPart: "3 Ω",
    impedanceImaginaryPart: "4 Ω",
    phase: "6 °",
    frequency: "800 Hz",
    power: "20 W",
  },
  {
    time: "2024-12-31 09:48:16.789",
    current: "2 A",
    voltage: "10 V",
    impedance: "5 Ω",
    impedanceRealPart: "3 Ω",
    impedanceImaginaryPart: "4 Ω",
    phase: "6 °",
    frequency: "800 Hz",
    power: "20 W",
  },
  {
    time: "2024-12-31 09:48:16.789",
    current: "2 A",
    voltage: "10 V",
    impedance: "5 Ω",
    impedanceRealPart: "3 Ω",
    impedanceImaginaryPart: "4 Ω",
    phase: "6 °",
    frequency: "800 Hz",
    power: "20 W",
  },
  {
    time: "2024-12-31 09:48:16.789",
    current: "2 A",
    voltage: "10 V",
    impedance: "5 Ω",
    impedanceRealPart: "3 Ω",
    impedanceImaginaryPart: "4 Ω",
    phase: "6 °",
    frequency: "800 Hz",
    power: "20 W",
  },
  {
    time: "",
    current: "",
    voltage: "",
    impedance: "",
    impedanceRealPart: "",
    impedanceImaginaryPart: "",
    phase: "",
    frequency: "",
    power: "",
  },
];
/* **************************************** 第2行组件 结束 **************************************** */
</script>

<style scoped></style>
