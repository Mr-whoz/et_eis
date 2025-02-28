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
      <div style="display: flex; justify-content: left">
        <el-button size="large" type="primary" @click="dialogVisible = true">
          <el-text size="large" style="color: white">数据导出</el-text>
        </el-button>
        <el-col :span="2"> 
          <!-- zhanwei  -->
        </el-col>
        
      </div>
 
    </el-col>

    <el-dialog v-model="dialogVisible" title="数据导出" width="30vw">
      <el-row>
        <el-col>
          <el-radio-group v-model="dataAmount">
            <!-- 全部导出的函数 -->
            <el-radio value="all" size="large">全部导出</el-radio>
             
                <!-- 按时间段导出的函数 -->
            <el-radio value="time" size="large" >按时间段导出</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row>

<!-- 按时间段导出时，显示时间选择器 -->
<el-row v-if="dataAmount === 'time'" style="margin-top: 20px;">
  <!-- 开始时间行 -->
      <el-col :span="24" style="margin-bottom: 10px;">
        <el-row>
        <el-config-provider :locale="zhCn">
            <div class="demonstration">开始时间：</div>
          <el-date-picker
          v-model="startDate"
          type="datetime"
        placeholder="选择开始时间"
          value-format="YYYY-MM-DD HH:mm:ss.SSS"
          style="width: 60%;"
        /></el-config-provider>
          </el-row>
        </el-col>
       <!-- 结束时间行 -->
        <el-col :span="24" style="margin-bottom: 10px;">
          <el-row>
            
              <el-config-provider :locale="zhCn">
              <div class="demonstration">结束时间：</div>
              <el-date-picker
              v-model="endDate"
              type="datetime"
              placeholder="选择结束时间"
              value-format="YYYY-MM-DD HH:mm:ss.SSS"
              style="width: 60%;"
              /></el-config-provider> 
            
            </el-row>
      </el-col>
    </el-row>
   <!-- 换行 -->
    <br />
        <el-col>
          <el-checkbox-group v-model="dataFormat">
            <el-checkbox label="csv 格式" value="csv" />
            <el-checkbox label="xlsx 格式" value="xlsx" />
            <el-checkbox label="xls 格式" value="xls" />
            <el-checkbox label="txt 格式" value="txt" />
          </el-checkbox-group>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="exportData">
          确认
        </el-button>
      </template>
    </el-dialog>
    <!-- ---------------------------------------- 第1行第1列组件 结束 ---------------------------------------- -->

    <!-- ---------------------------------------- 第1行第2列组件 开始 ---------------------------------------- -->
   
    <el-col :span="20">
      <el-select
              v-model="selectPlotDisplay"
              collapse-tags
              placeholder="选择展示图"
              style="width: 150px"
              >
              <el-option
                v-for="(item, index) in selectPlotDisplayArr "
                :key="index"
                :label="item"
                :value="item"/>
      </el-select>
      <br />
      <div v-if = "selectPlotDisplay == '奈奎斯特图'">
          <div ref="nyquistPlot"></div></div>
          <div v-if = "selectPlotDisplay == '奈奎斯特图-波特图'">
            <el-row>
              <el-col :span="12">
              <div ref="nyquistPlot"></div>
            </el-col>
            <el-col :span="11">
              <div ref="bodePlot"></div>
            </el-col>

            </el-row>
          </div>
      <div v-if = "selectPlotDisplay == '波特图'">
          <div ref="bodePlot"></div></div>
      <div v-if = "selectPlotDisplay == '波特图-模'">
          <div ref="bodeZPlot"></div></div>
      <div v-if = "selectPlotDisplay == '波特图-相位'">
      <div ref="bodePhasePlot"></div></div>
    </el-col>
    <!-- ---------------------------------------- 第1行第2列组件 结束 ---------------------------------------- -->
  </el-row>
  <br />
  <el-row>
    <el-col>
      <el-table :data="tableData"  height="350" stripe table-layout="auto" border  >
        <el-table-column fixed :width="200" prop="time" label="时间" sortable  show-overflow-tooltip />
        <el-table-column prop="current" label="电流"  sortable show-overflow-tooltip />
        <el-table-column prop="currentUnit" label="电流单位" show-overflow-tooltip />
        <el-table-column prop="voltage" label="电压" sortable show-overflow-tooltip />
        <el-table-column prop="voltageUnit" label="电压单位" show-overflow-tooltip />
        <el-table-column prop="impedance" label="阻抗" sortable show-overflow-tooltip />
        <el-table-column prop="impedanceUnit" label="阻抗单位" show-overflow-tooltip />
        <el-table-column prop="impedanceRealPart" label="阻抗实部" sortable show-overflow-tooltip/>
        <el-table-column prop="impedanceRealPartUnit" label="阻抗实部单位" show-overflow-tooltip />
        <el-table-column prop="impedanceImaginaryPart" label="阻抗虚部" sortable show-overflow-tooltip />
        <el-table-column prop="impedanceImaginaryPartUnit" label="阻抗虚部单位" show-overflow-tooltip />
        <el-table-column prop="phase" label="相位" sortable show-overflow-tooltip />
        <el-table-column prop="phaseUnit" label="相位单位" show-overflow-tooltip />
        <el-table-column prop="frequency" label="频率" sortable show-overflow-tooltip />
        <el-table-column prop="frequencyUnit" label="频率单位" show-overflow-tooltip />
        <el-table-column prop="power" label="功率" sortable show-overflow-tooltip />
        <el-table-column prop="powerUnit" label="功率单位" show-overflow-tooltip />
      </el-table>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onMounted, ref, computed ,watch, nextTick} from "vue";
