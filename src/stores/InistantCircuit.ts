
import { create, all, max} from 'mathjs';
import { ref, watch } from 'vue';

// 创建 mathjs 实例
const math = create(all);

// 定义电路模型类型       
type CircuitModel = "Rs_C" | "Rp_C" | "Rs_(CRp)" | "Rs_L" | "Rs_CPE" | "Rs_(CPERp)" | "Rp_CPE";
 
// 定义电路模型的拟合函数
//传入参数为对象-----电路类型，自动找到匹配的电路计算实部虚部 ，返回计算出的阻抗的实部和虚部
const circuitFitFunctions: { [key in CircuitModel]: Function } = {
  "Rs_C": (params: { Rs: number; C: number; }, f: number) => {
    const w = 2 * Math.PI * f; // 角频率

    const realPart = params.Rs ; // 
    const imagPart = (-1)/ (w*params.C); 

    return {
      re: realPart, // 阻抗的实部
      im: imagPart // 阻抗的虚部
  };
  },

  "Rp_C": (params: { C: number; Rp: number; }, f: number) => {
    const w = 2 * Math.PI * f; // 角频率
      const realPart = params.Rp / (1+Math.pow((w*params.C*params.Rp),2)); // 
      const imagPart = (-1*(w*Math.pow(params.Rp,2)*params.C))/ (1+Math.pow((w*params.C*params.Rp),2)); 
      return {
        re: realPart, // 阻抗的实部
        im: imagPart // 阻抗的虚部
    };
  },

  "Rs_L": (params: { Rs: number; L: number; }, f: number) => {
    const w = 2 * Math.PI * f; // 角频率
    const realPart = params.Rs ; // 
    const imagPart = (w*params.L); 
    return {
      re: realPart, // 阻抗的实部
      im: imagPart // 阻抗的虚部
  };
  },

  "Rs_(CRp)": (params: { Rs: number; C: number; Rp: number; }, f: number) => {
    const w = 2 * Math.PI * f; // 角频率
    const realPart = params.Rs+(params.Rp / (1+Math.pow((w*params.C*params.Rp),2))); // 
    const imagPart = (-1*(w*Math.pow(params.Rp,2)*params.C))/ (1+Math.pow((w*params.C*params.Rp),2)); 
    return {
      re: realPart, // 阻抗的实部
      im: imagPart // 阻抗的虚部
  };
  },

  "Rs_CPE": (params: { Rs: number; Q:number;n:number; }, f: number) => {
    const w = 2 * Math.PI * f; // 角频率
    const realPart = params.Rs+((Math.cos((params.n*Math.PI)/2))/(params.Q*Math.pow(w,params.n))) ; // Rs+(cos(n*pi/2)/Qw^n)
    const imagPart = (-1*( Math.sin((params.n*Math.PI)/2) ) / (params.Q*Math.pow(w,params.n))); // -sin(n*pi/2)/Qw^n)
 
    return {
      re: realPart, // 阻抗的实部
      im: imagPart // 阻抗的虚部
  };
  },
  "Rp_CPE": (params: { Rp: number; Q:number;n:number; }, f: number) => {
    const w = 2 * Math.PI * f; // 角频率
    const {Rp,Q,n}=params;
    const realPart = (((1/Rp)+(Q*Math.pow(w,n)*Math.cos((n*Math.PI)/2)))/( (Math.pow((((1/Rp)+(Q*Math.pow(w,n)*Math.cos((n*Math.PI)/2)))),2))+(Math.pow((Q*Math.pow(w,n)*Math.sin((n*Math.PI)/2)),2)) ));
  const imagPart =(-1*((Q*Math.pow(w,n)*Math.sin((n*Math.PI)/2)))/((Math.pow((((1/Rp)+(Q*Math.pow(w,n)*Math.cos((n*Math.PI)/2)))),2))+(Math.pow((Q*Math.pow(w,n)*Math.sin((n*Math.PI)/2)),2))));
    return {
      re: realPart, // 阻抗的实部
      im: imagPart // 阻抗的虚部
  };
  },

  "Rs_(CPERp)": (params: { Rs: number; Rp: number; Q:number;n:number;}, f: number) => {
    const w = 2 * Math.PI * f; // 角频率
  const {Rs,Rp,Q,n}=params;
    const moleculeReal =((1/params.Rp)+(params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2)));//实部分子
    const moleculeImag = -1*((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)));//虚部分子
    const denom =( (Math.pow((((1/params.Rp)+(params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2)))),2))+(Math.pow((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)),2)) ); //分母
  return {
    re: Rs+moleculeReal/denom, // 阻抗的实部
    im: moleculeImag/denom // 阻抗的虚部
};
  },

};


