import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import indxe from "@/views/SettingView.vue"
import bcrypt from "bcryptjs";
import ToolView from "@/views/ToolView.vue";

interface newOption {
  value: string;
  label: string;
}

type workStatusType = "idle" | "running" | "paused" | "error" | "finish";
let websocket: WebSocket | null = null;

export const useAuthStore = defineStore("auth", () => {
  const isConnected = ref<boolean>(false);  //标志锁
  const statistic = ref<number>(0);

  const isLoggedIn = ref<boolean>(false);
  const localUsername = ref<string>("");

  const testStart = ref<boolean>(false);
  const testStartTime = ref<number>(0);

  const storedWorkStatus = localStorage.getItem(
    "workStatus"
  ) as workStatusType | null;
  const workStatus = ref<workStatusType>(storedWorkStatus || "idle");
  // 监听 workStatus 的变化，并保存到 localStorage
  watch(workStatus, (newStatus) => {
    localStorage.setItem("workStatus", newStatus);
  });

  const current = ref<number>(0);
  const voltage = ref<number>(0);
  const power = ref<number>(0);
  const frequency = ref<number>(0);

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
  const currentPeakUnit = ref<string>("安/A");
  const voltagePeak = ref<string>("");
  const voltagePeakUnit = ref<string>("伏/V");
  const powerPeak = ref<string>("");
  const powerPeakUnit = ref<string>("瓦特/W");
  const startFrequency = ref<string>("");
  const startFrequencyUnit = ref<string>("赫兹/Hz");
  const endFrequency = ref<string>("");
  const endFrequencyUnit = ref<string>("赫兹/Hz");
  const stepMode = ref<string>("logarithmicChange");
  const currentMode = ref<string>("alternatingCurrent");
  const stepValue = ref<string>("");
  const frequencyPointPeriod = ref<string>("");
  const frequencyPointPeriodUnit = ref<string>("毫秒/ms");
  const loopTimes = ref<string>("");
  const collectInterval = ref<string>("");
  const collectIntervalUnit = ref<string>("毫秒/ms");
  const displayInterval = ref<string>("");   //显示周期
  const displayIntervalUnit = ref<string>("秒/s");
  const DeviceVersionNumber = ref<string>("");

    //内存数据
  const totalSpace = ref<number>(0);
  const currentCycle = ref<number>(1);//当前循环次数，根据running-----到 ---- finish信号累加一次
  const usedSpace = ref<number>(0);
  const freeSpace = ref<number>(0);
  const stepValueArr = ref<number[]>([]);
  const uploadFrequency = ref<number[]>([]);

  const userIndex = ref<number>(0);
    //循环次数
  const totalCycle = ref<number>(0);
  const tableData = ref([
    {
      time: "",
      current: "",
      currentUnit: "",
      voltage: "",
      voltageUnit: "",
      impedance: "",
      impedanceUnit: "",
      impedanceRealPart: "",
      impedanceRealPartUnit: "",
      impedanceImaginaryPart: "",
      impedanceImaginaryPartUnit: "",
      phase: "",
      phaseUnit: "",
      frequency: "",
      frequencyUnit: "",
      power: "",
      powerUnit: "",
  }
  ]);

  const bodePlotData = ref<Record<string, { x: number[], y: number[], fre: number[] }>>({});
  const nyquistPlotData = ref<Record<string, { x: number[], y: number[], text: number[] }>>({});
  
  const router = useRouter();
  const websiteIP = ref("192.168.137.99")
  const getWebsocketUrl = (): string => {
    if (import.meta.env.MODE === "development") {
      // 开发环境，本地websocket服务器调试
      return "ws://127.0.0.1:5167/ws";
    } else if (import.meta.env.MODE === "production") {
      // 生成环境，嵌入式poco服务器调试
      return `ws://${websiteIP.value}/ws` ;
      // return "ws://192.168.137.99:5167/ws";
    } else {
      return "";
    }
  };

  // 每次刷新页面，下列代码都会重新执行
  // 检查localStorage中是否已经有登录状态
  const storedIsLoggedIn: string | null = localStorage.getItem("isLoggedIn");
  const storedUsername: string | null = localStorage.getItem("localUsername");
  const storedNyquistData = localStorage.getItem("nyquistPlotData");
  const storedBodeData = localStorage.getItem("BodePlotData");

  if (storedIsLoggedIn === "true" && storedUsername) {
    isLoggedIn.value = true;
    localUsername.value = storedUsername;
    loadSettingViewData(); // 页面加载时加载设置数据
    if (storedNyquistData) {
      loadNyquistPlotData();
    }
    if (storedBodeData) {
      loadBodePlotData();
    }
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
      const userList1 = await fetchFileContent(`${websiteIP.value}/readuserlist`);
      const passwordList = await fetchFileContent("/login/password_list.txt");
      const passwordList1 = await fetchFileContent(`${websiteIP.value}/readuserlist`);

      // 查找用户名是否存在
      const userIndex = userList.indexOf(username);
      const userIndex1 = Number(userIndex)+1;
      localStorage.setItem('selectedUser', `${userIndex1}`);
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
        connectWebSocket();
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
  function appendToFile(content: object): void {
    const func1: { [key: string]: any } = {};
    func1["addUser"] = content;
    const Func: { [key: string]: any } = {};
    Func["usermanager"] = func1;
    const Func1: { [key: string]: any } = {};
    Func1["deviceManagement"] = Func;
    const func: { [key: string]: any } = {};
    func["func"] = Func1;
    (websocket as WebSocket).send(JSON.stringify(func));
  }

  // 连接WebSocket
  function connectWebSocket() {

    if (websocket) { websocket.close(); }

    if (!websocket || websocket.readyState === WebSocket.CLOSED) {
      websocket = new WebSocket(getWebsocketUrl());

      websocket.onopen = (): void => {
        isConnected.value = true;
        console.log("WebSocket连接成功");
        ElMessage.success("服务器连接成功！");
      };

      setInterval(function() { 
        if (websocket) {
          (websocket as WebSocket).send('PING')
        }
      }, 10*1000)

      websocket.onmessage = (event): void => {
        //在这里接收服务器发来的信息
        console.log("收到WebSocket消息:", event.data);

        let oneJson = {
          dataTransmission: {
            stateParameter: '0',
            RealTimeTestData: '0',
          },
        }
        let stateParameter = {
          mode: '',            //方式
          currentMode: '',     //当前模式
          stepMode: '',        //步进方式
          currentPeak: '',     //电流峰值
          voltagePeak: '',     //电压峰值
          powerPeak: '',       //功率峰值

          modeIdentifier: '',          //方式标识符，模式标识符
          startFrequency: '',          //起始频率
          endFrequency: '',            //截止频率
          stepSize: '',                //步长
          frequencyPointPeriod: '',    //频率点周期
          frequencyPointPeriod1:'',

          loopTimes: '',          //循环
          collectInterval: '',    //收集时间间隔
          timeStamp: '',          //时间戳
          action: '',             //工作模式
          totalSpace: '',         //总内存
          usedSpace: '',          //已使用内存
          freeSpace: '',          //剩余内存
          sfversion: '',
        }
        let RealTimeTestData = {
          // time: '',
          // current: '',
          // voltage: '',
          // impedance: '',
          // impedanceRealPart: '',
          // impedanceImaginaryPart: '',
          // phase: '',
          // frequency: '',
          // power: '',
          count: 555,                                                  //循环完成次数
          current_amplitude: '',                                       //电流
          current_phase: 666,                                          //电流相位
          frequency: '',                                               //频率
          timestamp: 777,                                              //测试时间
          voltage_amplitude: '',                                       //电压
          voltage_phase: 888,                                          //电压相位
          tableData: [  //显示数据
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
            ],                                         //数据显示页面初始化及接收数据
        }
        function isJsonString(str:string) {  
          try {  
            const parsed = JSON.parse(str)
            // 检查解析后的结果是否是一个对象或数组（或者根据你的需求进行其他检查）  
            // 注意：如果字符串表示的是一个简单的值（如数字、字符串、布尔值、null），JSON.parse() 也会成功  
            // 如果你只想接受对象和数组，可以添加额外的类型检查  
            if (parsed && (typeof parsed === 'object' || Array.isArray(parsed))) {  
              return true;  
            } else {
              // 如果解析成功但不是对象或数组，根据需求可以返回 false 或 true  
              // 这里我们假设只接受对象和数组为有效的 JSON 数据  
              return false;  
            }  
            } catch (error) {
              // 如果解析失败，说明输入的不是有效的 JSON 字符串  
              return false;  
            }
        }

        if (isJsonString(event.data)) {
          oneJson =  JSON.parse(event.data)    //oneJson = {dataTransmission: "   {stateParameter : "     " ,    RealTimeTestData : "   "}    "} 
          // if(oneJson.func !== undefined) {
          // if( isJsonString(oneJson.func.testdata) ) {
          // stateParameter = JSON.parse(oneJson.func.testdata)
          /* *************************状态数据设置开始***************************** */
          if(oneJson.dataTransmission !== undefined) {
              if( isJsonString(oneJson.dataTransmission.stateParameter) ) {
              stateParameter = JSON.parse(oneJson.dataTransmission.stateParameter)
                /* ***********工作模式************ */
              switch (stateParameter.mode) {
                // EIS
                case "eis":
                  workMode.value = stateParameter.mode
                  break;
                // 恒流
                case "cc":
                  workMode.value = "constant"
                  constantMode.value = "constantCurrent"
                  valueType.value = "peakValue"
                  value.value = stateParameter.modeIdentifier
                  unit.value = "ampere"
                  break;
                // 恒压
                case "cv":
                  workMode.value = "constant"
                  constantMode.value = "constantVoltage"
                  valueType.value = "peakValue"
                  value.value = stateParameter.modeIdentifier
                  unit.value = "volt"
                  break;
              }
                //电流模式
              switch(stateParameter.currentMode) {
                case '0':
                  currentMode.value = "directCurrent"
                  break;
                case '1':
                  currentMode.value = "alternatingCurrent"
                  break;
              }
                /* ***********测试保护门限************ */
                // 电流峰值
              currentPeak.value = stateParameter.currentPeak
              currentPeakUnit.value = "ampere"
                // 电压峰值
              voltagePeak.value = stateParameter.voltagePeak
              voltagePeakUnit.value = "volt"
                // 功率峰值
              powerPeak.value = stateParameter.powerPeak
              powerPeakUnit.value = "watt"

                /* ***********频率设置************ */
                // 起始频率
              startFrequency.value = stateParameter.startFrequency
              startFrequencyUnit.value = "hertz"
                // 终止频率
              endFrequency.value = stateParameter.endFrequency
              endFrequencyUnit.value = "hertz"
                //步进方式
              switch (stateParameter.stepMode) {
                case '1':
                  stepMode.value = "logarithmicChange"
                  break;
                case '2':
                  stepMode.value = "linearChange"
                  stepValue.value = stateParameter.stepSize
                  break;
                case '3':
                  stepMode.value = "singlePoint"
                  break;
                case '4':
                  stepMode.value = "linearChange"
                  break;
                case '5':
                  stepMode.value = "Custommode"
                  break;
              }
                //频点次数
              frequencyPointPeriod.value = stateParameter.frequencyPointPeriod
                /* ***********其他设置************ */
                //循环次数
              loopTimes.value = stateParameter.loopTimes
                // 采集周期
              collectInterval.value = stateParameter.collectInterval
              collectIntervalUnit.value = "毫秒/ms"
              testStartTime.value = Number(stateParameter.timeStamp) * 1000
              totalSpace.value = (+stateParameter.usedSpace) + (+stateParameter.freeSpace)
              usedSpace.value = +stateParameter.usedSpace
              freeSpace.value = +stateParameter.freeSpace
              DeviceVersionNumber.value = stateParameter.sfversion;    

              //工作状态      需要及时刷新
                switch (stateParameter.action) {
                
                case "idle":
                  workStatus.value = "idle";
                  break
                case "finish":
                  workStatus.value = "finish";
                  

                  if( Number(stepValue.value) > 41 && stepMode.value == "linearChange" ) {
                    const jsonObject: { [key: string]: any } = {};
                 
                    let countSize=1;
                    if( stepValueArr.value.length > 0 ) {
                      jsonObject["user"] = Number(userIndex.value+1);
                      jsonObject["mode"] = stateParameter.mode;
                      jsonObject["modeIdentifier"] = stateParameter.modeIdentifier;
                      jsonObject["currentMode"] = stateParameter.currentMode;
                      jsonObject["currentPeak"] = stateParameter.currentPeak;
                      jsonObject["voltagePeak"] = stateParameter.voltagePeak;
                      jsonObject["powerPeak"] = stateParameter.powerPeak;
                      jsonObject["startFrequency"] = stateParameter.startFrequency;
                      jsonObject["endFrequency"] = stateParameter.endFrequency;
                      jsonObject["stepMode"] = stateParameter.stepMode;
                      jsonObject["stepSize"] = stateParameter.stepSize;
                      jsonObject["loopTimes"] = stateParameter.loopTimes;
                      jsonObject["collectInterval"] = stateParameter.collectInterval;
                      jsonObject["timeStamp"] = stateParameter.timeStamp;
                      jsonObject["usedSpace"] = stateParameter.usedSpace;
                      jsonObject["freeSpace"] = stateParameter.freeSpace;
                      jsonObject["sfversion"] = stateParameter.sfversion;
                      let NUMLock:boolean = false;
                      for (let NUM = 1; NUM <= stepValueArr.value.length && NUM <= 41&&!NUMLock; NUM++) {
                        if((stepValueArr.value[ NUM-1 ]<=100)&&(stepValueArr.value[ NUM ]>=100)){//如果当前小于100且下一个大于100，则当前停止发送
                          jsonObject[`frequency${NUM}`] = stepValueArr.value[ NUM - 1];//NUM 代表第几个，stepValueArr的索引是NUM-1
                          countSize++;
                          NUMLock=true;
                          
                        }
                        else{
                          jsonObject[`frequency${NUM}`] = stepValueArr.value[ NUM - 1];//NUM 代表第几个，stepValueArr的索引是NUM-1
                    
                          countSize++;
                        }

                        if(stateParameter.frequencyPointPeriod) {
                          jsonObject[`frequencyPointPeriod${NUM}`] = stateParameter.frequencyPointPeriod;
                        }else {
                          jsonObject[`frequencyPointPeriod${NUM}`] = stateParameter.frequencyPointPeriod1;
                        }
                      
                      }
                        // 发送 JSON 对象
                        if (websocket) {
                          const func: { [key: string]: any } = {};
                          func["testdata"] = JSON.stringify(jsonObject);
                          const Func: { [key: string]: any } = {};
                          Func["func"] = func;
                          (websocket as WebSocket).send(JSON.stringify(Func));
                        }
                        if(!NUMLock){//如果 NUMLock等于false----一组中没有出现前一个小于100，后一个大于100
                          stepValueArr.value.splice(0,41);
                        }else{//如果 NUMLock等于true----一组中出现前一个小于100，后一个大于100
                          stepValueArr.value.splice(0,countSize)
                         
                        }
                      
                      workStatus.value = 'running';
                      }else {
                        if ( Number(stepValue.value) < 41 ) {
                          stepValueArr.value = [];
                        }else {
                          const step = Number(stepValue.value);
                          const startFreq = Number(startFrequency.value);
                          const endFreq = Number(endFrequency.value);
                          const num = (endFreq - startFreq) / (step - 1);
                          for (let i = 0; i < step; i++) {
                            stepValueArr.value.push(startFreq + i * num);
                        }
                    }
                  }
                      statistic.value =+ 41;

                  }



                  if( uploadFrequency.value.length > 0 && stepMode.value == "Custommode") {
                  
                      const jsonObject: { [key: string]: any } = {};
                      // 限制每次最多处理 41 个数据
                      const batchSize = Math.min(41, uploadFrequency.value.length);
                      let i = 0;
                      let currentBatch = [];
                      jsonObject["user"] = Number(userIndex.value+1);
                      jsonObject["mode"] = stateParameter.mode;
                      jsonObject["modeIdentifier"] = stateParameter.modeIdentifier;
                      jsonObject["currentMode"] = stateParameter.currentMode;
                      jsonObject["currentPeak"] = stateParameter.currentPeak;
                      jsonObject["voltagePeak"] = stateParameter.voltagePeak;
                      jsonObject["powerPeak"] = stateParameter.powerPeak;
                      jsonObject["startFrequency"] = stateParameter.startFrequency;
                      jsonObject["endFrequency"] = stateParameter.endFrequency;
                      jsonObject["stepMode"] = stateParameter.stepMode;
                      jsonObject["stepSize"] = stateParameter.stepSize;
                      jsonObject["loopTimes"] = stateParameter.loopTimes;
                      jsonObject["collectInterval"] = stateParameter.collectInterval;
                      jsonObject["timeStamp"] = stateParameter.timeStamp;
                      jsonObject["usedSpace"] = stateParameter.usedSpace;
                      jsonObject["freeSpace"] = stateParameter.freeSpace;
                      jsonObject["sfversion"] = stateParameter.sfversion;
                      // 处理当前批次数据
                      while (i < batchSize) {
                          const currentFrequency = uploadFrequency.value[i];
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
                      jsonObject[`frequency${j+1}`] = currentBatch[j];
                  
                      }
                      // 发送 JSON 对象
                      if (websocket) {
                        const func: { [key: string]: any } = {};
                        func["testdata"] = JSON.stringify(jsonObject);
                        const Func: { [key: string]: any } = {};
                        Func["func"] = func;
                        (websocket as WebSocket).send(JSON.stringify(Func));
                      }
                      // 从上传的频率数据中移除已处理的部分
                      uploadFrequency.value.splice(0, currentBatch.length);
                    
                      workStatus.value = 'running';
                  };

                  break
                case "running":
                  workStatus.value = "running";
                  break
                case "paused":
                  workStatus.value = "paused";
                  break
                case "error":
                  workStatus.value = "error";
                  break
              }
            }
            /* *************************状态数据设置结束***************************** */

            /* *************************实时数据设置开始***************************** */
            // count: '',              循环完成次数
            // current_amplitude: '',  电流
            // current_phase: '',      电流相位
            // frequency: '',          频率
            // timestamp: '',          测试时间
            // voltage_amplitude: '',  电压
            // voltage_phase: '',      频率
            if( isJsonString(oneJson.dataTransmission.RealTimeTestData) ) {
              RealTimeTestData = JSON.parse(oneJson.dataTransmission.RealTimeTestData)
              current.value = Number(RealTimeTestData.current_amplitude)   //电流
              voltage.value = Number(RealTimeTestData.voltage_amplitude)   //电压
              power.value = Number(RealTimeTestData.voltage_phase)         //功率
              frequency.value = Number(RealTimeTestData.frequency)         //频率
              totalCycle.value = Number(RealTimeTestData.count)            //循环次数
              tableData.value= RealTimeTestData.tableData
            }
          }
        }
        /* *************************状态数据设置结束***************************** */
      };

 //根据完成信号，计数器，记录当前完成循环次数  ----------------------------------还未完成。需要后端确定 是我们再次发送还是后端进行循环
      watch(
        () => workStatus.value,
        (newValue, oldValue) => {
          if (oldValue === 'running' && newValue === 'finish') {
            if (uploadFrequency.value.length == 0 && stepMode.value == "Custommode") {
              currentCycle.value++;
          }
          if (stepValueArr.value.length == 0 && stepMode.value == "linearChange") {
           
              currentCycle.value++;
          }
          if (stepMode.value != "linearChange" && stepMode.value != "Custommode") {
              currentCycle.value = currentCycle.value + 1;
          }
        }
        },
        { immediate: true }
      );

      websocket.onclose = (): void => {
        console.log("WebSocket已断开");
        setTimeout(()=> {
         window.location.reload();
        }, 200);
        useAuthStore();
        websocket = null;
        connectWebSocket();
        testStart.value = true;
      };

      websocket.onerror = (error): void => {
        isConnected.value = false;
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
    fileName: string,  // 增加文件名参数
    xData: number[],
    yData: number[],
    textData: number[]
  ) {
    // 使用文件名作为键来存储不同文件的数据
    nyquistPlotData.value[fileName] = {
      x: xData,
      y: yData,
      text: textData
    };
  }
  function updateBodePlotData(
    fileName: string,  // 增加文件名参数
    xBodeData: number[],
    yBodeData: number[],
    freBodeData: number[]
  ) {
    // 使用文件名作为键来存储不同文件的数据
    bodePlotData.value[fileName] = {
      x: xBodeData,
      y: yBodeData,
      fre: freBodeData
    };
  }
  // 在 store 中增加保存和加载奈奎斯特图数据到 localStorage 的方法
  function saveNyquistPlotData() {
    localStorage.setItem(
      "nyquistPlotData",
      JSON.stringify(nyquistPlotData.value),
    );
  }
  function saveBodePlotData() {
    localStorage.setItem(
      "bodePlotData",
      JSON.stringify(bodePlotData.value),
    );
    
  }
  function loadNyquistPlotData() {
    const savedData = localStorage.getItem("nyquistPlotData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      for (const fileName in parsedData) {
        nyquistPlotData.value[fileName] = parsedData[fileName];
      }
     
    }
  }
  
  function loadBodePlotData() {
    const savedData = localStorage.getItem("bodePlotData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      for (const fileName in parsedData) {
        bodePlotData.value[fileName] = parsedData[fileName];
      }
    }
  }
  // 在页面加载时加载数据

 
  
  if (storedNyquistData) {
    const parsedData = JSON.parse(storedNyquistData);
    loadNyquistPlotData();
   
  }

  if (storedBodeData) {
    const parsedData = JSON.parse(storedBodeData);
    loadBodePlotData();
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
      isConnected: isConnected.value,//标志锁
      currentMode:currentMode.value,
      current:current.value,
      voltage:voltage.value,
      power:power.value,
      frequency:frequency.value,
      stepValue: stepValue.value,
      frequencyPointPeriod: frequencyPointPeriod.value,
      frequencyPointPeriodUnit: frequencyPointPeriodUnit.value,
      loopTimes: loopTimes.value,
      currentCycle: currentCycle.value,
      collectInterval: collectInterval.value,
      collectIntervalUnit: collectIntervalUnit.value,
      displayInterval: displayInterval.value,
      displayIntervalUnit: displayIntervalUnit.value,
      totalSpace: totalSpace.value,
      usedSpace: usedSpace.value,
      freeSpace: freeSpace.value,
      totalCycle: totalCycle.value,
      tableData:tableData.value,// 显示数据
      DeviceVersionNumber:DeviceVersionNumber.value,
      websiteIP: websiteIP.value,
      uploadFrequency: uploadFrequency.value,
      testStartTime: testStartTime.value,
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
      isConnected.value = parsedData.isConnected;
      currentMode.value = parsedData.currentMode;
      current.value = parsedData.current;
      voltage.value = parsedData.voltage;
      power.value = parsedData.power;
      currentCycle.value = parsedData.currentCycle;
      frequency.value = parsedData.frequency;
      stepValue.value = parsedData.stepValue;
      frequencyPointPeriod.value = parsedData.frequencyPointPeriod;
      frequencyPointPeriodUnit.value = parsedData.frequencyPointPeriodUnit;
      loopTimes.value = parsedData.loopTimes;
      collectInterval.value = parsedData.collectInterval;
      collectIntervalUnit.value = parsedData.collectIntervalUnit;
      displayInterval.value = parsedData.displayInterval;
      displayIntervalUnit.value = parsedData.displayIntervalUnit;
      totalSpace.value = parsedData.totalSpace;
      usedSpace.value = parsedData.usedSpace;
      freeSpace.value = parsedData.freeSpace;
      totalCycle.value = parsedData.totalCycle;
      tableData.value = parsedData.tableData;// 显示数据
      DeviceVersionNumber.value = parsedData.DeviceVersionNumber;
      websiteIP.value = parsedData.websiteIP;
      uploadFrequency.value = parsedData.uploadFrequency;
      testStartTime.value = parsedData.testStartTime;
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
      isConnected,//标志锁
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
      currentMode,
      testStart,
      testStartTime,
      current,
      voltage,
      power,
      frequency,
      stepValue,
      frequencyPointPeriod,
      frequencyPointPeriodUnit,
      loopTimes,
      collectInterval,
      collectIntervalUnit,
      displayInterval,
      displayIntervalUnit,
      totalSpace,
      usedSpace,
      freeSpace,
      totalCycle,
      DeviceVersionNumber,
      tableData,
      websiteIP,
      stepValueArr,
      uploadFrequency,
      testStartTime,
      currentCycle,
    ],
    saveSettingViewData,
    { deep: true },
  );

  return {
    isLoggedIn,
    localUsername,
    isConnected,//标志锁
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
    currentMode,
    testStart,
    testStartTime,
    current,
    voltage,
    power,
    frequency,
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
    bodePlotData,
    // ToolViewUploadFileName,
    updateNyquistPlotData,
    saveNyquistPlotData,
    updateBodePlotData,
    loadNyquistPlotData,
    saveBodePlotData,
    loadBodePlotData,
    totalSpace,
    usedSpace,
    freeSpace,
    totalCycle,
    DeviceVersionNumber,
    tableData,
    websiteIP,
    stepValueArr,
    uploadFrequency,
    currentCycle,
  };
});