import Plotly from "plotly.js-dist-min";
import { useAuthStore } from "@/stores/auth";
//导入日期选择器中文包
import zhCn from "element-plus/es/locale/lang/zh-cn";
//导入错误提示
import { ElMessage } from "element-plus";
import { saveAs } from "file-saver";//下载文件功能pnpm install file-saver
import * as XLSX from 'xlsx';

/* **************************************** 第1行第1列组件 开始 **************************************** */
//电流值
const current = computed(() => {
  return tableData.value.length > 0 ? tableData.value[0].current : null;  
});
const currentUnit = ref<string>("安/A");

//电压值
const voltage = computed(() => {
  return tableData.value.length > 0 ? tableData.value[0].voltage : null; 
});
const voltageUnit = ref<string>("伏/V");

//阻抗
const impedance = computed(() => {
  return tableData.value.length > 0 ? tableData.value[0].impedance : null;  
});
const impedanceUnit = ref<string>("欧姆/Ω" );

//阻抗实部
const impedanceRealPart = computed(() => {
  return tableData.value.length > 0 ? tableData.value[0].impedanceRealPart : null;  
});
const impedanceRealPartUnit = ref<string>("欧姆/Ω");

//阻抗虚部
const impedanceImaginaryPart = computed(() => {
  return tableData.value.length > 0 ? tableData.value[0].impedanceImaginaryPart : null;  
});
const impedanceImaginaryPartUnit = ref<string>("欧姆/Ω");


const authStore = useAuthStore(); // 获取 authStore 实例