//传入参数1：电路类型 传入参数2：字典数组
//根据电路类型，生成对象类型，以电路参数作为键，储存到字典数组parms[]中作为值 生成对应的对象类型，并返回；
function convertArrayToObject(model: CircuitModel, params: number[]): { [key: string]: number } {
  let paramsObject: { [key: string]: number } = {};

  switch (model) {
    case "Rp_C":
      paramsObject = { Rp: params[0], C: params[1] };
      break;
    case "Rs_C":
      paramsObject = { Rs: params[0], C: params[1] };
      break;
    case "Rs_L":
      paramsObject = { Rs: params[0], L: params[1] };
      break;
    case "Rs_(CRp)":
      paramsObject = { Rs: params[0], C: params[1], Rp: params[2] };
      break;
    case "Rs_CPE":
      paramsObject = { Rs: params[0], Q: params[1],n: params[2] };
    break;
    case "Rp_CPE":
      paramsObject = { Rp: params[0], Q: params[1],n: params[2] };
    break;
    case "Rs_(CPERp)":
        paramsObject = { Rs: params[0], Rp: params[1] , Q: params[2], n: params[3]};
    break;
    default:
      throw new Error("Unsupported model");
  }

  return paramsObject;
}

// 电路模型参数拟合（基于最小二乘法和梯度下降）
function fitParams(frequency: number[], realPart: number[], imagPart: number[], model: CircuitModel): { [key: string]: number } {
  const w = frequency.map(f => 2 * Math.PI * f); // 频率转换为角频率

  const maxImaginaryIndex = imagPart.indexOf(Math.max(...imagPart));// 找到虚部最大的值及其索引
  const dataFront=estimateCircle(realPart,imagPart);//调用估计圆心、半径的函数

  const R_Left = dataFront.intersection2;  //和x轴左边交点
  const R_Right = dataFront.intersection1;  //和x轴右边交点
  // 获取拟合函数
  const fitFunc = circuitFitFunctions[model];

  if (!fitFunc) {
    throw new Error(`No fitting function defined for model ${model}`);
  }

  // 初始化参数
  let initialParams: number[] = [];

  // 计算最大频率（w_max）
  const w_max = Math.max(...w);
  const w_min = Math.min(...w);
  // 根据模型选择初始参数
  switch (model) {
    case "Rp_C":
   
      const Rp_C_R=R_Right-R_Left;
      // const Rp_C_R = Math.max(...realPart); // 使用实部的最大值作为R
      const Rp_C_C=1/((frequency[maxImaginaryIndex]*2*Math.PI)*Rp_C_R)
      // const tempRp_C = optimizeCParams(frequency,realPart,imagPart,"Rp_C",initialParams);
      // const Rp_C_C = tempRp_C.C; // 计算C
      initialParams = [Rp_C_R, Rp_C_C]; // Rs, C
      break;
    case "Rs_C":
      // const Rs_C_temp = realPart.reduce(accumlater,); // 求均值
      const Rs_C_R =calculateMean(realPart); // 使用实部的均值作为R
      // const Rs_C_C = 1 / (imagPart[maxImaginaryIndex] * w_min); // 计算C
      const tempRs_C = optimizeCParams(frequency,realPart,imagPart,"Rs_C",initialParams);
      const Rs_C_C = tempRs_C.C; // 计算C
      initialParams = [Rs_C_R, Rs_C_C]; // Rs, C
      break;
    case "Rs_L":
      const R_L_R = calculateMean(realPart);; // 使用实部的最大值作为R
     // 估算电感 L
    const slopes: number[] = [];
    for (let i = 3; i < frequency.length; i++) {
      const deltaZi = imagPart[i] - imagPart[i - 3];
      const deltaF = frequency[i] - frequency[i - 3];
      slopes.push(deltaZi / deltaF);
    }
    const averageSlope = slopes.reduce((sum, val) => sum + val, 0) / slopes.length; // 平均斜率
    const R_L_L = -averageSlope / (2 * Math.PI);

      initialParams = [R_L_R, R_L_L]; // Rs, L
      break;
      case "Rp_CPE":
        const Rp_CPE_Rp=R_Right-R_Left;
        
        const dataFront2=estimateCircle(realPart,imagPart);//调用估计圆心、半径的函数
        const alpha1=Math.atan((dataFront2.center.x)/dataFront2.radius);
        const Rp_CPE_Rs_CPE_Rp_Q1 =(Math.sin((alpha1*Math.PI)/2))/(2*(Math.pow((frequency[maxImaginaryIndex]*2*Math.PI),alpha1)*(imagPart[maxImaginaryIndex])))
        const temp1= optimizeRpCPEParams(frequency,realPart,imagPart,"Rp_CPE",[Rp_CPE_Rp,Rp_CPE_Rs_CPE_Rp_Q1, alpha1+0.1*alpha1])  ; 
        const Rp_CPE_n =temp1.n;
        const Rp_CPE_Q=temp1.Q;
        initialParams = [ Rp_CPE_Rp,Rp_CPE_Q, Rp_CPE_n]; // Rp, Q, n
      break
    case "Rs_(CRp)":
      const Rs=R_Left;
      const Rp=R_Right-R_Left;
      const C=1/((frequency[maxImaginaryIndex]*2*Math.PI)*Rp)
      initialParams = [Rs, C,Rp];
      break;
    case "Rs_(CPERp)":
      // Q 和 n 的估算
      const dataFront1=estimateCircle(realPart,imagPart);//调用估计圆心、半径的函数
        const Rs_CPE_Rp_Rs = R_Left;
        const Rs_CPE_Rp_Rp =R_Right-R_Left;
        const alpha=Math.atan((dataFront1.center.x-Rs_CPE_Rp_Rs)/dataFront1.radius);
        const Rs_CPE_Rp_Q1 =(Math.sin((alpha*Math.PI)/2))/(2*(Math.pow((frequency[maxImaginaryIndex]*2*Math.PI),alpha)*(imagPart[maxImaginaryIndex])))
        const temp= optimizeRpCPEParams(frequency,realPart,imagPart,"Rs_(CPERp)",[Rs_CPE_Rp_Rs,Rs_CPE_Rp_Rp,Rs_CPE_Rp_Q1, alpha+0.1*alpha])  ; 
        const Rs_CPE_Rp_n =temp.n;
        const Rs_CPE_Rp_Q=temp.Q;
        initialParams = [Rs_CPE_Rp_Rs, Rs_CPE_Rp_Rp,Rs_CPE_Rp_Q, Rs_CPE_Rp_n]; // Rs, Rp, Q, n
        break;
    default:
      throw new Error("Unsupported model");
  }
  // 确保我们传递的参数是完整的
  if (initialParams.some((param) => param === undefined || param === null)) {
    throw new Error(`Missing required parameters for model ${model}`);
  }
   const estimatedParams = optimizeCircuitParams(frequency, realPart, imagPart, model, initialParams); 
   const bestestimatedParams = convertArrayToObject(model,estimatedParams);
  return bestestimatedParams;
}

