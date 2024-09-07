<template>
  <el-row justify="end">
    <el-col :span="3">
      <el-upload :before-upload="beforeUpload">
        <el-button type="primary" size="large">
          <el-text size="large" style="color: white">上传文件</el-text>
        </el-button>
      </el-upload>
    </el-col>
    <el-col :span="3">
      <el-button size="large" @click="templateDownload = true">
        <el-text size="large">下载模板</el-text>
      </el-button>
    </el-col>
  </el-row>
  <br />
  <br />
  <el-row>
    <el-col>
      <!-- 此处的奈奎斯特图的样式与DataDisplayView.vue中的相同，如果修改了要同步过去 -->
      <div ref="nyquistPlot"></div>
    </el-col>
  </el-row>

  <el-dialog v-model="templateDownload" title="模板下载" width="30vw">
    <el-text size="large">请选择要下载的模板格式（可多选）：</el-text>
    <br />
    <!-- 设置了large但不知道为什么不生效 -->
    <el-checkbox-group v-model="dataFormat" size="large">
      <el-checkbox label="csv" value="csv" size="large" />
      <el-checkbox label="xlsx" value="xlsx" size="large" />
      <el-checkbox label="xls" value="xls" size="large" />
      <el-checkbox label="txt" value="txt" size="large" />
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
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import Papa from "papaparse";
import * as XLSX from "@e965/xlsx";
import Plotly from "plotly.js-dist-min";
import locale from "plotly.js-locales/zh-cn";

Plotly.register(locale);

const authStore = useAuthStore();
const nyquistPlot = ref<HTMLDivElement | null>(null);

/* **************************************** 第1行第1列组件 开始 **************************************** */
const allowedFileExtension: string[] = ["csv", "xlsx", "xls", "txt"];

// 检查选择的文件的格式
const beforeUpload = async (file: File): Promise<boolean> => {
  const fileExtension: string | undefined = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  if (!fileExtension || !allowedFileExtension.includes(fileExtension)) {
    ElMessage.error("只允许上传 csv、xlsx、xls、txt 格式的文件！请重新选择！");
    return false;
  }

  switch (fileExtension) {
    case "csv":
    case "txt":
      await handleCsvAndTxt(file);
      break;
    case "xlsx":
    case "xls":
      await handleExcel(file);
      break;
    default:
      ElMessage.error(
        "只允许上传 csv、xlsx、xls、txt 格式的文件！请重新选择！",
      );
  }

  return false; // 阻止自动上传，因为我们已经手动处理了文件
};

const handleCsvAndTxt = async (file: File): Promise<void> => {
  const text: string = await file.text();
  parseString(text);
};

const handleExcel = async (file: File): Promise<void> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0]; // 默认第一个工作表
  const sheet = workbook.Sheets[sheetName];
  const csvData = XLSX.utils.sheet_to_csv(sheet);
  parseString(csvData);
};

const parseString = (text: string): void => {
  Papa.parse(text, {
    header: true, // 需要解析CSV表头
    skipEmptyLines: true, // 跳过空行
    complete: function (result: Papa.ParseResult<unknown>): void {
      // 将中文表头转换为英文表头
      const data: { frequency: number; zr: number; zm: number }[] = (
        result.data as Array<{
          [key: string]: string;
        }>
      ).map((row) => ({
        frequency: parseFloat(row["频率(Hz)"]),
        zr: parseFloat(row["Zr(mΩ)"]),
        zm: parseFloat(row["Zm(mΩ)"]),
      }));

      const xData = data.map((item) => item.zr);
      const yData = data.map((item) => -item.zm); // 注意阻抗虚部要取相反数
      const textData = data.map((item) => item.frequency);

      authStore.updateNyquistPlotData(xData, yData, textData);

      // 保存数据到 localStorage
      authStore.saveNyquistPlotData();

      drawNyquistPlot();
    },
  });
};
/* **************************************** 第1行第1列组件 结束 **************************************** */

/* **************************************** 第1行第2列组件 开始 **************************************** */
const drawNyquistPlot = (): void => {
  if (nyquistPlot.value) {
    const trace = {
      x: authStore.nyquistPlotData.x,
      y: authStore.nyquistPlotData.y,
      text: authStore.nyquistPlotData.text,
      mode: "lines+markers",
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
      locale: "zh-CN",
    };

    Plotly.newPlot(nyquistPlot.value, [trace], layout, config);
  }
};

const templateDownload = ref<boolean>(false);
const dataFormat = ref<string[]>(["csv"]);

const confirmDownload = (): void => {
  templateDownload.value = false;
  dataFormat.value.forEach((format) => {
    const link = document.createElement("a");
    link.href = `/eis_template/eis_template.${format}`;
    link.setAttribute("download", `eis_template.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};
/* **************************************** 第1行第2列组件 结束 **************************************** */

onMounted(() => {
  authStore.loadNyquistPlotData();
  drawNyquistPlot();
});
</script>

<style scoped></style>