//显示视图的数据表
//获取并且过滤无效值，遍历数组，将所有属性为空的无效数据过滤掉，然后再映射出新的数组，确保所有属性都有值
//在首位插入数据，使得最新的数据放到最前面的地方
const tableData = computed({
  get: () => {
    if (!Array.isArray(authStore.tableData)) {
      console.warn("authStore.tableData is not an array");
      return []; // 防止数据传进来为空值时 map 出错，无法渲染界面
    }
    return authStore.tableData
      .filter((item) => {
        // 过滤掉所有属性为空的无效数据
        return Object.values(item).some((value) => value !== "");
      })
      .map((item) => ({
        time: item.time || "",
        current: item.current || "",
        currentUnit: item.currentUnit || "",
        voltage: item.voltage || "",
        voltageUnit: item.voltageUnit || "",
        impedance: item.impedance || "",
        impedanceUnit: item.impedanceUnit || "",
        impedanceRealPart: item.impedanceRealPart || "",
        impedanceRealPartUnit: item.impedanceRealPartUnit || "",
        impedanceImaginaryPart: item.impedanceImaginaryPart || "",
        impedanceImaginaryPartUnit: item.impedanceImaginaryPartUnit || "",
        phase: item.phase || "",
        phaseUnit: item.phaseUnit || "",
        frequency: item.frequency || "",
        frequencyUnit: item.frequencyUnit || "",
        power: item.power || "",
        powerUnit: item.powerUnit || "",
      }));
  },
  set: (newData) => {
    const newTableData = newData.map((item: { 
      time: string; 
      current: string; currentUnit: string; 
      voltage: string; voltageUnit: string; 
      impedance: string; impedanceUnit: string; 
      impedanceRealPart: string; impedanceRealPartUnit: string; 
      impedanceImaginaryPart: string; impedanceImaginaryPartUnit: string; 
      phase: string; phaseUnit: string; 
      frequency: string; frequencyUnit: string; 
      power: string; powerUnit: string; 
    }) => ({
      time: item.time,
      current: item.current,
      currentUnit: item.currentUnit,
      voltage: item.voltage,
      voltageUnit: item.voltageUnit,
      impedance: item.impedance,
      impedanceUnit: item.impedanceUnit,
      impedanceRealPart: item.impedanceRealPart,
      impedanceRealPartUnit: item.impedanceRealPartUnit,
      impedanceImaginaryPart: item.impedanceImaginaryPart,
      impedanceImaginaryPartUnit: item.impedanceImaginaryPartUnit,
      phase: item.phase,
      phaseUnit: item.phaseUnit,
      frequency: item.frequency,
      frequencyUnit: item.frequencyUnit,
      power: item.power,
      powerUnit: item.powerUnit,
    }));

    // 在首位插入新数据
    authStore.tableData.splice(0, 0, ...newTableData);
  },
});


// -------------------------------模拟更新数据逻辑-后续确认接收数据完善后可以删除此段内容----------------------------------------------------
let timer: any;
const updateTableData = (i : number) => {
  const newData = {
    time: new Date().toISOString(),
    current:  1 + i+ "",
    currentUnit: "安/A",
    voltage: Math.random() * 220 + "",
    voltageUnit: "伏/V",
    impedance: 0.1+2*i+  "",
    impedanceUnit: "欧姆/Ω",
    impedanceRealPart: 1 +100*i+ "",
    impedanceRealPartUnit: "欧姆/Ω",
    impedanceImaginaryPart: 1 +50*i+ "",
    impedanceImaginaryPartUnit: "欧姆/Ω",
    phase: 1 +10*i + "",
    phaseUnit: "度（°）",
    frequency: 1 +300*i+ "",
    frequencyUnit: "赫兹/Hz",
    power: Math.random() * 1000 + "",
    powerUnit: "瓦/W",
  };
  tableData.value.unshift(newData); // 在首位插入新数据
  authStore.tableData = [...tableData.value]; // 更新 store 的数据
};

// let count = 0; // 初始化计数器
// onMounted(() => {
//   authStore.tableData = [];
//       timer = setInterval(() => {
//         updateTableData(count);
//         count++; // 每次更新数据时增加计数器的值
//         if (count >= 50) {
//           clearInterval(timer); // 当计数器达到50时，清除定时器
//         }
//       }, 5); // 每5秒更新一次
//     });


const dialogVisible = ref<boolean>(false);    //二次  确认/取消  信号
const dataAmount = ref<string>("all");
const dataFormat = ref<string[]>(["csv"]);

//导出开始时间
const startDate = ref<String | null>(null);
//导出结束时间
const endDate = ref<String | null>(null);


// 通过获取的表格数据，根据选择的不同类型执行导出操作
const exportDataByArr = (data: { 
  time: string; 
  current: string; currentUnit: string; 
  voltage: string; voltageUnit: string; 
  impedance: string; impedanceUnit: string; 
  impedanceRealPart: string; impedanceRealPartUnit: string; 
  impedanceImaginaryPart: string; impedanceImaginaryPartUnit: string; 
  phase: string; phaseUnit: string; 
  frequency: string; frequencyUnit: string; 
  power: string; powerUnit: string; 
}[], format: string)  =>{

  switch (format) {
      case "csv":
        exportAsCsv(data);
        break;
      case "xlsx":
      exportAsExcel(data);
        break;
      case "xls":
      exportAsExcel(data);
        break;
      case "txt":
      exportAsTxt(data);
        break;
      default:
      exportAsCsv(data);
    }
}