function computeGradient(frequency: number[], realPart: number[], imagPart: number[], model: CircuitModel, params:number[] , h: number = 0.01): number[] {
  const gradient: number[] = [];

 // 对每个参数计算梯度
 for (let i = 0; i < params.length; i++) {
   const originalValue = params[i];

   // 增加h计算误差平方和
   params[i] = originalValue + h;
   let paramsObjectPlus = convertArrayToObject(model, params);  // 更新参数对象
   const ssePlus = calculateSSE(frequency, realPart, imagPart, model, paramsObjectPlus);

   // 减少h计算误差平方和
   params[i] = originalValue - h;
   let paramsObjectMinus = convertArrayToObject(model, params);  // 更新参数对象
   const sseMinus = calculateSSE(frequency, realPart, imagPart, model, paramsObjectMinus);

   // 恢复原始参数
   params[i] = originalValue;

   // 计算梯度
   const grad = (ssePlus - sseMinus) / (2 * h);
   gradient.push(grad);
 }

 return gradient;
}
function optimizeCircuitParams(
  frequency: number[], 
  realPart: number[], 
  imagPart: number[], 
  model: CircuitModel, 
  initialParams: number[], 
  learningRate: number = 0.01, 
  tolerance: number = 1e-6, 
  maxIterations: number = 1000
): number[] {
  let params = [...initialParams];  // 初始化参数
  let iteration = 0;
  let bestParams = [...params]; // 最优参数
  const paramsObject = convertArrayToObject(model, params);  // 初始化参数对象
  let bestSSE = calculateSSE(frequency, realPart, imagPart, model, paramsObject);  // 初始误差平方和
  while (iteration < maxIterations) {
    const gradient = computeGradient(frequency, realPart, imagPart, model, params);
    let paramsChanged = false;
    // 更新参数
    for (let i = 0; i < gradient.length; i++) {
      params[i] = params[i] - learningRate * gradient[i];
    }
    // 计算新的误差平方和
    const newSSE = calculateSSE(frequency, realPart, imagPart, model, paramsObject);
    
    // 如果新的SSE更小，则更新最优参数
    if (newSSE < bestSSE) {
      bestSSE = newSSE;
      bestParams = [...params];
      paramsChanged = true;
    }
    // 如果误差没有改善，认为已经收敛
    if (!paramsChanged || Math.abs(newSSE - bestSSE) < tolerance) {
      break;
    }
    iteration++;
  }

  return bestParams;
}

// 计算误差平方和（SSE）
function calculateSSE(frequency: number[], realPart: number[], imagPart: number[], model: CircuitModel, paramsObject: { [key: string]: number }): number {
  let sse = 0;  // Sum of Squared Errors (SSE)
  
  // const w = frequency.map(f => 2 * Math.PI * f); // 频率转换为角频率
let w: number[] = [];
  // 获取当前模型的拟合函数
  const fitFunc = circuitFitFunctions[model];
  for (let i = 0; i < frequency.length; i++) {
    w.push(2 * Math.PI * frequency[i]);
    const estimatedImpedance = fitFunc(paramsObject, w[i]);
    sse += Math.pow(estimatedImpedance.re - realPart[i], 2) + Math.pow(estimatedImpedance.im - imagPart[i], 2);
  }
  return sse;
}

function optimizeRpCPEParams(
  frequency: number[], // 频率数组
  realPart: number[], // 实部数组
  imagPart: number[], // 虚部数组
  model: CircuitModel,
  initialParams: number[]
): { Q: number; n: number } {
  // 找到虚部峰值对应的频率
  const maxImaginaryIndex = imagPart.indexOf(Math.max(...imagPart));
  const f_peak = frequency[maxImaginaryIndex]; // 特征频率
  const w_peak = 2 * Math.PI * f_peak; // 特征角频率

  // 获取初始参数对象
  let paramsObject = convertArrayToObject(model, initialParams);
  let n = paramsObject.n;
  // 初始化变量
  const imagPeak = imagPart[maxImaginaryIndex];
  let calculatedImaginaryPartArray: number[] = [];
  let calculatedImaginaryPart: number;
  let calculatedRealPartArray: number[] = [];
  let calculatedRealPart: number;
  // 允许的误差范围
  const tolerance = 1;
  const maxIterations = 10000; // 最大迭代次数
  let iterations = 0;
  let lockN:boolean=false;
  while (iterations < maxIterations) {
    // 重新计算虚部数组
    calculatedImaginaryPartArray = frequency.map((f) => {
      const fitResult = circuitFitFunctions[model](paramsObject, f);
     
      return Math.abs(fitResult.im);
    });
    // 找到最大虚部及其索引
    const maxIndex = calculatedImaginaryPartArray.indexOf(
      Math.max(...calculatedImaginaryPartArray)
    );
    calculatedImaginaryPart = calculatedImaginaryPartArray[maxIndex];
    // 判断误差是否在容许范围
    if (Math.abs(imagPeak - calculatedImaginaryPart) <= tolerance/10) {
      lockN=true;
      break;
    }
    // 根据误差调整 n 值
    if (imagPeak > calculatedImaginaryPart) {
      n += 1e-4; // 调大 n 值
    } else {
      n -= 1e-4; // 调小 n 值
    }
    // 更新参数对象
    n = Math.max(0, Math.min(n, 1)); // 确保 n 在范围内
    paramsObject.n = n;
    iterations++;
  }

  let Q = Math.sin((n * Math.PI) / 2) / (2 * Math.pow(w_peak, n) * Math.abs(imagPeak));
  paramsObject.Q = Q;

lockN=true;
const tolerance2=1;

let iterations2 = 0;

const firstReal = realPart[0];
// const firstImag = imagPart[0];
  while ((iterations2 < maxIterations)&&(lockN==true)) {
     calculatedRealPartArray = frequency.map((f) => {
      const fitResult = circuitFitFunctions[model](paramsObject, f);
      return Math.abs(fitResult.re);
    });
    calculatedRealPart=calculatedRealPartArray[0];//第一个实部的值作为衡量Q的参数
  if (Math.abs(firstReal - calculatedRealPart) <= tolerance2) {
    break;
  }
  // 估算 Q

if ((firstReal > calculatedRealPart)&&(lockN==true)) {
  Q -= 1e-9; // 调大 n 值
  // n-=1e-3;
} else {
  Q += 1e-9; // 调小 n 值
}
   // 更新参数对象
   Q = Math.max(0,Q); // 确保 大于0范围内
   paramsObject.Q = Q;
   paramsObject.n = n;
   iterations2++;
  }  
  return { Q, n };
}