// 导出为 TXT
const exportAsTxt = (data: any[]) => {
  // 获取表头
  // const headers = Object.keys(data[0]).join("\t");
  const headers = [
    "时间", "电流", "电流单位", "电压", "电压单位", "阻抗", "阻抗单位",
    "阻抗实部", "阻抗实部单位", "阻抗虚部", "阻抗虚部单位", "相位", "相位单位",
    "频率", "频率单位", "功率", "功率单位"
  ];
  // 将数据行转换为字符串，并确保每行以制表符分隔
  const txtContent =
    headers + "\n" + // 将表头添加到内容中
    data
      .map((row: { [s: string]: unknown }) =>
        Object.values(row)
          .map((value) => (value !== undefined ? value : ""))
          .join("\t")
      )
      .join("\n");
  // 创建 Blob 对象，指定内容类型为文本
  const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
  // 使用 FileSaver 下载文件
  saveAs(blob, "data.txt");
};

    const exportAsCsv = (data: any[]) => {
  // 表头
      const headers = [
    "时间", "电流", "电流单位", "电压", "电压单位", "阻抗", "阻抗单位",
    "阻抗实部", "阻抗实部单位", "阻抗虚部", "阻抗虚部单位", "相位", "相位单位",
    "频率", "频率单位", "功率", "功率单位"
  ];
  // 数据内容
  const csvContent =
    headers + "\n" +
    data
      .map((row: { [s: string]: unknown }) =>
        Object.values(row)
          .map((value) =>
            typeof value === "string" && value.includes(",")
              ? `"${value}"` // 防止逗号导致错列
              : value
          )
          .join(",")
      )
      .join("\n");

  // 添加 UTF-8 BOM 以确保中文字符正确显示
  const bom = "\uFEFF";

  // 创建 Blob 对象，包含 BOM 和 CSV 内容
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(blob, "data.csv");
    };



 // 导出为 Excel格式文件
const exportAsExcel = (data: any[]) => {
  // 定义表头
  const headers = [
    "时间", "电流", "电流单位", "电压", "电压单位", "阻抗", "阻抗单位",
    "阻抗实部", "阻抗实部单位", "阻抗虚部", "阻抗虚部单位", "相位", "相位单位",
    "频率", "频率单位", "功率", "功率单位"
  ];

  // 使用自定义表头并将 JSON 数据转换为 Excel 工作表
  const worksheet = XLSX.utils.json_to_sheet(data, { header: [], skipHeader: true });

  // 手动添加表头
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

  // 创建一个新的工作簿
  const workbook = XLSX.utils.book_new();

  // 将工作表添加到工作簿中，并命名为 "Sheet1"
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 遍历数据格式，生成对应格式的 Excel 文件
  dataFormat.value.forEach((format) => {
    // 校验格式是否为支持的 xlsx 或 xls
    if (format !== "xlsx" && format !== "xls") {
      console.warn(`不支持的格式: ${format}`);
      return;
    }

    // 定义导出文件的 MIME 类型和扩展名
    let excelType: string;
    let excelExtension: string;

    if (format === "xlsx") {
      excelType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      excelExtension = ".xlsx";
    } else if (format === "xls") {
      excelType = "application/vnd.ms-excel";
      excelExtension = ".xls";
    }

    // 使用 XLSX.write 将工作簿写入字节数组
    const excelData = XLSX.write(workbook, {
      bookType: format as XLSX.BookType,
      type: 'array', // 输出为字节数组
    });
    excelType =
        format === "xlsx"
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : "application/vnd.ms-excel";
    excelExtension = format === "xlsx" ? ".xlsx" : ".xls";
      
    // 创建 Blob 对象，指定内容类型
    const blob = new Blob([excelData], { type: excelType });

    // 触发文件下载
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `data_${format}${excelExtension}`;
    link.click();
  });
};