function optimizeCParams(
  frequency: number[], // 频率数组
  realPart: number[], // 实部数组
  imagPart: number[], // 虚部数组
  model: CircuitModel,
  initialParams: number[]
): { C: number } {
  // 找到虚部峰值对应的频率
  const maxImaginaryIndex = imagPart.indexOf(Math.max(...imagPart));
  const f_peak = frequency[maxImaginaryIndex]; // 特征频率
  const w_peak = 2 * Math.PI * f_peak; // 特征角频率

  // 获取初始参数对象
  let paramsObject = convertArrayToObject(model, initialParams);
  let C = paramsObject.C;

  // 初始化变量
  const imagPeak = imagPart[maxImaginaryIndex];
  let calculatedImaginaryPartArray: number[] = [];
  let calculatedImaginaryPart: number;
  let calculatedImaginaryPartArray2: number[] = [];
  // 允许的误差范围
  const tolerance1 = 1E-5;
  const maxIterations = 5000; // 最大迭代次数
  let iterations = 0;
  while (iterations < maxIterations) {
    // 重新计算虚部数组
    calculatedImaginaryPartArray = frequency.map((f) => {
      const fitResult = circuitFitFunctions[model](paramsObject, f);
      return Math.abs(fitResult.im);
    });

    calculatedImaginaryPartArray2 = frequency.map((f) => {
      const fitResult2 = circuitFitFunctions[model](paramsObject, frequency[0]);
      return Math.abs(fitResult2.im);
    });
    // 找到最大虚部及其索引
    const maxIndex = calculatedImaginaryPartArray.indexOf(
      Math.max(...calculatedImaginaryPartArray)
    );
    calculatedImaginaryPart = calculatedImaginaryPartArray[maxIndex];
    // 判断误差是否在容许范围
    if (Math.abs(imagPeak - calculatedImaginaryPart) <= tolerance1) {
      break
    }
    // 根据误差调整 n 值
    if (imagPeak > calculatedImaginaryPart) {
      C += 1e-8; // 调大 n 值
    } else {
      C -= 1e-8; // 调小 n 值
    }
    iterations++;
  }


return {C};
}


// 启动模拟并进行电路参数估算
export function runFitCircuit(frequency: number[], realPart: number[], imagPart: number[], model: CircuitModel) : { [key: string]: number }{
  const params = fitParams(frequency, realPart, imagPart, model);
  return params;
}


/**
 * 根据离散点拟合圆，返回圆心、半径和与X轴的交点
 */
function estimateCircle(
  realPart: number[],
  imagPart: number[]
): { center: { x: number; y: number }; radius: number; intersection1: number ;intersection2: number} {
  const n = realPart.length;

  // 构造 A 矩阵和 b 向量
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < n; i++) {
    const x = realPart[i];
    const y = imagPart[i];
    A.push([2 * x, 2 * y, 1]);
    b.push(x * x + y * y);
  }

  // 计算 A^T * A 和 A^T * b
  const AT = math.transpose(A);
  const ATA = math.multiply(AT, A) as unknown as number[][];
  const ATb = math.multiply(AT, b) as number[];

  // 求解线性方程 ATA * p = ATb
  const p = math.lusolve(ATA, ATb) as number[][]; // p 是一个二维数组，需要解包
  const x_c = p[0][0];
  const y_c = p[1][0];
  const r_squared = p[2][0] + x_c * x_c + y_c * y_c;
  const radius = Math.sqrt(r_squared);

  // 计算与 realPart 轴的交点
  const intersection1 = x_c + Math.sqrt(radius * radius - y_c * y_c);//右边

 const intersection2 = x_c - Math.sqrt(radius * radius - y_c * y_c);//左边
  

  return {
    center: { x: x_c, y: y_c },
    radius,
    intersection1,
    intersection2,
  };
}

function calculateMean(numbers: number[]): number {
  if (numbers.length === 0) {
      throw new Error("数组不能为空");
  }

  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
}

import { defineStore } from "pinia";