// 检查时间的方法
  const checkDateRange = () => {
  if (!startDate.value || !endDate.value) {
    ElMessage.error('请填写完整的开始时间和结束时间！');
    return false; 
  }else if(endDate.value < startDate.value){
    ElMessage.error('结束时间必须大于开始时间！');
    return false;
  }else {
     //日期检查通过，开始存储timedata
  
     return true;
  }
};
//将符合条件的时间段内的数据数据存储在timeData中
const timeData = ref([
  {
    time: "",
    current: "",
    currentUnit: "安/A",

    voltage: "",
    voltageUnit: "伏/V",
    
    impedance: "",
    impedanceUnit: "欧姆/Ω",
    
    impedanceRealPart: "",
    impedanceRealPartUnit: "欧姆/Ω",
    
    impedanceImaginaryPart: "",
    impedanceImaginaryPartUnit: "欧姆/Ω",
    
    phase: "",
    phaseUnit: "度（°）",
    
    frequency: "",
    frequencyUnit: "赫兹/Hz",
    
    power: "",
    powerUnit: "瓦/W",
  }
]);

// 时间过滤方法  
//------------------------------- 过滤检测的时间格式为：2024-11-11 00:00:00.000的字符串，后续传输时间格式有变化需要修改--------------
const filterByTimeRange = () => {
  // 检查开始时间和结束时间是否有效
  if (!startDate.value || !endDate.value) {
    console.warn("请选择开始时间和结束时间！");
    return;
  }
  // 将开始和结束时间转换为 Date 对象
 // 转换时间为 ISO 8601 格式
 const start = new Date((startDate.value || "").replace(" ", "T"));
  const end = new Date((endDate.value || "").replace(" ", "T"));

  // 检查转换是否成功
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return;
  }

  // 筛选 tableData 中符合条件的记录
  timeData.value = tableData.value.filter((item) => {
    const itemTime = new Date(item.time.split(":").slice(0, 2).join(":")); // 截取并解析时间
    return itemTime >= start && itemTime <= end;
  });
};
//导出数据功能
const exportData = (): void => {
   //日期检查函数，检查是否在时间范围内以及结束时间大于开始时间
   if(dataAmount.value === 'all'){
       dataFormat.value.forEach(format => {
      exportDataByArr(tableData.value,format);});
    ElMessage.success("数据导出成功")
    
}else if(dataAmount.value === 'time'&&checkDateRange()){
  dataFormat.value.forEach(format => {
    filterByTimeRange();
    if(timeData.value.length == 0){
      ElMessage.error('没有符合条件的数据！');
    }else{
      exportDataByArr(timeData.value,format);
    }
    
});
}


}
/* **************************************** 第1行第1列组件 结束 **************************************** */

/* **************************************** 第1行第2列组件 开始 **************************************** */
const nyquistPlot = ref<HTMLDivElement>();
const bodeZPlot = ref<HTMLDivElement>();//波特图模长
const bodePhasePlot = ref<HTMLDivElement>();//波特图相位
const bodePlot = ref<HTMLDivElement>();//波特图
const selectPlotDisplayArr = ref<string[]>(["奈奎斯特图-波特图", "奈奎斯特图", "波特图","波特图-模", "波特图-相位"]);
const selectPlotDisplay = ref<string>("奈奎斯特图-波特图");
// const bodeData = ref([]);
const bodeData = ref<Plotly.Data[]>([]);  // 使用 Plotly.Data 类型来明确数据结构
    // 更新trace对象
  const trace = computed(() => {
  const data = tableData.value; // 从 tableData 获取数据
  return {
    x: data.map((item: { impedanceRealPart: string; }) => Number(item.impedanceRealPart) || 0), // 实部转数字
    y: data.map((item: { impedanceImaginaryPart: string; }) => -(Number(item.impedanceImaginaryPart) || 0)), // 虚部转数字并取反
    mode: "lines+markers",
    text: data.map((item: { frequency: string; }) => item.frequency || ""), // 频率信息
    hovertemplate: "Zr: %{x}<br />Zm: %{y}<br />freq: %{text}<extra></extra>",
  };
});