//export到成绩电路拟合参数到外部，然后可以在ToolView.vue中使用
export const circuitStoreData = defineStore("circuitData", () => {
//保存数据
const startSimFrequency = ref<number>(0.01);
const endSimFrequency = ref<number>(10000);
const historyFit = ref([
  { circuitName: '', params: {} },
  { circuitName: '', params: {} },
  { circuitName: '', params: {} },
  { circuitName: '', params: {} },
  { circuitName: '', params: {} },
  { circuitName: '', params: {} },
  { circuitName: '', params: {} },
  { circuitName: '', params: {} },
  { circuitName: '', params: {} },
  { circuitName: '', params: {} }
]);
  
const simFrequency= ref<number[]>([]);
const simOmega=ref<number[]>([]);
const nyquistBodeData=ref<{ freq: number[]; real: number[]; imag: number[]; magnitude: number[]; phase: number[] }>({
  freq: [],
  real: [],
  imag: [],
  magnitude: [],
  phase: []
})
const simParams = ref<number[]>([]);

const  selectSimFiles = ref<string>("");
const simBodePlotData = ref<{ x: number[], y: number[], fre: number[] }>({
  x: [],
  y: [],
  fre: []
});

const simNyquistPlotData = ref<{ x: number[], y: number[], fre: number[] }>({
  x: [],
  y: [],
  fre: []
});
type simCircuitMode = "Rs_C" |"Rp_C" | "Rs_(CRp)"|"Rs_L"|"Rs_CPE"|"Rs_(CPERp)"|"Rp_CPE"|"Rs_(CPE1Rp1)_(CPE2Rp2)"|"Rs_Rp1C1_Rp2C2"|"Rs_C_RpW";
const selectSimCircuitMode =ref<simCircuitMode>("Rp_C");
const circuitImages = ref<string>("/sim_Figure/RpC.png"); // 初始值
const curruntCircuitImages = ref<string>(""); // 用于导出excel的图片存储路径
// const curruntSimParams: { [key: string]: number } = {}
// 将 curruntSimParams 定义为一个 ref 对象
const curruntSimParams = ref<{ [key: string]: number }>({});
function saveToolsViewData() {
  const settingToolViewData = {
    startSimFrequency: startSimFrequency.value,
    endSimFrequency: endSimFrequency.value,
    historyFit: historyFit.value,
    simFrequency:simFrequency.value,
    simOmega:simOmega.value,
    nyquistBodeData:nyquistBodeData.value,
    simParams:simParams.value,
    selectSimFiles:selectSimFiles.value,
    simBodePlotData:simBodePlotData.value,
    simNyquistPlotData:simNyquistPlotData.value,
    selectSimCircuitMode:selectSimCircuitMode.value,
    circuitImages:circuitImages.value,
    curruntCircuitImages:curruntCircuitImages.value,
    curruntSimParams:curruntSimParams.value
  };
  localStorage.setItem("settingToolsViewData", JSON.stringify(settingToolViewData));
}

function loadToolViewData() {
  const savedData = localStorage.getItem("settingToolsViewData");
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    startSimFrequency.value=parsedData.startSimFrequency;
    endSimFrequency.value=parsedData.endSimFrequency;
    historyFit.value=parsedData.historyFit;
    simFrequency.value=parsedData.simFrequency;
    simOmega.value=parsedData.simOmega;
    nyquistBodeData.value=parsedData.nyquistBodeData;
    simParams.value=parsedData.simParams;
    selectSimFiles.value=parsedData.selectSimFiles;
    simBodePlotData.value=parsedData.simBodePlotData;
    simNyquistPlotData.value=parsedData.simNyquistPlotData;
    selectSimCircuitMode.value=parsedData.selectSimCircuitMode;
    circuitImages.value=parsedData.circuitImages;
    curruntCircuitImages.value=parsedData.curruntCircuitImages;
    curruntSimParams.value=parsedData.curruntSimParams;
  }
}
// 每次刷新页面，下列代码都会重新执行
  // 检查localStorage中是否已经有登录状态
  const storedIsLoggedIn: string | null = localStorage.getItem("isLoggedIn");
  const storedUsername: string | null = localStorage.getItem("localUsername");
if (storedIsLoggedIn === "true" && storedUsername) {
  loadToolViewData(); // 页面加载时加载设置数
}

watch(
    [
      startSimFrequency,
      endSimFrequency,
      historyFit,
      simFrequency,
      simOmega,
      simParams,
      selectSimFiles,
      simBodePlotData,
      simNyquistPlotData,
      selectSimCircuitMode,
      circuitImages,
      nyquistBodeData,
      curruntCircuitImages,
      curruntSimParams,
    ],
    saveToolsViewData,
    { deep: true },
  );

  return {
    startSimFrequency,
    endSimFrequency,
    historyFit, // 返回 historyFit
    saveToolsViewData,
    loadToolViewData,
    simFrequency,
    simOmega,
    simParams,
    selectSimFiles,
    simBodePlotData,
    simNyquistPlotData,
    selectSimCircuitMode,
    circuitImages,
    nyquistBodeData,
    curruntCircuitImages,
    curruntSimParams,
  };

  })