const layout = {
  title: "奈奎斯特图",
  xaxis: { title: "阻抗实部 Zr (Ω)" },
  yaxis: { title: "阻抗虚部的相反数 -Zm (Ω)" },
  aspectratio: { x: 1, y: 1 },
  // font: { size: 14 },
  titlefont: {
      size: 15, // 标题字体大小
      family: 'Arial, sans-serif', // 标题字体
    },
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

const drawNyquistPlot = (): void => {  //奈奎斯特图绘制
  if (nyquistPlot.value) {
    Plotly.newPlot(nyquistPlot.value, [trace.value], layout, config);
  }
};






const drawBodePlot = (): void => { 
  if (bodePlot.value) {
    const data = tableData.value;
if (data) {
  
  bodeData.value = [
    {
      x: data.map((item: { frequency: string; }) => Math.log10(Math.max(Number(item.frequency), 0.0001))),
      y: data.map((item: { impedance: string; }) => -(Number(item.impedance) || 0)),//阻抗
      text: data.map((item: { frequency: string; }) => item.frequency || ""),
      mode: "lines+markers",
      name: `|Z|`,
      hovertemplate: "频率: %{text}<br />|Z|: %{y}<extra></extra>",
      yaxis: "y",
      // line: { color: blue },
    },
    {
      x: data.map((item: { frequency: string; }) => Math.log10(Math.max(Number(item.frequency), 0.0001))),
      y: data.map((item: { phase: string; }) => -(Number(item.phase) || 0)),//相位
      text: data.map((item: { frequency: string; }) => item.frequency || ""),
      mode: "lines+markers",
      name: `Phase`,
      hovertemplate: "频率: %{text}<br />相位: %{y}<extra></extra>",
      yaxis: "y2",
      line: {
        dash: 'dash',
        // color: fileColor,
      },
      marker: {
        symbol: "triangle-up",
        size: 10,
      },
    },
  ].filter(trace => trace.x.length && trace.y.length);
}


    const layout = {
      title: {
    x: -1, // 标题在x轴上的位置，0表示最左边，1表示最右边
    y: 1, // 标题在y轴上的位置，0表示最底部，1表示最顶部
    xref: 'paper', // 相对于纸张的x位置
    yref: 'paper', // 相对于纸张的y位置
    text: "波特图", // 标题文本
    titlefont: {
      size: 15, // 标题字体大小
      family: 'Arial, sans-serif', // 标题字体
    },
  },
  
  xaxis: { title: "频率 (Hz/10^n)" },

  yaxis: {
    title: "|Z| (Ω)",
    side: "left",
    showgrid: true,
  },
  yaxis2: {
    title: "相位 (°)",
    side: "right",
    overlaying: "y", // 修正为与主Y轴重叠
    showgrid: true,
position: 0.95,
  },
  font: { size: 12},
  legend: {
        font: {size: 8,},// 设置图例中文本的大小
        x: -10,  // 将图例位置移至右边
        y: 1,     // 将图例放置到顶部
        xanchor: 'left',  // 设置图例左对齐
        yanchor: 'top',   // 设置图例顶部对齐
        traceorder: 'normal',
        bgcolor: 'rgba(255, 255, 255, 0.5)', // 设置图例的背景颜色
        bordercolor: 'rgba(0, 0, 0, 0.5)', // 设置图例的边框颜色
      },
      margin: {
        l: 30,  // 左边距
        r: 10, // 右边距，给图例更多的空间
        b: 40,  // 下边距
        t: 30,  // 上边距
      },
  hovermode: "x unified", // 悬浮显示一致性模式
} as Partial<Plotly.Layout>;

    const config: Partial<Plotly.Config> = {
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ["select2d", "lasso2d"],
      locale: "zh-CN",
    };

    Plotly.newPlot(bodePlot.value, bodeData.value, layout, config);
  }
};

const drawBodeZPlot = (): void => { 
  if (bodeZPlot.value) {
    const data = tableData.value;
if (data) {
  
  bodeData.value = [
    {
      x: data.map((item: { frequency: string; }) => Math.log10(Math.max(Number(item.frequency), 0.0001))),
      y: data.map((item: { impedance: string; }) => -(Number(item.impedance) || 0)),//阻抗
      text: data.map((item: { frequency: string; }) => item.frequency || ""),
      mode: "lines+markers",
      name: `|Z|`,
      hovertemplate: "频率: %{text}<br />|Z|: %{y}<extra></extra>",
      yaxis: "y",
     
    }
  ].filter(trace => trace.x.length && trace.y.length);
}


    const layout = {
      title: {
    x: -1, // 标题在x轴上的位置，0表示最左边，1表示最右边
    y: 1, // 标题在y轴上的位置，0表示最底部，1表示最顶部
    xref: 'paper', // 相对于纸张的x位置
    yref: 'paper', // 相对于纸张的y位置
    text: "波特图-模", // 标题文本
    titlefont: {
      size: 15, // 标题字体大小
      family: 'Arial, sans-serif', // 标题字体
    },
  },
  
  xaxis: { title: "频率 (Hz/10^n)" },

  yaxis: {
    title: "|Z| (Ω)",
    side: "left",
    showgrid: true,
  },
  font: { size: 12},

      margin: {
        l: 30,  // 左边距
        r: 10, // 右边距，给图例更多的空间
        b: 40,  // 下边距
        t: 30,  // 上边距
      },
  hovermode: "x unified", // 悬浮显示一致性模式
} as Partial<Plotly.Layout>;

    const config: Partial<Plotly.Config> = {
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ["select2d", "lasso2d"],
      locale: "zh-CN",
    };

    Plotly.newPlot(bodeZPlot.value, bodeData.value, layout, config);
  }
};

const drawBodePhasePlot = (): void => { 
  if (bodePhasePlot.value) {
    const data = tableData.value;
if (data) {
  
  bodeData.value = [

    {
      x: data.map((item: { frequency: string; }) => Math.log10(Math.max(Number(item.frequency), 0.0001))),
      y: data.map((item: { phase: string; }) => -(Number(item.phase) || 0)),//相位
      text: data.map((item: { frequency: string; }) => item.frequency || ""),
      mode: "lines+markers",
      name: `Phase`,
      hovertemplate: "频率: %{text}<br />相位: %{y}<extra></extra>",
      // yaxis: "y",
      line: {

      },
      marker: {
        // symbol: "triangle-up-open",
        size: 10,
      },
    },
  ].filter(trace => trace.x.length && trace.y.length);
}


    const layout = {
      title: {
    x: -1, // 标题在x轴上的位置，0表示最左边，1表示最右边
    y: 1, // 标题在y轴上的位置，0表示最底部，1表示最顶部
    xref: 'paper', // 相对于纸张的x位置
    yref: 'paper', // 相对于纸张的y位置
    text: "波特图-相位", // 标题文本
    titlefont: {
      size: 15, // 标题字体大小
      family: 'Arial, sans-serif', // 标题字体
    },
  },
  
  xaxis: { title: "频率 (Hz/10^n)" },
  yaxis: {title: "相位 (°)"},
  font: { size: 12},
      margin: {
        l:30,  // 左边距
        r: 10, // 右边距，给图例更多的空间
        b: 40,  // 下边距
        t: 30,  // 上边距
      },
  hovermode: "x unified", // 悬浮显示一致性模式
} as Partial<Plotly.Layout>;

    const config: Partial<Plotly.Config> = {
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ["select2d", "lasso2d"],
      locale: "zh-CN",
    };

    Plotly.newPlot(bodePhasePlot.value, bodeData.value, layout, config);
  }
};

// 监听 tableData 和 selectPlotDisplay 的变化  任何一个变化都更新图，实现切换以及数据更新时动态变化
watch([tableData, selectPlotDisplay], async ([newTableData,newSelectPlotDisplay]) => {
  
  if (newSelectPlotDisplay === '奈奎斯特图') {

    await nextTick();
    drawNyquistPlot();

  } else if (newSelectPlotDisplay === '波特图') {
    await nextTick();
    drawBodePlot();
  } else if (newSelectPlotDisplay === '波特图-模') {
    await nextTick();
    drawBodeZPlot();
  } else if (newSelectPlotDisplay === '波特图-相位') {
    await nextTick();
    drawBodePhasePlot();
  } else if (newSelectPlotDisplay === "奈奎斯特图-波特图") {
    await nextTick();
    drawNyquistPlot();
    drawBodePlot();
   }
});

onMounted(() => {
  //需要根据默认的选择图表   --- 加载组件 防止加载空白
  drawNyquistPlot();
  drawBodePlot();
  // drawBodeZPlot();
  // drawBodePhasePlot();
});
/* **************************************** 第1行第2列组件 结束 **************************************** */

/* **************************************** 第2行组件 开始 **************************************** */

/* **************************************** 第2行组件 结束 **************************************** */
</script>

<style scoped></style>
