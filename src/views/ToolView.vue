<template>
   <!--修改下面的24/12 整个页面还是单个页面 -->

   <el-row>
  <el-col :span="10">
    <!-- 左边视图展示 -->
  <el-card class="box-card1" style="width: 98%">
  <div slot="header" class="clearfix">
    <span>视图显示</span>
    <el-col :span="2"><!-- 占位 --></el-col>
  </div>
  
  <el-row justify="end">
    <el-col :span="3">
        <el-button type="primary" 
        size="large" 
        style="color: white; background-color:palevioletred;"
        @click="checkClearDrawPlotData=true">
          <el-text size="large" style="color: white">清空数据</el-text>
        </el-button>
    </el-col>
    <el-col :span="2"><!-- 占位 --></el-col>
    <el-col :span="3">
      <el-upload :before-upload="beforeUpload">
        <el-button type="primary" 
         style="color: white; background-color:green;"
        size="large">
          <el-text size="large" style="color: white">上传文件</el-text>
        </el-button>
      </el-upload>
    </el-col>
    <el-col :span="2"><!-- 占位 --></el-col>
    <el-col :span="3">
      
        <el-button 
        type="primary" 
        @click="switchPlot()"
        size="large">
          <el-text size="large" style="color: white">视图切换</el-text>
        </el-button>
     
    </el-col>
    <el-col :span="2"><!-- 占位 --></el-col>
    <el-col :span="3">
      <el-button size="large" @click="templateDownload = true">
        <el-text size="large">下载模板</el-text>
      </el-button>
    </el-col>
    <el-col :span="2"><!-- 占位 --></el-col>

  </el-row>
 

  <!-- 奈奎斯特图 -->
    <div v-if="selectedPlot === 'twoDimensionalPlot'">
      <el-row >
        <el-col :span="22">
          <div  ref="nyquistPlot"></div>
        </el-col>
        
        <el-col :span="22">
          <div ref="bodePlot"></div>
        </el-col>
      </el-row>
      </div>

      <!-- 波特图 -->
      <div v-if="selectedPlot === 'threeDimensionalPlot'">
        
        <el-col :span="24">
          <div ref="nyquistPlot3d"  class="custom-3d-plot"></div>
        </el-col>
        <el-col :span="24">
          <div ref="bodePlot3d"></div>
        </el-col>
      </div>
</el-card>
</el-col>
  <el-col :span="0"><!-- 占位--></el-col>
<!-- ======================================================================== -->
  <el-col :span="14">
 <!-- 右边操作视图展示 -->
  <el-card class="box-card" style="width: 100%">
   
    <div slot="header" class="clearfix">
    <span>数据分析</span>
    </div>
    <el-col :span="24">
      <el-col :span="12">
    </el-col>
    </el-col>
  <el-row justify="end">

    <el-col :span="3">
        <el-button type="primary"  size="large" @click="bottomExportToExcel()">导出仿真数据</el-button>
      </el-col>
      <el-col :span="1">
        <!-- 占位 -->
      </el-col>
    <!-- 清空数据分析按钮 -->
      <el-col :span="3">
        <el-button type="primary" 
        size="large" 
        style="color: white; background-color:palevioletred;"
        @click="checkClearAnalyseDrawPlotData=true">
          <el-text size="large" style="color: white">清空分析数据</el-text>
        </el-button>
      </el-col>
   
        <el-col :span="1"><!-- 占位 --></el-col>
        <!--下拉选取组件 -->
        <el-text size="large" style="color: black">选择显示文件：</el-text>
        <el-select
              v-model="selectSimFiles"
              collapse-tags
              placeholder="选择已有文件"
              style="width: 240px">
              <el-option
                v-for="(item, index) in fileName2"
                :key="index"
                :label="item"
                :value="item"/>
            </el-select>
            <el-col :span="1"><!-- 占位 --></el-col>
               
                  <!-- <el-col :span="2">占位</el-col> -->
      <el-col :span="3">
          <el-button 
            type="primary" 
            style="color: white; background-color:green;"
            @click="checkTestAnalyseFun()"
            size="large">
              <el-text size="large" style="color: white">即时拟合数据</el-text>
          
          </el-button>
      </el-col>

    </el-row>

    <br/>
 




<!-- ======================================== -->




 <el-card class="testt" style="width: 100%">
  <el-row>  
    <!-- row行 -->
    
      <el-select
              v-model="selectSimCircuitMode"
              collapse-tags
              placeholder="选择电路模型"
              style="width: 220px"
              >
              <el-option
                v-for="(item, index) in simCircuitMode"
                :key="index"
                :label="item"
                :value="item"/>
            </el-select>
     
    
      <el-col
            :span="3"
            style="display: flex; justify-content: right; align-items: center"
          >
            <el-text size="large">起始频率：</el-text>
          </el-col>
          
      

          <el-col :span="3">
            <el-input
              v-model="startSimFrequency"
              size="large"
              placeholder="输入起始频率"
            />
          </el-col>

          <el-col :span="1"><!-- 纯占位，无意义 --></el-col>
    
        
            <el-text size="large">终止频率：</el-text>
         
          <el-col :span="3">
            <el-input
              v-model="endSimFrequency"
              size="large"
              placeholder="输入终止频率"
            />
          </el-col>
          <el-col :span="1"><!-- 纯占位，无意义 --></el-col>
          <el-col :span="3">
          <el-button type="primary"  
          style="color: white; background-color: green;"
          size="large" @click="StartSimulationcircuit()">
            <el-text size="large" style="color: white">开始仿真</el-text>
         </el-button>
        </el-col>
        </el-row>  
<br>
        <el-row>
          
          <!-- 电路 -->
        <el-col :span="5">
        <!-- nigamm -->
    <el-card class="historyFit" title="仿真参数" width="50vw">
      <el-scrollbar style="height: 100%;">
 <!-- 根据选择的值展示不同的输入框 -->
 <div v-if="selectSimCircuitMode === 'Rp_C'">
  <!-- paramsObject = { Rp: params[0], C: params[1] }; -->
      <el-row><el-col :span="10"><el-text >并联电阻Rp：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[0]" placeholder="并联电阻Rp"/></el-col> </el-row>
      <br>
      <el-row><el-col :span="10"><el-text >并联电容C：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[1]" placeholder="并联电容C"/></el-col> </el-row>
    </div>
    
 <div v-if="selectSimCircuitMode === 'Rs_C'">
  <!-- paramsObject = { Rs: params[0], C: params[1] }; -->
  <el-row><el-col :span="10"><el-text size="large">串联电阻：</el-text></el-col>
          <el-col :span="14"><el-input v-model="simParams[0]" size="large" placeholder="串联电阻Rs"/></el-col></el-row>
  <br>
  <el-row><el-col :span="10"><el-text >串联电容：</el-text></el-col>
          <el-col :span="14"><el-input v-model="simParams[1]" placeholder="串联电容C"/></el-col></el-row>
    </div>

    <div v-if="selectSimCircuitMode === 'Rs_L'">
      <!-- paramsObject = { Rs: params[0], L: params[1] }; -->
      <el-row><el-col :span="10"><el-text >串联电阻Rs：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[0]" placeholder="并联电阻Rp"/></el-col> </el-row>
      <br>
      <el-row><el-col :span="10"><el-text >串联电容L：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[1]" placeholder="并联电容C"/></el-col> </el-row>
    </div>

    <div v-if="selectSimCircuitMode === 'Rs_(CRp)'">
      <!-- paramsObject = { Rs: params[0], C: params[1], Rp: params[2] }; -->
      <el-row><el-col :span="10"><el-text >串联电阻Rs：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[0]" placeholder="串联电阻Rs"/></el-col> </el-row>
      <br>
      <el-row><el-col :span="10"><el-text >并联电阻Rp：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[2]" placeholder="并联电阻Rp"/></el-col> </el-row>
      <br>
      <el-row><el-col :span="10"><el-text >并联电容C：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[1]" placeholder="并联电容C"/></el-col> </el-row>
    </div>
    
    <div v-if="selectSimCircuitMode === 'Rs_CPE'">
      <!-- paramsObject = { Rs: params[0], Q: params[1],n: params[2] }; -->
      <el-row><el-col :span="10"><el-text >串联电阻Rs：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[0]" placeholder="串联电阻Rs"/></el-col> </el-row>
      <br>
      <el-row><el-col :span="10"><el-text >参数n：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[2]" placeholder="参数n"/></el-col> </el-row>
              <br>
      <el-row><el-col :span="10"><el-text >参数Q：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[1]" placeholder="参数Q"/></el-col> </el-row>
    </div>

    <div v-if="selectSimCircuitMode === 'Rp_CPE'">
      <!-- paramsObject = { Rp: params[0], Q: params[1],n: params[2] }; -->
      <el-row><el-col :span="10"><el-text >串联电阻Rp：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[0]" placeholder="并联电阻Rp"/></el-col> </el-row>
      <br>
      <el-row><el-col :span="10"><el-text >参数n：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[2]" placeholder="参数n"/></el-col> </el-row>
              <br>
      <el-row><el-col :span="10"><el-text >参数Q：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[1]" placeholder="参数Q"/></el-col> </el-row>
    </div>

    <div v-if="selectSimCircuitMode === 'Rs_(CPERp)'">
      <!-- paramsObject = { Rs: params[0], Rp: params[1] , Q: params[2], n: params[3]}; -->
      <el-row><el-col :span="10"><el-text >串联电阻Rs：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[0]" placeholder="并联电阻Rs"/></el-col> </el-row>
      <br>
      <el-row><el-col :span="10"><el-text >并联电阻Rp：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[1]" placeholder="参数Rp"/></el-col> </el-row>
              <br>
      <el-row><el-col :span="10"><el-text >参数n：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[3]" placeholder="参数n"/></el-col> </el-row>
              <br>
      <el-row><el-col :span="10"><el-text >参数Q：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[2]" placeholder="参数Q"/></el-col> </el-row>
    </div>

    <div v-if="selectSimCircuitMode === 'Rs_(CPE1Rp1)_(CPE2Rp2)'">
      <!-- paramsObject = { Rs: params[0], Rp: params[1] , Q: params[2], n: params[3]}; -->
      <el-row><el-col :span="10"><el-text >串联电阻Rs：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[0]" placeholder="并联电阻Rs"/></el-col> </el-row>
      <br>
      <el-row><el-col :span="10"><el-text >并联电阻Rp1：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[1]" placeholder="并联电阻Rp1"/></el-col> </el-row>
              <br>
      <el-row><el-col :span="10"><el-text >参数n1：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[3]" placeholder="参数n1"/></el-col> </el-row>
              <br>
      <el-row><el-col :span="10"><el-text >参数Q1：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[2]" placeholder="参数Q1"/></el-col> </el-row>
              <br>
      <el-row><el-col :span="10"><el-text >并联电阻Rp2：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[4]" placeholder="并联电阻Rp2"/></el-col> </el-row>
              <br>
      <el-row><el-col :span="10"><el-text >参数n2：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[6]" placeholder="参数n2"/></el-col> </el-row>
              <br>
      <el-row><el-col :span="10"><el-text >参数Q2：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[5]" placeholder="参数Q2"/></el-col> </el-row>              
    </div>
    <div v-if="selectSimCircuitMode === 'Rs_Rp1C1_Rp2C2'">
      <!-- paramsObject = { Rs: params[0], Rp: params[1] , Q: params[2], n: params[3]}; -->
      <el-row><el-col :span="10"><el-text >串联电阻Rs：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[0]" placeholder="并联电阻Rs"/></el-col> </el-row>
      <br>
      <el-row><el-col :span="10"><el-text >并联电阻Rp1：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[1]" placeholder="参数Rp1"/></el-col> </el-row>
              <br>
      <el-row><el-col :span="10"><el-text >参数C1：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[2]" placeholder="参数C1"/></el-col> </el-row>
              <br>
      <el-row><el-col :span="10"><el-text >参数Rp2：</el-text></el-col>
                <el-col :span="14"><el-input v-model="simParams[3]" placeholder="参数Rp2"/></el-col> </el-row> 
              <br>
      <el-row><el-col :span="10"><el-text >参数C2：</el-text></el-col>
                <el-col :span="14"><el-input v-model="simParams[4]" placeholder="参数C2"/></el-col> </el-row> 
    </div>
    <div v-if="selectSimCircuitMode === 'Rs_C_RpW'">
      <!-- paramsObject = { Rs: params[0], Rp: params[1] , Q: params[2], n: params[3]}; -->
      <el-row><el-col :span="10"><el-text >串联电阻Rs：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[0]" placeholder="并联电阻Rs"/></el-col> </el-row>
      <br>
      <el-row><el-col :span="10"><el-text >并联电容C1：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[1]" placeholder="参数C"/></el-col> </el-row>
              <br>
      <el-row><el-col :span="10"><el-text >电阻Rp：</el-text></el-col>
              <el-col :span="14"><el-input v-model="simParams[2]" placeholder="参数Rp"/></el-col> </el-row>
              <br>
      <el-row><el-col :span="10"><el-text >参数Zw：</el-text></el-col>
                <el-col :span="14"><el-input v-model="simParams[3]" placeholder="参数Zw"/></el-col> </el-row> 
    </div>
  </el-scrollbar>
          </el-card>
        </el-col>
        <el-col :span="3"> <!-- 占位 --></el-col>
        <!-- 历史 -->
       
        <el-col :span="5">
          <el-card class="simImage" title="仿真图" width="30vw">
  <div
    class="image-container"
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    "
  >
    <img
      :src="circuitImages"
      alt="仿真图"
      style="max-width: 100%; max-height: 100%; object-fit: contain; display: block;"
    />
  </div>
</el-card>

</el-col>

        <el-col :span="3"> <!-- 占位 --></el-col>
        <el-col :span="5">
    <el-card class="historyFit" title="历史拟合记录" width="30vw">
      <el-scrollbar style="height: 100%;">
  <div slot="header" class="clearfix">
    <span>历史拟合记录</span>
  </div>
  <el-table :data="historyFit" height="250" style="width: 100%;">
  <el-table-column prop="circuitName" label="电路" width="80"></el-table-column>

  
  <!-- 参数列 -->
  <el-table-column prop="params" label="参数" width="200">
    <template v-slot:default="scope">
      <div v-for="(value, key) in scope.row.params" :key="key">
        <span>
          {{ key }}: {{ value }}
        </span>
      </div>
    </template>
  </el-table-column>
</el-table>
</el-scrollbar>
</el-card>

</el-col>
        </el-row>



  
    <el-col :span="1">   </el-col>
    <!-- 第二行组件 -->
 
  <el-row>
    <br/>
    <!-- 换行 -->
    <el-col :span="1"></el-col>
  </el-row>
  <br/>
    <el-row >
        <el-col :span="11">
          <div  ref="simNyquistPlot" style="width: 100; height: 500px;"></div>
          <!-- analyseBodePlot -->
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="12">
          <!-- <div  ref="bodePlot" ></div> -->
          <div  ref="simBodePlot" style="width: 100; height: 500px;"></div>
        </el-col>
    </el-row>
 </el-card>

  </el-card>
  </el-col>
  </el-row>


  <el-dialog v-model="checkClearDrawPlotData" title="" width="30vw">
  <el-text size ="large">确认清空数据吗？</el-text>
  <template #footer>
    <el-button @click="checkClearDrawPlotData = false">取消</el-button>
    <el-button
    type="primary"
    @click="
      clearDrawPlotData();
      checkClearDrawPlotData = false
    "
    > 确认清空</el-button>
  </template>

</el-dialog>

<el-dialog v-model="checkClearAnalyseDrawPlotData" title="" width="30vw">
  <el-text size ="large">确认清空分析数据吗？</el-text>
  <template #footer>
    <el-button @click="checkClearAnalyseDrawPlotData = false">取消</el-button>
    <el-button
    type="primary"
    @click="
      ClearAnalyseDrawPlotData();
      checkClearAnalyseDrawPlotData = false
    "
    > 确认清空</el-button>
  </template>
</el-dialog>
<!-- ===========================弹窗  =============================== -->
<el-dialog v-model="checkTestAnalyse" title="即时拟合数据" width="80vw">
  <el-row>  
    <!-- row行 -->
  
      <el-col  :span="1.5">
            <el-text size="large" style="color: black">起始数据点: </el-text>
          </el-col>
      <el-col :span="6">
        <el-input
          v-model="startPointInfo"
          placeholder="显示起始数据点信息"
          disabled
        ></el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col  :span="1.5">
            <el-text size="large" style="color: black">终止数据点: </el-text>
          </el-col>
          <el-col :span="6">
            <el-input
          v-model="endPointInfo"
          placeholder="显示终止数据点信息"
          disabled
        ></el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col  :span="2">
            <el-text size="large" style="color: black">选择拟合文件：</el-text>
      </el-col>
      <el-col :span="2">
      <!--下拉选取组件 -->

      <el-select
              v-model="selectAnalyseFiles"
              collapse-tags
              placeholder="选择导出文件"
              style="width: 240px"
              @change="  
              clearSelection();
              drawAnalyseNyquistPlot();
              drawAnalyseBodePlot();"
              >
              <el-option
                v-for="(item, index) in fileName2"
                :key="index"
                :label="item"
                :value="item"/>
            </el-select>
          </el-col> 
    </el-row>  

    <!-- 第二行组件 -->
 

  <br>
 
    <el-row>  
      <el-col  :span="1.5">
            <el-text size="large" style="color: black">拟合电路模型：</el-text>
      </el-col>
      <el-col :span="3">
      <!--下拉选取组件 -->
      <el-select
              v-model="inistantFitCircuitMode"
              collapse-tags
              placeholder="选择模拟电路模型"
              style="width: 240px"
              >
              <el-option
                v-for="(item, index) in circuitModels "
                :key="index"
                :label="item"
                :value="item"/>
            </el-select>
          </el-col> 
     
    
      <el-col :span="2">
      </el-col>

      <el-col :span="2">
        <el-button 
        type="primary" 
        style="color: white; background-color: green;"
        @click="startFit"
        size="large">
          <el-text size="large" style="color: white">开始即时拟合</el-text>
        </el-button>
      </el-col>
      <el-col :span="1"><!-- zhanwei --></el-col>
      <el-col :span="8">
        <el-text size="large" style="color: black">拟合参数: {{FittingParams}}</el-text>
        <!-- historyFit.value[0].params -->
      </el-col>
      <el-col :span="3">
        <el-button type="primary"  
        size="large" 
        style="color: white; background-color: palevioletred;"
        @click="clearSelection()">清除选中</el-button>
      </el-col>
    </el-row>

    <el-row >

        <el-col :span="11">
          <div  ref="analyseNyquistPlot" style="width: 100; height: 500px;"></div>
          <!-- analyseBodePlot -->
          
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <!-- <div  ref="bodePlot" ></div> -->
          <div  ref="analyseBodePlot" style="width: 100; height: 500px;"></div>
        </el-col>
    </el-row>
  </br>
  
      

  <template #footer>
    <el-button
    type="primary"
    @click="
  checkTestAnalyse = false;
    "
    > 确认</el-button>
  </template>
</el-dialog>

<!-- ======================================== -->

<!-- ======================================== -->
  <el-dialog v-model="templateDownload" title="模板下载" width="30vw">
    <el-text size="large">请选择要下载的模板格式（可多选）：</el-text>
    <br />
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
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import Papa from "papaparse";
import Plotly from "plotly.js-dist-min";
import locale from "plotly.js-locales/zh-cn";
import { runFitCircuit,circuitStoreData} from "@/stores/InistantCircuit";
import { create, all, type Complex, add, divide, complex, } from 'mathjs';

Plotly.register(locale);
const circuitData=circuitStoreData();
const authStore = useAuthStore();
const nyquistPlot = ref<HTMLDivElement | null>(null);
  const bodePlot = ref<HTMLDivElement | null>(null);
const nyquistPlot3d = ref<HTMLDivElement | null>(null);

const bodePlot3d = ref<HTMLDivElement | null>(null);
const selectedPlot = ref('twoDimensionalPlot'); // 默认显示奈奎斯特图
const colorMap= ref < {[key: string]: string }> ({
  // 缓存颜色的对象
});

/* **************************************** 第1行第1列组件 开始 **************************************** */
const allowedFileExtension: string[] = ["csv", "xlsx", "xls", "txt"];
const fileName = ref<string>("");

const fileName2 = ref<string[]>([]);//下拉文件名列表
const checkClearDrawPlotData = ref<boolean>(false);
const checkClearAnalyseDrawPlotData = ref<boolean>(false);


// 检查选择的文件的格式
const beforeUpload = async (file: File): Promise<boolean> => {
  fileName.value =file.name;
  const color = getColorRadom(file.name);  // 获取当前文件的颜色
  colorMap.value[fileName.value] = color;
//存储颜色
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
        zr: parseFloat(row["Zr(Ω)"]),
        zm: parseFloat(row["Zm(Ω)"]),
      }));

      // 分离出 xData 和 yData
      const xData = data.map((item) => item.zr);
      const yData = data.map((item) => -item.zm); // 注意阻抗虚部要取相反数
      const textData = data.map((item) => item.frequency);

      // 更新 Nyquist 数据（分离出独立的异步更新）
      setTimeout(() => {
        authStore.updateNyquistPlotData(fileName.value,xData, yData, textData);
        authStore.saveNyquistPlotData();
        // 开始计算波特图数据
        computeBodePlot(xData, yData, textData);
      }, 0); // 使用 setTimeout 以避免阻塞主线程
    },
  });

};


const computeBodePlot = (xData: number[], yData: number[], freData: number[]) => {

  const xBodeData: number[] = [];
  const yBodeData: number[] = [];
  const logFreData: number[] = [];
  // 异步计算每个数据点的增益和相位
  const calculateBodeData = () => {
    let index = 0;
    const batchSize = 100; // 每次处理 100 个数据点

    const processBatch = () => {
      const endIndex = Math.min(index + batchSize, xData.length);
      for (let i = index; i < endIndex; i++) {
        const magnitude = Math.sqrt(xData[i] ** 2 + yData[i] ** 2); // 计算模长（增益）
        xBodeData.push(magnitude);
    
        // 计算相位（弧度）
        const phaseAngle = Math.atan2(yData[i], xData[i]);
        // const phaseAngle = Math.atan( yData[i]/xData[i]);
         const phaseInDegrees = phaseAngle * (180 / Math.PI);  // 转换为度
        yBodeData.push(phaseInDegrees);
        logFreData.push(Math.log10(freData[i]));
    
      }

      index = endIndex;

      // 如果还有数据需要处理，继续处理
      if (index < xData.length) {
        setTimeout(processBatch, 0); // 下一批计算
      } else {
        // 所有数据处理完成后，更新 Bode Plot 数据
        authStore.updateBodePlotData(fileName.value, xBodeData, yBodeData, logFreData);
        authStore.saveBodePlotData();
      
        drawBodePlot();
        drawNyquistPlot();
        draw3DNyquistPlot();
        draw3DBodePlot();
      }
    };

    // 启动批量处理
    processBatch();
  };

  calculateBodeData();
};

// 生成随机颜色并缓存
const getColorRadom = (fileKey: string): string => {
  // 如果 colorMap 中已有颜色，直接返回
  if (colorMap.value[fileKey]) {
    return colorMap.value[fileKey];
  }

  // 随机生成颜色
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  // 将颜色缓存到 colorMap 中
  colorMap.value[fileKey] = color;
  return color;
};

/* **************************************** 第1行第1列组件 结束 **************************************** */

/* **************************************** 第1行第2列组件 开始 **************************************** */

const drawNyquistPlot = (): void => {
  if (nyquistPlot.value) {
    // 确保数据存在并从不同的文件名（ToolViewUploadFileName）中读取数据
    const dataToPlot = Object.keys(authStore.nyquistPlotData).map(fileKey => {
      const fileData = authStore.nyquistPlotData[fileKey];
      const shortenedFileName = fileKey.length > 5 ? fileKey.substring(0, 5) + '...' : fileKey;
      // const color = getColorForFile(fileKey);  // 获取当前文件的颜色
      if (!fileName2.value.includes(fileKey)) {
  fileName2.value.push(fileKey);
}
   
      if (fileData && fileData.x && fileData.y && fileData.text) {
      //  const color = colorMap.value[fileKey];
      // 获取文件对应的颜色
   
      const color = colorMap.value[fileKey] || getColorRadom(fileKey);  // 如果缓存没有颜色则生成一个
    
        return {
          x: fileData.x,
          y: fileData.y,
          text: fileData.text,
          mode: "lines+markers",
          name: shortenedFileName, // 使用文件名作为图例
          hovertemplate: "实部: %{x}<br />虚部: %{y}<br />频率: %{text}<extra></extra>",
          line: { color },  // 设置增益数据的颜色
            markers: {
              color,  // 设置增益数据点的颜色
              
            },
        };
      }
      return null;
    }).filter(item => item !== null); // 过滤掉无效数据

    const layout = {
      title: {
    x: -1, // 标题在x轴上的位置，0表示最左边，1表示最右边
    y: 1, // 标题在y轴上的位置，0表示最底部，1表示最顶部
    xref: 'paper', // 相对于纸张的x位置
    yref: 'paper', // 相对于纸张的y位置
    text: "奈奎斯特图", // 标题文本
    titlefont: {
      size: 15, // 标题字体大小
      family: 'Arial, sans-serif', // 标题字体
    },
  },
      xaxis: { title: "阻抗实部 Zr (Ω)" },
      yaxis: { title: "阻抗虚部的相反数 -Z (Ω)" },
      aspectratio: { x: 1, y: 1 },
      font: { size: 12 },
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
        l: 1,  // 左边距
        r: 1, // 右边距，给图例更多的空间
        b: 40,  // 下边距
        t: 30,  // 上边距
      },
      
  
      // dragmode: 'zoom', // 启用缩放和拖拽模式
    }as Partial<Plotly.Layout>;

    const config: Partial<Plotly.Config> = {
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ["select2d", "lasso2d"],
      locale: "zh-CN",
    };
// 调用函数
createAndBindPlot(nyquistPlot.value, dataToPlot, layout, config);
  }
};


const drawBodePlot = (): void => {
  if (bodePlot.value) {
    const dataToPlot = Object.keys(authStore.bodePlotData).map(fileKey => {
      const shortenedFileName = fileKey.length > 5 ? fileKey.substring(0, 5) + '...' : fileKey;
      const fileData = authStore.bodePlotData[fileKey];
      if (fileData && fileData.x && fileData.y && fileData.fre) {
      // 获取文件对应的颜色
      const color = colorMap.value[fileKey] || getColorRadom(fileKey);  // 如果缓存没有颜色则生成一个
        return [
          {
            x: fileData.fre, // 频率log10weodi
            y: fileData.x, // 增益
            text:fileData.fre.map(freq => Math.pow(10,freq).toFixed(3)),
            mode: "lines+markers",
            name: `${shortenedFileName}|Z|`,
            hovertemplate: "频率: %{text}<br />|Z|: %{y}<extra></extra>",
            yaxis: "y", // 绑定到主Y轴
            line: { color },  // 设置增益数据的颜色
            markers: {
              color,  // 设置增益数据点的颜色
            },
          },
          {
            x: fileData.fre, // 频率
            y: fileData.y, // 相位
            text:fileData.fre.map(freq => Math.pow(10,freq).toFixed(3)),
            mode: "lines+markers",
            name: `${shortenedFileName}Phase`,
            hovertemplate: "频率: %{text}<br />相位: %{y}<extra></extra>", // 修正为y
            yaxis: "y2", // 绑定到第二个Y轴
            line: { 
              color,  // 设置增益数据的颜色
              dash: 'dash', // 设置线条为虚线
            },  // 设置增益数据的颜色
            marker: {
              color,  // 设置增益数据点的颜色
              symbol: "triangle-up-open", // 设置标记为空心向上三角形
              size: 10, // 设置标记大小
              // symbol:"x-open",
            },
          },
        ];
      }
      return null;
    }).flat().filter(item => item !== null);

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
        l: 10,  // 左边距
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

    Plotly.newPlot(bodePlot.value, dataToPlot, layout, config);
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

/* **************************************** 第2行第1列组件 3d视图 开始 **************************************** */

const draw3DNyquistPlot = (): void => {
  if (nyquistPlot3d.value) {
    // 构建3D图的数据集合，针对每个文件绘制一条线

   const PlotData = Object.keys( authStore.nyquistPlotData).map((fileKey, index) => {
      const fileData = authStore.nyquistPlotData[fileKey];
      if (fileData) {
        return {
      type: "scatter3d" ,
      x: fileData.x, // 实部 Zr (mΩ)
      y: new Array(fileData.x.length).fill(fileKey), // 这里的 y 轴代表文件的索引
      z: fileData.y, // 虚部 Zm (mΩ)
      text: fileData.text, // 频率
      mode: "lines+markers",
      marker:{size :4},
      name: fileKey, // 图例显示文件名
      hovertemplate: "实部: %{x}<br />虚部: %{z}<br />频率: %{text}<extra></extra>", // Hover 时显示的详细信息
        };
      }
      // 如果数据无效，返回 null
      return null;
    }).filter(item => item!== null) as Plotly.Data[]; // 过滤掉无效数据;
    
    const layout = {
      // title: "3D 奈奎斯特图",
      title: {
    x: -1, // 标题在x轴上的位置，0表示最左边，1表示最右边
    y: 1, // 标题在y轴上的位置，0表示最底部，1表示最顶部
    xref: 'paper', // 相对于纸张的x位置
    yref: 'paper', // 相对于纸张的y位置
    text: "3D 奈奎斯特图", // 标题文本
    titlefont: {
      size: 15, // 标题字体大小
      family: 'Arial, sans-serif', // 标题字体
    },
  },
    scene: {
      xaxis: { title: "阻抗实部 Zr (Ω)" },
      yaxis: { title: "文件" },  // 文件索引作为 y 轴
      zaxis: { title: "阻抗虚部 Zm (Ω)" },
    },
    font: { size: 12},
      showlegend: true, // 显示图例
      margin: {
        l: 5,  // 左边距
        r: 10, // 右边距，给图例更多的空间
        b: 10,  // 下边距
        t: 10,  // 上边距
      },
      config: {
    displayModeBar: false,  // 隐藏工具栏
    showLink: false         // 隐藏 Plotly 水印链接
  }
  }as Partial<Plotly.Layout>;;

  // 绘制图表
  Plotly.newPlot(nyquistPlot3d.value, PlotData, layout);
  
  }
};


const draw3DBodePlot = (): void => {
  if (bodePlot3d.value) {
    // 构建3D图的数据集合，针对每个文件绘制一条线
    const PlotData= Object.keys(authStore.bodePlotData).map((fileKey, index) => {
      const fileData = authStore.bodePlotData[fileKey];
      if (fileData) {
    return {
      type: "scatter3d",
      x:  new Array(fileData.x.length).fill(fileKey), // 这里的 y 轴代表文件的索引
      y: fileData.x,
      z: fileData.y,
      text: fileData.fre,
      mode: "lines+markers",
      line: {
            width: 2, // 设置线条粗细为 2
            dash: 'solid', // 设置线条样式为实线
          },
       marker:{size :4},
      name: fileKey, // 图例显示文件名
      hovertemplate: "增益: %{y}<br />相位: %{z}<br />频率: %{text}<extra></extra>", // Hover 时显示的详细信息
    };
        
      }
      // 如果数据无效，返回 null
      return null;
    }).filter(item => item!== null)as Plotly.Data[]; // 过滤掉无效数据;
    const layout = {
      title: {
    x: -1, // 标题在x轴上的位置，0表示最左边，1表示最右边
    y: 1, // 标题在y轴上的位置，0表示最底部，1表示最顶部
    xref: 'paper', // 相对于纸张的x位置
    yref: 'paper', // 相对于纸张的y位置
    text: "3D波特图", // 标题文本
    titlefont: {
      size: 15, // 标题字体大小
      family: 'Arial, sans-serif', // 标题字体
    },
  },
    scene: {
      xaxis: {range: [0, 5]},
      yaxis: { title: "|Z|" },  // 文件索引作为 y 轴
      zaxis: { title: "相位 度(°)" },
    },
    font: { size: 10},
    showlegend: true, // 显示图例
    legend: {
        bgcolor: 'rgba(0,0,0,0)', // 设置图例背景为透明
      },
   
      // title: 'Plotly 图表示例',
      margin: {
        l: 5,  // 左边距
        r: 10, // 右边距，给图例更多的空间
        b: 10,  // 下边距
        t: 10,  // 上边距
      },
    }as Partial<Plotly.Layout>;;
 
  // 绘制图表
  Plotly.newPlot(bodePlot3d.value, PlotData, layout);
  
  }
};
/* **************************************** 第2行第1列组件 3d视图 结束 **************************************** */
const switchPlot = async (): Promise<void> => {
  if (selectedPlot.value === 'threeDimensionalPlot') {
    selectedPlot.value = 'twoDimensionalPlot';
    await nextTick();
    authStore.loadBodePlotData();
    authStore.loadNyquistPlotData();
    drawBodePlot();
    drawNyquistPlot();
    ElMessage.success('已切换到二维图');
  } else {
    selectedPlot.value = 'threeDimensionalPlot';
    await nextTick();
    authStore.loadBodePlotData();
    authStore.loadNyquistPlotData();
    draw3DBodePlot();
    draw3DNyquistPlot();
    
    ElMessage.success('已切换到三维图');
  }
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/*函数功能: 绑定点击事件，选中图表中的点能截获信息   在drawBodePlot等使用
parm1:plotDiv:Plotly.Root 图表实例
parm2:data:any[] 数据
parm3:layout:Partial<Plotly.Layout> 布局
parm4:config:Partial<Plotly.Config> 配置
createAndBindPlot(nyquistPlot.value, dataToPlot, layout, config);
*/
let selectedStartIndex: number | null = null;
let selectedEndIndex: number | null = null;
// const tempIndex=ref<number>(0);
function createAndBindPlot(plotDiv: Plotly.Root, data: any[], layout: Partial<Plotly.Layout> | undefined, config: Partial<Plotly.Config> | undefined) {
  return Plotly.newPlot(plotDiv, data, layout, config).then((plotInstance) => {
    // 图表绘制完成后，绑定事件
    plotInstance.on('plotly_click', (eventData) => {
      const pointData = eventData.points[0];

      // 获取选中点的信息
      
      const pointIndx = eventData.points[0].pointIndex;
      const xValue = pointData.x;
      const yValue = pointData.y;
      const textValue = pointData.text;    
if(selectedStartIndex===null){
selectedStartIndex=pointIndx;
startPointInfo.value=` 实部 = ${xValue}, 虚部 = ${yValue}, 频率 = ${textValue}`;
}else if (selectedEndIndex===null){
  selectedEndIndex=pointIndx;
endPointInfo.value=` 实部 = ${xValue}, 虚部 = ${yValue}, 频率 = ${textValue}`;
}
// 确保 startIndex 小于 endIndex
if(selectedStartIndex!=null&&selectedEndIndex!=null){
if(selectedStartIndex>selectedEndIndex){// 起始大于交换 startIndex 和 endIndex
  const tempIndex=selectedStartIndex;
    selectedStartIndex =selectedEndIndex;
    selectedEndIndex=tempIndex;
    const StartInfoTemp=startPointInfo.value;
    startPointInfo.value=endPointInfo.value;
    endPointInfo.value=StartInfoTemp;
    updateAnalyseData();
  }else{
    updateAnalyseData();
}
}
    });
  });
}



/* **************************************** 数据分析组件 开始 **************************************** */

//================================================================即时拟合=============================
const analyseNyquistPlot = ref<HTMLDivElement | null>(null);
const analyseBodePlot = ref<HTMLDivElement | null>(null)
const  selectAnalyseFiles = ref<string>("");
const startPointInfo = ref(""); // 显示起始点信息
const endPointInfo = ref(""); // 显示终止点信息
const checkTestAnalyse = ref<boolean>(false);

// 定义电路模型类型
type CircuitModel = "Rs_C" |"Rp_C" | "Rs_(CRp)"|"Rs_L"|"Rs_CPE"|"Rs_(CPERp)"|"Rp_CPE";
const circuitModels = ref<CircuitModel[]>(["Rs_C","Rp_C", "Rs_(CRp)","Rs_L","Rs_(CPERp)","Rp_CPE"]);
const inistantFitCircuitMode = ref<CircuitModel>("Rp_C");
const inistantCircuitMode = ref<string[]>([""]);
inistantCircuitMode.value=["Rs_C", "Rs_(C-Rp)","Rs_L","Rs_CPE","Rs_(CPERp)","Rs_L_CPE","Rs_Wo","Rs_Ws","Rp_CPE"]

const checkTestAnalyseFun= (): void => {
  checkTestAnalyse.value=true;
  setTimeout(() => {
    drawAnalyseNyquistPlot();
    drawAnalyseBodePlot();
  }, 200);
}

//分析组件的奈奎斯特图
const drawAnalyseNyquistPlot=(): void=> {
  if (analyseNyquistPlot.value) {
    // 确保数据存在并从不同的文件名（ToolViewUploadFileName）中读取数据
    const dataToPlot = Object.keys(authStore.nyquistPlotData).map(fileKey => {
      if(selectAnalyseFiles.value.includes(fileKey)){
      const fileData = authStore.nyquistPlotData[fileKey];
      const shortenedFileName = fileKey.length > 5 ? fileKey.substring(0, 5) + '...' : fileKey;
      if (fileData && fileData.x && fileData.y && fileData.text) {
      const color = "green";  //
        return {
          x: fileData.x,
          y: fileData.y,
          text: fileData.text,
          mode: "lines+markers",
          name: shortenedFileName, // 使用文件名作为图例
          hovertemplate: "实部: %{x}<br />虚部: %{y}<br />频率: %{text}<extra></extra>",
          line: { color },  // 设置增益数据的颜色
            markers: {
              color,  // 设置增益数据点的颜色
            },
        };
      }
    }
      return null;
    }).filter(item => item !== null); // 过滤掉无效数据

    const layout = {
      title: {
    x: -1, // 标题在x轴上的位置，0表示最左边，1表示最右边
    y: 1, // 标题在y轴上的位置，0表示最底部，1表示最顶部
    xref: 'paper', // 相对于纸张的x位置
    yref: 'paper', // 相对于纸张的y位置
    text: "奈奎斯特图", // 标题文本
    titlefont: {
      size: 15, // 标题字体大小
      family: 'Arial, sans-serif', // 标题字体
    },
  },
      xaxis: { title: "阻抗实部 Zr (Ω)" },
      yaxis: { title: "阻抗虚部的相反数 -Zm (Ω)" },
      aspectratio: { x: 1, y: 1 },
      font: { size: 13 },
      legend: {
        font: {size: 8,},// 设置图例中文本的大小
        x: -10,  // 将图例位置移至右边
        y: 1,     // 将图例放置到顶部
        xanchor: 'left',  // 设置图例左对齐
        yanchor: 'top',   // 设置图例顶部对齐
        traceorder: 'normal',
      },
      margin: {
        l: 1,  // 左边距
        r: 1, // 右边距，给图例更多的空间
        b: 40,  // 下边距
        t: 30,  // 上边距
      },
      // dragmode: 'zoom', // 启用缩放和拖拽模式
    }as Partial<Plotly.Layout>;
    const config: Partial<Plotly.Config> = {
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ["select2d", "lasso2d"],
      locale: "zh-CN",
    };
// 调用函数
createAndBindPlot(analyseNyquistPlot.value, dataToPlot, layout, config);
  }
}

const drawAnalyseBodePlot = (): void => {
 if (analyseBodePlot.value) {

   const dataToPlot = Object.keys(authStore.bodePlotData).map(fileKey => {
    if(selectAnalyseFiles.value.includes(fileKey)){
    const shortenedFileName = fileKey.length > 5 ? fileKey.substring(0, 5) + '...' : fileKey;
     const fileData = authStore.bodePlotData[fileKey];
     if (fileData && fileData.x && fileData.y && fileData.fre) {
     const color = "green";  // 如果缓存没有颜色则生成一个
       return [
         {
           x: fileData.fre, // 频率
           y: fileData.x, // 增益
           text:fileData.fre.map(freq => Math.pow(10,freq).toFixed(3)),
           mode: "lines+markers",
           name: `${shortenedFileName} - 增益`,
           hovertemplate: "频率: %{text}<br />|Z|: %{y}<extra></extra>",
           yaxis: "y", // 绑定到主Y轴
           line: { color },  // 设置增益数据的颜色
           markers: {
             color,  // 设置增益数据点的颜色
           },
         },
         {
           x: fileData.fre, // 频率
           y: fileData.y, // 相位
           text:fileData.fre.map(freq => Math.pow(10,freq).toFixed(3)),
           mode: "lines+markers",
           name: `${shortenedFileName} - 相位`,
           hovertemplate: "频率: %{text}<br />相位: %{y}<extra></extra>", // 修正为y
           yaxis: "y2", // 绑定到第二个Y轴
           line: { color },  // 设置增益数据的颜色
           markers: {
             color,  // 设置增益数据点的颜色
           },
           marker: {
          color:"green",
              symbol: "triangle-up-open", // 设置标记为空心向上三角形
              size: 10, // 设置标记大小
            },
         },
       ];
     }}
     return null;
   }).flat().filter(item => item !== null);

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
 
 xaxis: { title: "频率 (Hz)" },
 yaxis: {
   title: "|Z|(Ω)",
   side: "left",
   showgrid: true,
 },
 yaxis2: {
   title: "相位 (°)",
   side: "right",
   overlaying: "y", // 修正为与主Y轴重叠
   showgrid: false,
 },
 font: { size: 13 },
 legend: {
       font: {size: 10,},// 设置图例中文本的大小
       x: -10,  // 将图例位置移至右边
       y: 1,     // 将图例放置到顶部
       xanchor: 'left',  // 设置图例左对齐
       yanchor: 'top',   // 设置图例顶部对齐
       traceorder: 'normal',
     },
     margin: {
       l: 1,  // 左边距
       r: 1, // 右边距，给图例更多的空间
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

   Plotly.newPlot(analyseBodePlot.value, dataToPlot, layout, config);
 }
};

const updateAnalyseData = (): void => {
  if (
    selectedStartIndex !== null &&
    selectedEndIndex !== null &&
    selectAnalyseFiles.value
  ) {
    // 1. 获取选中的文件数据
    const nyquistFileData = authStore.nyquistPlotData[selectAnalyseFiles.value];
    const bodeFileData = authStore.bodePlotData[selectAnalyseFiles.value];
    const startIndex = selectedStartIndex;
    const endIndex = selectedEndIndex;

    // ========== 更新奈奎斯特图 ==========
    // 截取奈奎斯特选中区间
    const highlightedNyquistData = {
      x: nyquistFileData.x.slice(startIndex, endIndex + 1),
      y: nyquistFileData.y.slice(startIndex, endIndex + 1),
      text: nyquistFileData.text.slice(startIndex, endIndex + 1),
    };
    choiseNyquistData.value = highlightedNyquistData;
    const nyquistOriginalData = {
      x: nyquistFileData.x,
      y: nyquistFileData.y,
      text: nyquistFileData.text,
      mode: "lines+markers",
      name: "完整数据",
      hovertemplate: "实部: %{x}<br />虚部: %{y}<br />频率: %{text}<extra></extra>",
      line: { color: colorMap.value[selectAnalyseFiles.value] },
    };

    const nyquistHighlightData = {
      x: highlightedNyquistData.x,
      y: highlightedNyquistData.y,
      text: highlightedNyquistData.text,
      mode: "lines+markers",
      name: "选中数据",
      hovertemplate: "实部: %{x}<br />虚部: %{y}<br />频率: %{text}<extra></extra>",
      line: { color: "red" },
      marker: { color: "red" },
    };

const nyquistLayout: Partial<Plotly.Layout> = {
      title: {
        text: "奈奎斯特图",
        xref: "paper",
        yref: "paper",
        x: -1,
        y: 1
      },
      xaxis: { title: "阻抗实部 Zr (Ω)" },
      yaxis: { title: "阻抗虚部的相反数 -Zm (Ω)" },
    
      font: { size: 13 },
      legend: {
        font: { size: 8 },
        x: -10,
        y: 1,
        xanchor: "left",
        yanchor: "top",
        traceorder: "normal",
      },
      margin: { l: 1, r: 1, b: 40, t: 30 },
    };
    const nyquistUpdatedData = [nyquistOriginalData, nyquistHighlightData];
    Plotly.react(analyseNyquistPlot.value!, nyquistUpdatedData, nyquistLayout);
 
    // ========== 更新波特图 ==========
    // 截取波特图选中区间
    const highlightedBodeData = {
      fre: bodeFileData.fre.slice(startIndex, endIndex + 1),
      gain: bodeFileData.x.slice(startIndex, endIndex + 1),
      phase: bodeFileData.y.slice(startIndex, endIndex + 1),
    };

    const bodeOriginalData = [
      {
        x: bodeFileData.fre,
        y: bodeFileData.x,
        text:bodeFileData.fre.map(freq => Math.pow(10,freq).toFixed(3)),
        mode: "lines+marker",
        name: "完整数据 - |Z|(Ω)",
        hovertemplate: "频率: %{text}<br />|Z|(Ω): %{y}<extra></extra>",
        yaxis: "y",
        line: { color: colorMap.value[selectAnalyseFiles.value] },
      },
      {
        x: bodeFileData.fre,
        y: bodeFileData.y,
        text:bodeFileData.fre.map(freq => Math.pow(10,freq).toFixed(3)),
        mode: "lines+marker",
        name: "完整数据 - 相位",
        hovertemplate: "频率: %{text}<br />相位: %{y}<extra></extra>",
        yaxis: "y2",
        line: { color: colorMap.value[selectAnalyseFiles.value] ,
          dash: "dash",//设置为虚线
        },
        marker: { color: colorMap.value[selectAnalyseFiles.value],
              symbol: "triangle-up-open", // 设置标记为空心向上三角形
              size: 10, // 设置标记大小
        },
      },
    ];

    const bodeHighlightData = [
      {
        x: highlightedBodeData.fre,
        y: highlightedBodeData.gain,
        text:highlightedBodeData.fre.map(freq => Math.pow(10,freq).toFixed(3)),
        mode: "lines+markers",
        name: "选中数据 - |Z|",
        hovertemplate: "频率: %{text}<br />|Z|(Ω): %{y}<extra></extra>",
        yaxis: "y",
        line: { color: "red" },
        marker: { color: "red" },
      },
      {
        x: highlightedBodeData.fre,
        y: highlightedBodeData.phase,
        text:highlightedBodeData.fre.map(freq => Math.pow(10,freq).toFixed(3)),
        mode: "lines+markers",
        name: "选中数据 - 相位",
        hovertemplate: "频率: %{text}<br />相位: %{y}<extra></extra>",
        yaxis: "y2",
        line: { color: "red" },
        marker: { color: "red" ,
              symbol: "triangle-up-open", // 设置标记为空心向上三角形
              size: 10, // 设置标记大小
        },
      },
    ];

    const bodeUpdatedData = [...bodeOriginalData, ...bodeHighlightData];
    const bodeLayout = {
      // 波特图布局，保持不变
      title: { text: "波特图", x: -1, y: 1 },
      xaxis: { title: "频率 (Hz)" },
      yaxis: { title: "|Z| (Ω)", side: "left", showgrid: true },
      yaxis2: {
        title: "相位 (°)",
        side: "right",
        overlaying: "y",
        showgrid: false,
      },
      legend: {
        x: 1,
        y: 1,
        xanchor: "left",
        yanchor: "top",
        traceorder: "normal",
      },
      font: { size: 13 },
      margin: { l: 1, r: 1, b: 40, t: 30 },
      hovermode: "x unified",
    } as Partial<Plotly.Layout>;
    Plotly.react(analyseBodePlot.value!, bodeUpdatedData, bodeLayout);
  }
};

/* **************************************** 数据分析组件 结束 **************************************** */
  const selectSimCircuitMode = computed({
  get: () => circuitData.selectSimCircuitMode,
  set: (value) => {
    circuitData.selectSimCircuitMode = value;
  },
});
  type simCircuitMode = "Rs_C" |"Rp_C" | "Rs_(CRp)"|"Rs_L"|"Rs_CPE"|"Rs_(CPERp)"|"Rp_CPE"|"Rs_(CPE1Rp1)_(CPE2Rp2)"|"Rs_Rp1C1_Rp2C2"|"Rs_C_RpW";
const simCircuitMode = ["Rs_C" ,"Rp_C", "Rs_(CRp)","Rs_L","Rs_CPE","Rs_(CPERp)","Rp_CPE","Rs_(CPE1Rp1)_(CPE2Rp2)","Rs_Rp1C1_Rp2C2","Rs_C_RpW"]

  const circuitImages = computed({
  get: () => circuitData.circuitImages,
  set: (value) => {
    circuitData.circuitImages = value;
  },
});
watch(selectSimCircuitMode, (newMode) => {
  simParams.value=[];

  switch (newMode) {
    case "Rs_C":
      circuitImages.value = "/sim_Figure/RsC.png";
      break;
    case "Rp_C":
      circuitImages.value = "/sim_Figure/RpC.png";
      break;
    case "Rs_L":
      circuitImages.value = "/sim_Figure/RsL.png";
      break;
    // 添加其他电路模式的图片路径
    case "Rs_(CRp)":
      circuitImages.value = "/sim_Figure/Rs_(CRp).png";
      break;
    case "Rp_CPE":
      circuitImages.value = "/sim_Figure/Rp_CPE.png";
      break;
    case "Rs_CPE":
      circuitImages.value = "/sim_Figure/Rs_CPE.png";
      break;
    case "Rs_(CPERp)":
      circuitImages.value = "/sim_Figure/Rs_(CPERp).png";
      break;
      case "Rs_(CPE1Rp1)_(CPE2Rp2)":
      circuitImages.value = "/sim_Figure/Rs_(CPE1Rp1)_(CPE2Rp2).png";
      break;
      case "Rs_Rp1C1_Rp2C2":
      circuitImages.value = "/sim_Figure/Rs_Rp1C1_Rp2C2.png";
      break;
      case "Rs_C_RpW":
      circuitImages.value = "/sim_Figure/Rs_C_RpW.png";
      break;
    default:
      circuitImages.value = "/sim_Figure/default.png"; // 默认图片路径
      break;
  }
});

watch(selectedPlot, (newValue) => {
  if (newValue === 'twoDimensionalPlot') {
    authStore.loadNyquistPlotData();
    authStore.loadBodePlotData();
        drawNyquistPlot();
        drawBodePlot();
      } else if (newValue === 'threeDimensionalPlot') {
        authStore.loadNyquistPlotData();
        authStore.loadBodePlotData();
        draw3DBodePlot();
        draw3DNyquistPlot();
      }
    
  });

watch(selectAnalyseFiles, (newValue) => {
  setTimeout(() => {
    drawAnalyseNyquistPlot();
    drawAnalyseBodePlot();
  }, 200);
    
  });

const historyFit = computed({
  get: () => circuitData.historyFit,
  set: (value) => {
    circuitData.historyFit = value;
  },
});

 historyFit.value = ([
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

const FittingParams=ref<string>("")
  function checkStartFit() {
    if(selectAnalyseFiles.value===undefined||selectAnalyseFiles.value===null){
      ElMessage.error('请选择文件');
      return false;
    }
    if(inistantFitCircuitMode.value===undefined||inistantFitCircuitMode.value===null){
      ElMessage.error('请选择电路模型');
      return false;
    }
    if(selectedStartIndex===undefined||selectedStartIndex===null){
      ElMessage.error('请选择起始点');
      return false;
    }
    if(selectedEndIndex===undefined||selectedEndIndex==null){
      ElMessage.error('请选择终止点');
      return false;
    }
    if (choiseNyquistData.value.x.length < 4) {
      ElMessage.error('请选择至少4个点进行拟合');
      return false;
    }
  return true;
  }


function startFit() {
  let checkFitresult =checkStartFit();
  const inistantFrequencies=choiseNyquistData.value.text;
  const inistantZm=choiseNyquistData.value.y;
  const inistantZr=choiseNyquistData.value.x;
  console.log("------------------------------",historyFit.value)
// 将数组中的数据向下移动一位
for (let i = historyFit.value.length - 1; i > 0; i--) {
  historyFit.value[i] = historyFit.value[i - 1];
  console.log(`historyFit.value[${i}]----------------------`, historyFit.value[i]);
  console.log("------------------------------")
}
  // 检查结果没问题后   调用 runSimulation 函数来启动模拟
if(checkFitresult){
const estimatedParams = runFitCircuit(inistantFrequencies, inistantZr, inistantZm,inistantFitCircuitMode.value);

// 调用计算函数生成拟合的奈奎斯特数据
 const fittedNyquistData = calculateNyquist(
  inistantFitCircuitMode.value, // 当前选中的电路模型
  estimatedParams, // 拟合参数
  inistantFrequencies
);

//历史记录需要用到的部分，记录拟合的参数保留三维小数
const formatParams = (params: Record<string, number>): Record<string, string> => {
  const formatted: Record<string, string> = {};
  for (const key in params) {
    const value = params[key];
    // 使用科学记数法表示非常小或非常大的值
    if (Math.abs(value) < 1e-2 || Math.abs(value) > 1e5) {
      formatted[key] = value.toExponential(3); // 科学记数法，保留三位小数
    } else {
      formatted[key] = value.toFixed(3); // 固定保留三位小数
    }
  }
  return formatted;
};

// 获取格式化后的参数
const tempParams = formatParams(estimatedParams);
 const tempCircuitName= inistantFitCircuitMode.value.toString();
 // 将格式化后的参数添加到 historyFit.value[0]
 historyFit.value[0] = {
    circuitName: tempCircuitName,
    params: tempParams,
  };

  FittingParams.value = Object.entries(historyFit.value[0].params)
  .map(([key, value]) => `${key}=${value}`)
  .join(' ,');
//更新奈奎斯特图和波特图数据
  updateFitAnalyseData(fittedNyquistData);
  console.log("historyFit.value[0]",historyFit.value[0]);
  console.log("historyFit.value[1]",historyFit.value[1]);
  console.log("historyFit.value[2]",historyFit.value[2]);
}
}

// 调用计算函数生成拟合的奈奎斯特数据
const updateFitAnalyseData = (fitNyquistData: { x: number[]; y: number[]; frequencies:number[] }): void => { 

const nyquistFileData = authStore.nyquistPlotData[selectAnalyseFiles.value];
    const nyquistOriginalData = {
      x: nyquistFileData.x,
      y: nyquistFileData.y,
      text: nyquistFileData.text,
      mode: "lines+markers",
      name: "原始数据",
      hovertemplate: "实部: %{x}<br />虚部: %{y}<br />频率: %{text}<extra></extra>",
      line: { color : "green" },
    };
    const temFitY = fitNyquistData.y.map(y => -1 * y); 
    const temFitX = fitNyquistData.x; 
    const temFitFre=fitNyquistData.frequencies;

    const nyquistfitData = {
      x: temFitX,
      y: temFitY,
      text: temFitFre,
      mode: "lines+markers",
      name: "拟合数据",
      hovertemplate: "实部: %{x}<br />虚部: %{y}<br />频率: %{text}<extra></extra>",
      line: { color: "blue" },
      marker: { color: "blue" },
    };

    const nyquistLayout: Partial<Plotly.Layout> = {
      title: {
        text: "奈奎斯特图",
        xref: "paper",
        yref: "paper",
        x: -1,
        y: 1
      },
      xaxis: { title: "阻抗实部 Zr (Ω)" },
      yaxis: { title: "阻抗虚部的相反数 -Zm (Ω)" },
    
      font: { size: 13 },
      legend: {
        font: { size: 8 },
        x: -10,
        y: 1,
        xanchor: "left",
        yanchor: "top",
        traceorder: "normal",
      },
      margin: { l: 1, r: 1, b: 40, t: 30 },
    };
    const nyquistUpdatedData = [nyquistOriginalData, nyquistfitData];
    
    Plotly.react(analyseNyquistPlot.value!, nyquistUpdatedData, nyquistLayout);
  
 // ========================更新波特图 =====================
  
        // 开始计算波特图数据
        const bodeFileData = authStore.bodePlotData[selectAnalyseFiles.value];
        const gainBodeFittedData:number[]=[];
        const phaseBodeFittedData:number[]=[];
        const freBodeFittedData:number[]=[];
for (let i = 0; i < nyquistfitData.x.length; i++) {
        const magnitude = Math.sqrt(nyquistfitData.x[i] ** 2 + nyquistfitData.y[i] ** 2); // 计算模长（增益）
        gainBodeFittedData.push(magnitude);
        // 计算相位（弧度）
        const phaseAngle = Math.atan2(nyquistfitData.y[i], nyquistfitData.x[i]);
        // const phaseAngle = Math.atan( yData[i]/xData[i]);
         const phaseInDegrees = phaseAngle * (180 / Math.PI);  // 转换为度
         phaseBodeFittedData.push(phaseInDegrees);
         freBodeFittedData.push(Math.log10(nyquistfitData.text[i]));
}

    const bodeOriginalData = [
      {
        x: bodeFileData.fre,
        y: bodeFileData.x,
        text:bodeFileData.fre.map(freq => Math.pow(10,freq).toFixed(3)),
        mode: "lines+markers",
        name: "原始数据 - |Z|",
        hovertemplate: "频率: %{text}<br />|Z|(Ω): %{y}<extra></extra>",
        yaxis: "y",
        line: { color : "green" },
      },
      {
        x: bodeFileData.fre,
        y: bodeFileData.y,
        text:bodeFileData.fre.map(freq => Math.pow(10,freq).toFixed(3)),

        mode: "lines+markers",
        name: "原始数据 - 相位",
        hovertemplate: "频率: %{text}<br />相位: %{y}<extra></extra>",
        yaxis: "y2",
        line: { color : "green"  ,
          dash: "dash",//设置为虚线
          
        },
        marker: { 
          color: "green",
              symbol: "triangle-up-open", // 设置标记为空心向上三角形
              size: 10, // 设置标记大小
        },
      },
    ];
    const bodefitData = [
      {
        x: freBodeFittedData,
        y: gainBodeFittedData,
        text:freBodeFittedData.map(freq => Math.pow(10,freq).toFixed(3)),
        mode: "lines+markers",
        name: "拟合数据 - |Z|",
        hovertemplate: "频率: %{text}<br />|Z|(Ω): %{y}<extra></extra>",
        yaxis: "y",
        line: { color: "blue" },
        marker: { color: "blue" },
      },
      {
        x: freBodeFittedData,
        y: phaseBodeFittedData,
        text:freBodeFittedData.map(freq => Math.pow(10,freq).toFixed(3)),
        mode: "lines+markers",
        name: "拟合数据 - 相位",
        hovertemplate: "频率: %{text}<br />相位: %{y}<extra></extra>",
        yaxis: "y2",
        line: { color: "blue" ,
        dash: "dash",//设置为虚线
        },
        marker: { color: "blue" ,
              symbol: "triangle-up-open", // 设置标记为空心向上三角形
              size: 10, // 设置标记大小
              // symbol:"x-open",
        },
      },
    ];
    const bodeUpdatedData = [...bodeOriginalData, ...bodefitData];
    const bodeLayout = {
      // 波特图布局，保持不变
      title: { text: "波特图", x: -1, y: 1 },
      xaxis: { title: "频率 (Hz)" },
      yaxis: { title: "|Z| (Ω)", side: "left", showgrid: true },
      yaxis2: {
        title: "相位 (°)",
        side: "right",
        overlaying: "y",
        showgrid: false,
      },
      legend: {
        x: 1,
        y: 1,
        xanchor: "left",
        yanchor: "top",
        traceorder: "normal",
      },
      font: { size: 13 },
      margin: { l: 1, r: 1, b: 40, t: 30 },
      hovermode: "x unified",
    } as Partial<Plotly.Layout>;
    Plotly.react(analyseBodePlot.value!, bodeUpdatedData, bodeLayout);

  }

//自动根据电路参数计算其实部虚部
//接收参数：电路模型、拟合参数、频率  
// 返回值：阻抗的实部 Zr 和虚部 Zi
function calculateNyquist(model: CircuitModel, params: { [key: string]: number }, frequencies: number[]): { x: number[]; y: number[] ;frequencies: number[]} {
  const nyquistData = { x: [] as number[], y: [] as number[] , frequencies :[] as number[]};
  // 过滤无效的频率值
  const validFrequencies = frequencies.filter(f => f > 0);  // 保证频率大于零
  const omega = validFrequencies.map(f => 2 * Math.PI * f);
    // 根据电路模型计算阻抗的实部 Zr 和虚部 Zi
    switch (model) {
      case "Rs_C":
          const Rs_C_realPart = omega.map(w => {
          return params.Rs;
            });
          const Rs_C_imagPart = omega.map(w => {
          const denom =  (w * params.C );
          return (-1) / denom;
            });
        nyquistData.x=Rs_C_realPart;
        nyquistData.y=Rs_C_imagPart;
        nyquistData.frequencies=validFrequencies;
        break;

      case "Rp_C":
          const realPart = omega.map(w => {
          const denom = 1 + Math.pow(w * params.C * params.Rp, 2);
          return params.Rp / denom;
            });
          const imagPart = omega.map(w => {
          const denom = 1 + Math.pow(w * params.C * params.Rp, 2);
          return (-w * Math.pow(params.Rp, 2) * params.C) / denom;
            });
        nyquistData.x=realPart;
        nyquistData.y=imagPart;
        nyquistData.frequencies=validFrequencies;
        break;

       case "Rs_L":
       const Rs_L_realPart = omega.map(w => {
          return params.Rs;
            });
          const Rs_L_imagPart = omega.map(w => {
          return  w*params.L;
            });
        nyquistData.x=Rs_L_realPart;
        nyquistData.y=Rs_L_imagPart;
        nyquistData.frequencies=validFrequencies;
     break;

      case "Rs_(CRp)":
            const Rs_CRp_RealPart = omega.map(w => {
            const Rs_CRp_Denom = 1 + Math.pow(w * params.C * params.Rp, 2);
            return params.Rs+(params.Rp / Rs_CRp_Denom);
              });

            const Rs_CRp_ImagPart = omega.map(w => {
            const Rs_CRp_Denom = 1 + Math.pow(w * params.C * params.Rp, 2);
            return (-w * Math.pow(params.Rp, 2) * params.C) / Rs_CRp_Denom;
              });
          nyquistData.x=Rs_CRp_RealPart;
          nyquistData.y=Rs_CRp_ImagPart;
          nyquistData.frequencies=validFrequencies;
        break;

      case "Rs_CPE":
          const Rs_CPE_RealPart =omega.map(w => { 
          return params.Rs+((Math.cos((params.n*Math.PI)/2))/(params.Q*Math.pow(w,params.n))) ;
            }); 
          const Rs_CPE_ImagPart =omega.map(w => { 
          return (-1*( Math.sin((params.n*Math.PI)/2) ) / (params.Q*Math.pow(w,params.n)));
            }); 
          nyquistData.x=Rs_CPE_RealPart;
          nyquistData.y=Rs_CPE_ImagPart;
          nyquistData.frequencies=validFrequencies;
        break;
        case "Rp_CPE":
          const Rp_CPE_RealPart =omega.map(w => { 
            const molecule =((1/params.Rp)+(params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2)));//分子
            const denom =( (Math.pow((((1/params.Rp)+(params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2)))),2))+(Math.pow((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)),2)) ); //分母
          return (molecule/denom) ;
            }); 
          const Rp_CPE_ImagPart =omega.map(w => { 
            const molecule = -1*((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)));
            const denom = ((Math.pow((((1/params.Rp)+(params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2)))),2))+(Math.pow((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)),2)));
          return molecule/denom;
            }); 
          nyquistData.x=Rp_CPE_RealPart;
          nyquistData.y=Rp_CPE_ImagPart;
          nyquistData.frequencies=validFrequencies;
        break;
        case "Rs_(CPERp)":
          const {Rs,Rp,Q,n}=params;
          const Rs_CPE_Rp_RealPart =omega.map(w => { 
            const molecule =((1/params.Rp)+(params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2)));//分子
            const denom =( (Math.pow((((1/params.Rp)+(params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2)))),2))+(Math.pow((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)),2)) ); //分母
          return params.Rs+(molecule/denom);
       
        }); 
          const Rs_CPE_Rp_ImagPart =omega.map(w => { 
            const molecule = -1*((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)));
            const denom = ((Math.pow((((1/params.Rp)+(params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2)))),2))+(Math.pow((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)),2)));
         
            return molecule/denom;
        }); 
          nyquistData.x=Rs_CPE_Rp_RealPart;
          nyquistData.y=Rs_CPE_Rp_ImagPart;
          nyquistData.frequencies=validFrequencies;
        break;
    
      default:
        throw new Error("Unsupported model: " + model);
    }
  return nyquistData;
}

  // ==================================================================仿真图======================================================================
  const simNyquistPlotData = computed({
  get: () => circuitData.simNyquistPlotData,
  set: (value) => {
    circuitData.simNyquistPlotData = value;
  },
});
const simBodePlotData = computed({
  get: () => circuitData.simBodePlotData,
  set: (value) => {
    circuitData.simBodePlotData = value;
  },
});
  const startSimFrequency = computed({
  get: () => circuitData.startSimFrequency,
  set: (value) => {
    circuitData.startSimFrequency = value;
  },
});
const curruntCircuitImages = computed({
  get: () => circuitData.curruntCircuitImages,
  set: (value) => {
    circuitData.curruntCircuitImages = value;
  },
});

const endSimFrequency = computed({
  get: () => circuitData.endSimFrequency,
  set: (value) => {
    circuitData.endSimFrequency = value;
  },
});
const simFrequency = computed({
  get: () => circuitData.simFrequency,
  set: (value) => {
    circuitData.simFrequency = value;
  },
});
const simOmega = computed({
  get: () => circuitData.simOmega,
  set: (value) => {
    circuitData.simOmega = value;
  },
});

const selectSimFiles = computed({
  get: () => circuitData.selectSimFiles,
  set: (value) => {
    circuitData.selectSimFiles = value;
  },
});
const curruntSimParams = computed({
  get: () => circuitData.curruntSimParams,
  set: (value) => {
    circuitData.curruntSimParams = value;
  },
});


//仿真部分的电路拟合
const StartSimulationcircuit = (): void => {
  //检查结果是否符合要求
  const checkSimResult = checkSim();

  if(checkSimResult){
    //将数组simParams根据选择 的电路类型，自动转化为对象类型并传递到计算奈奎斯特公式中
  const tempeParams=convertArrayToObject(selectSimCircuitMode.value,simParams.value);
 const dataTemp = calculatesimNyquist(selectSimCircuitMode.value,tempeParams,simFrequency.value)
  simNyquistPlotData.value.fre=dataTemp.frequencies;
  simNyquistPlotData.value.x=dataTemp.x;
  simNyquistPlotData.value.y=dataTemp.y;
  //更新计算结果
  updateSimAnalyseData(simNyquistPlotData.value)
  //更新当前图片和参数----用于导出excel数据
  curruntCircuitImages.value=circuitImages.value;
  curruntSimParams.value=tempeParams;
}
};

// 初始化参数对象存储到中间平台
  const simParams = computed({
  get: () => circuitData.simParams,
  set: (value) => {
    circuitData.simParams = value;
  },
});


function convertArrayToObject(model: simCircuitMode, params: number[]): { [key: string]: number } {
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
  
    case "Rs_(CPE1Rp1)_(CPE2Rp2)":
        paramsObject = { Rs: params[0], Rp1: params[1] , Q1: params[2], n1: params[3], Rp2: params[4] , Q2: params[5], n2: params[6]};
    break;
    case "Rs_Rp1C1_Rp2C2":
        paramsObject = { Rs: params[0], Rp1: params[1] , C1: params[2], Rp2: params[3] , C2: params[4],};
    break;
    case "Rs_C_RpW":
        paramsObject = { Rs: params[0], C: params[1] , Rp: params[2], sigma: params[3]};
    break;
    default:
      throw new Error("Unsupported model");
  }

  return paramsObject;
}



//根据起始和终止频率---生成频率数组 和 角频率（用于计算）
function countFrequency(
  startSimFrequency: number, // 起始频率
  endSimFrequency: number, // 终止频率
) {
// 计算频率的个数（例如生成的频率点数量）
// 你可以根据需要调整这个参数，假设这里我们用 100 个频率点
let numPoints = 100;
simFrequency.value=[];
simOmega.value=[];

// 计算频率的对数跨度
let logStart = Math.log10(startSimFrequency);
let logEnd = Math.log10(endSimFrequency);

// 计算每个频率点的对数差
let logStep = (logEnd - logStart) / (numPoints - 1);

// 填充 simFrequency.value 数组
    for (let i = 0; i < numPoints; i++) {
    // 计算当前频率的对数值
    let currentLogFreq = logStart + i * logStep;
    
    // 将对数值转换回实际频率
    let currentFreq = Math.pow(10, currentLogFreq);
    
    // 将频率值存入数组
    simFrequency.value.push(currentFreq);
    simOmega.value.push(currentFreq*2*Math.PI)
    }
}
const checkSimfre = (): boolean => {
  if(startSimFrequency.value!==undefined&&endSimFrequency.value!==undefined){
    //频率检查 
    if(startSimFrequency.value!==null&&endSimFrequency.value!==null){
      if(startSimFrequency.value==0){
        ElMessage.error("起始频率不能为0");
        return false;
      }
      if(startSimFrequency.value>endSimFrequency.value){
        ElMessage.error("起始频率不能大于终止频率");
        return false;
      }
      if(startSimFrequency.value<0||endSimFrequency.value<0){
        ElMessage.error("起始频率和终止频率不能小于0");
        return false;
      } 
      if(startSimFrequency.value===endSimFrequency.value){
        ElMessage.error("起始频率和终止频率相等");
        return false;
      }

    }
  }
  if (startSimFrequency.value == undefined && endSimFrequency.value == undefined) {
      ElMessage.error("起始频率或终止频率未定义");
      return false;
    }
    return true;
}

const checkSim = (): boolean => {
if (checkSimfre()) {
    countFrequency(startSimFrequency.value,endSimFrequency.value);
  }

  
//参数检查
const params=convertArrayToObject(selectSimCircuitMode.value,simParams.value);
if(simParams.value.length>0){
for(let i=0;i<simParams.value.length;i++){
if(simParams.value[i]==null||simParams.value[i]==undefined){
  ElMessage.error("存在参数为空");
  return false;}
}
}else{
  ElMessage.error("参数为空");
  return false;
}
if (selectSimCircuitMode.value.includes("CPE")) {
    // 假设您有一个参数对象，其中包含 n
    if (params.n > 1||params.n1>1||params.n2>1) {
      ElMessage.error("参数 n 必须小于 1");
      return false;
    }
    if (params.n <= 0||params.n1<= 0||params.n2<= 0) {
      ElMessage.error("参数 n 必须大于 0");
      return false;
    }
  }
  return true;
}


function calculatesimNyquist(model: simCircuitMode, params: { [key: string]: number }, frequencies: number[]): { x: number[]; y: number[] ;frequencies: number[]} {
  const nyquistData = { x: [] as number[], y: [] as number[] , frequencies :[] as number[]};

  // 过滤无效的频率值
  const validFrequencies = frequencies.filter(f => f > 0);  // 保证频率大于零
  const omega = validFrequencies.map(f => 2 * Math.PI * f);

    // 根据电路模型计算阻抗的实部 Zr 和虚部 Zi
    switch (model) {
      case "Rs_C":
          const Rs_C_realPart = omega.map(w => {
          return params.Rs;
            });
          const Rs_C_imagPart = omega.map(w => {
          const denom =  (w * params.C );
          return (-1) / denom;
            });
        nyquistData.x=Rs_C_realPart;
        nyquistData.y=Rs_C_imagPart;
        nyquistData.frequencies=validFrequencies;
        break;
      case "Rp_C":
          const realPart = omega.map(w => {
          const denom = 1 + Math.pow(w * params.C * params.Rp, 2);
          return params.Rp / denom;
            });
          const imagPart = omega.map(w => {
          const denom = 1 + Math.pow(w * params.C * params.Rp, 2);
          return (-w * Math.pow(params.Rp, 2) * params.C) / denom;
            });
        nyquistData.x=realPart;
        nyquistData.y=imagPart;
        nyquistData.frequencies=validFrequencies;
        break;

       case "Rs_L":
       const Rs_L_realPart = omega.map(w => {
          return params.Rs;
            });
          const Rs_L_imagPart = omega.map(w => {
          return  w*params.L;
            });
        nyquistData.x=Rs_L_realPart;
        nyquistData.y=Rs_L_imagPart;
        nyquistData.frequencies=validFrequencies;
     break;

      case "Rs_(CRp)":

            const Rs_CRp_RealPart = omega.map(w => {
            const Rs_CRp_Denom = 1 + Math.pow(w * params.C * params.Rp, 2);
            const temp = Number(params.Rs) + Number(params.Rp / Rs_CRp_Denom); // 显式转换为数字
            return temp;
              });

            const Rs_CRp_ImagPart = omega.map(w => {
            const Rs_CRp_Denom = 1 + Math.pow(w * params.C * params.Rp, 2);
            return (-w * Math.pow(params.Rp, 2) * params.C) / Rs_CRp_Denom;
              });
          nyquistData.x=Rs_CRp_RealPart;
          nyquistData.y=Rs_CRp_ImagPart;
          nyquistData.frequencies=validFrequencies;
        break;

      case "Rs_CPE":
          const Rs_CPE_RealPart =omega.map(w => { 
          return Number(params.Rs)+Number(((Math.cos((params.n*Math.PI)/2))/(params.Q*Math.pow(w,params.n)))) ;
            }); // Rs+(cos(n*pi/2)/Qw^n)
          const Rs_CPE_ImagPart =omega.map(w => { 
          return (-1*( Math.sin((params.n*Math.PI)/2) ) / (params.Q*Math.pow(w,params.n)));
            }); // -sin(n*pi/2)/Qw^n)
          nyquistData.x=Rs_CPE_RealPart;
          nyquistData.y=Rs_CPE_ImagPart;
          nyquistData.frequencies=validFrequencies;
        break;
        case "Rp_CPE":
          const Rp_CPE_RealPart =omega.map(w => { 
            const molecule =((1/params.Rp)+(params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2)));//分子
            const denom =( (Math.pow((((1/params.Rp)+(params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2)))),2))+(Math.pow((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)),2)) ); //分母
          return (molecule/denom) ;
            }); 
          const Rp_CPE_ImagPart =omega.map(w => { 
            const molecule = -1*((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)));
            const denom = ((Math.pow((((1/params.Rp)+(params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2)))),2))+(Math.pow((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)),2)));
          return molecule/denom;
            }); 
          nyquistData.x=Rp_CPE_RealPart;
          nyquistData.y=Rp_CPE_ImagPart;
          nyquistData.frequencies=validFrequencies;
        break;
        case "Rs_(CPERp)":
        
          const Rs_CPE_Rp_RealPart =omega.map(w => { 
            const molecule =(Number((1/params.Rp))+Number((params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2))));//分子
            const denom =( (Math.pow((((1/params.Rp)+(params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2)))),2))+(Math.pow((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)),2)) ); //分母
          return (Number(params.Rs)+Number((molecule/denom)));
        }); 
          const Rs_CPE_Rp_ImagPart =omega.map(w => { 
            const molecule = -1*((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)));
            const denom = ((Math.pow((((1/params.Rp)+(params.Q*Math.pow(w,params.n)*Math.cos((params.n*Math.PI)/2)))),2))+(Math.pow((params.Q*Math.pow(w,params.n)*Math.sin((params.n*Math.PI)/2)),2)));
            return molecule/denom;
}); 
          nyquistData.x=Rs_CPE_Rp_RealPart;
          nyquistData.y=Rs_CPE_Rp_ImagPart;
          nyquistData.frequencies=validFrequencies;
        break;
        case "Rs_(CPE1Rp1)_(CPE2Rp2)":
        const Rs_CPERp_CPERp_RealPart = omega.map((w) => {
            const calculateRealPart = (Rp: number, Q: number, n: number, w: number) => {
            const cosTerm = Math.cos((n * Math.PI) / 2); // cos(nπ/2)
            const sinTerm = Math.sin((n * Math.PI) / 2); // sin(nπ/2)
            const admittanceReal = 1 / Rp + Q * Math.pow(w, n) * cosTerm; // 实部
            const admittanceImag = Q * Math.pow(w, n) * sinTerm; // 虚部
            const denom = Number(Math.pow(admittanceReal, 2)) + Number(Math.pow(admittanceImag, 2)); // 分母
            return admittanceReal / denom; // 实部
            };
            const realPart1 = calculateRealPart(params.Rp1, params.Q1, params.n1, w);
            const realPart2 = calculateRealPart(params.Rp2, params.Q2, params.n2, w);
              return (Number(realPart1) + Number(realPart2));
            });
            const Rs_CPERp_CPERp_ImagPart = omega.map((w) => {
              const calculateImagPart = (Rp: number, Q: number, n: number, w: number) => {
              const cosTerm = Math.cos((n * Math.PI) / 2); // cos(nπ/2)
              const sinTerm = Math.sin((n * Math.PI) / 2); // sin(nπ/2)
              const admittanceReal = 1 / Rp + Q * Math.pow(w, n) * cosTerm; // 实部
              const admittanceImag = Q * Math.pow(w, n) * sinTerm; // 虚部
              const denom = Number(Math.pow(admittanceReal, 2)) + Number(Math.pow(admittanceImag, 2)); // 分母
              return -admittanceImag / denom; // 虚部
              };
                const imagPart1 = calculateImagPart(params.Rp1, params.Q1, params.n1, w);
                const imagPart2 = calculateImagPart(params.Rp2, params.Q2, params.n2, w);
                return (Number(imagPart1) + Number(imagPart2));
                });
          nyquistData.x=Rs_CPERp_CPERp_RealPart;
          nyquistData.y=Rs_CPERp_CPERp_ImagPart;
          nyquistData.frequencies=validFrequencies;
          break;
          case "Rs_Rp1C1_Rp2C2":
          const Rs_Rp1C1_Rp2C2realPart = omega.map((w) => {
              const denom1 = 1 + Math.pow(w * params.C1 * params.Rp1, 2); // (Rp1 || C1)
              const denom2 = 1 + Math.pow(w * params.C2 * params.Rp2, 2); // (Rp2 || C2)
              return (Number(params.Rp1 / denom1) + Number(params.Rp2 / denom2));
              });
          const Rs_Rp1C1_Rp2C2imagPart = omega.map((w) => {
              const denom1 = 1 + Math.pow(w * params.C1 * params.Rp1, 2); // (Rp1 || C1)
              const denom2 = 1 + Math.pow(w * params.C2 * params.Rp2, 2); // (Rp2 || C2)
              return (
                Number((-w * Math.pow(params.Rp1, 2) * params.C1) / denom1) +
                Number((-w * Math.pow(params.Rp2, 2) * params.C2) / denom2)
               );
              });
        nyquistData.x=Rs_Rp1C1_Rp2C2realPart;
        nyquistData.y=Rs_Rp1C1_Rp2C2imagPart;
        nyquistData.frequencies=validFrequencies;
        break;
        case "Rs_C_RpW":
//后续有需要拓展可以按照下面的方式用导纳  复数  运算，会简便很多  可以拓展到灵活动态电路的建模后在计算阻抗
  const impedanceResults = omega.map((w) => {

  // w 的平方根和平方根的倒数
  const sqrt_inv_w = Math.pow(w, -0.5); // w^-0.5
  // Rp + Warburg 的导纳（作为一个复数）
  const RpW: Complex = complex(
    Number(params.Rp) + Number(params.sigma * sqrt_inv_w), // 实部
    -params.sigma * sqrt_inv_w // 虚部
  );
  const GRpW: Complex = divide(1, RpW)as Complex; // 导纳 RpW 的倒数
  // 电容的导纳 G = wC
  const GC: Complex = complex(0, w * params.C); // wC 是一个纯实数
  // 并联部分的总导纳
  const GpallTotal: Complex = add(GRpW, GC);
  // 并联部分的总阻抗（导纳的倒数）
  const GpallTotalInv: Complex = divide(1, GpallTotal)as Complex;
  // 总阻抗（Rs + 并联部分阻抗）
  const totalZ: Complex = add(GpallTotalInv, complex(params.Rs, 0));
  return totalZ; // 返回总阻抗
});

// 提取实部和虚部
const Rs_C_RpWrealPart = impedanceResults.map((imp) => imp.re); // 实部
const Rs_C_RpWimagPart = impedanceResults.map((imp) => imp.im); // 虚部
      nyquistData.x=Rs_C_RpWrealPart;
        nyquistData.y=Rs_C_RpWimagPart;
        nyquistData.frequencies=validFrequencies;
        break
          default:
        throw new Error("Unsupported model: " + model);
    }
  return nyquistData;
}






// ==================================================================仿真图
const simNyquistPlot = ref<HTMLDivElement | null>(null);
const simBodePlot = ref<HTMLDivElement | null>(null)

//分析组件的奈奎斯特图
const drawsimNyquistPlot=(): void=> {
  if (simNyquistPlot.value) {
    // 确保数据存在并从不同的文件名（ToolViewUploadFileName）中读取数据
    const simNyquistPlotData = Object.keys(authStore.nyquistPlotData).map(fileKey => {
      if(selectSimFiles.value.includes(fileKey)){
      const fileData = authStore.nyquistPlotData[fileKey];
      const shortenedFileName = fileKey.length > 5 ? fileKey.substring(0, 5) + '...' : fileKey;
      if (fileData && fileData.x && fileData.y && fileData.text) {

      const color = "green";  //
        return {
          x: fileData.x,
          y: fileData.y,
          text: fileData.text,
          mode: "lines+markers",
          name: shortenedFileName, // 使用文件名作为图例
          hovertemplate: "实部: %{x}<br />虚部: %{y}<br />频率: %{text}<extra></extra>",
          line: { color },  // 设置增益数据的颜色
            markers: {
              color,  // 设置增益数据点的颜色
            },
        };
      }
    }
      return null;
    }).filter(item => item !== null); // 过滤掉无效数据

    const layout = {
      title: {
    x: -1, // 标题在x轴上的位置，0表示最左边，1表示最右边
    y: 1, // 标题在y轴上的位置，0表示最底部，1表示最顶部
    xref: 'paper', // 相对于纸张的x位置
    yref: 'paper', // 相对于纸张的y位置
    text: "奈奎斯特图", // 标题文本
    titlefont: {
      size: 15, // 标题字体大小
      family: 'Arial, sans-serif', // 标题字体
    },
  },
      xaxis: { title: "阻抗实部 Zr (Ω)" },
      yaxis: { title: "阻抗虚部的相反数 -Zm (Ω)" },
      aspectratio: { x: 1, y: 1 },
      font: { size: 13 },
      legend: {
        font: {size: 8,},// 设置图例中文本的大小
        x: -10,  // 将图例位置移至右边
        y: 1,     // 将图例放置到顶部
        xanchor: 'left',  // 设置图例左对齐
        yanchor: 'top',   // 设置图例顶部对齐
        traceorder: 'normal',
      },
      margin: {
        l: 1,  // 左边距
        r: 1, // 右边距，给图例更多的空间
        b: 40,  // 下边距
        t: 30,  // 上边距
      },
      // dragmode: 'zoom', // 启用缩放和拖拽模式
    }as Partial<Plotly.Layout>;
// 绘制图表
Plotly.newPlot(simNyquistPlot.value, simNyquistPlotData, layout);
  }
}

const drawsimBodePlot = (): void => {
 if (simBodePlot.value) {
   const simBodePlotData = Object.keys(authStore.bodePlotData).map(fileKey => {
    if(selectSimFiles.value.includes(fileKey)){
    const shortenedFileName = fileKey.length > 5 ? fileKey.substring(0, 5) + '...' : fileKey;
     const fileData = authStore.bodePlotData[fileKey];
     if (fileData && fileData.x && fileData.y && fileData.fre) {
     // 获取文件对应的颜色
     const color = "green";  // 如果缓存没有颜色则生成一个
      
       return [
         {
           x: fileData.fre, // 频率
           y: fileData.x, // 增益
           text:fileData.fre.map(freq => Math.pow(10,freq).toFixed(3)),
           mode: "lines+markers",
           name: `${shortenedFileName} - 增益`,
           hovertemplate: "频率: %{text}<br />|Z|: %{y}<extra></extra>",
           yaxis: "y", // 绑定到主Y轴
           line: { color },  // 设置增益数据的颜色
           markers: {
             color,  // 设置增益数据点的颜色
           },
         },
         {
           x: fileData.fre, // 频率
           y: fileData.y, // 相位
           text:fileData.fre.map(freq => Math.pow(10,freq).toFixed(3)),
           mode: "lines+markers",
           name: `${shortenedFileName} - 相位`,
           hovertemplate: "频率: %{text}<br />相位: %{y}<extra></extra>", // 修正为y
           yaxis: "y2", // 绑定到第二个Y轴
           line: { color },  // 设置增益数据的颜色
           markers: {
             color,  // 设置增益数据点的颜色
           },
           marker: {
          color:"green",
              symbol: "triangle-up-open", // 设置标记为空心向上三角形
              size: 10, // 设置标记大小
              // symbol:"x-open",
            },
         },
       ];
     }}
     return null;
   }).flat().filter(item => item !== null);

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
 
 xaxis: { title: "频率 (Hz)" },
 yaxis: {
   title: "|Z|(Ω)",
   side: "left",
   showgrid: true,
 },
 yaxis2: {
   title: "相位 (°)",
   side: "right",
   overlaying: "y", // 修正为与主Y轴重叠
   showgrid: false,
 },
 font: { size: 13 },
 legend: {
       font: {size: 10,},// 设置图例中文本的大小
       x: -10,  // 将图例位置移至右边
       y: 1,     // 将图例放置到顶部
       xanchor: 'left',  // 设置图例左对齐
       yanchor: 'top',   // 设置图例顶部对齐
       traceorder: 'normal',
     },
     margin: {
       l: 1,  // 左边距
       r: 1, // 右边距，给图例更多的空间
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
   Plotly.newPlot(simBodePlot.value, simBodePlotData, layout, config);
 }
};

const choiseNyquistData = ref<{
  x: number[];
  y: number[];
  text: number[];
}>({
  x: [0],
  y: [0],
  text: [0]
});

const updateSimAnalyseData = (simNyquistData: { x: number[]; y: number[]; fre:number[] }): void => { 
  if(selectSimFiles.value!=""){
// 调用计算函数生成拟合的奈奎斯特数据
const nyquistFileData = authStore.nyquistPlotData[selectSimFiles.value];

    const nyquistOriginalData = {
      x: nyquistFileData.x,
      y: nyquistFileData.y,
      text: nyquistFileData.text,
      mode: "lines+markers",
      name: "选中数据",
      hovertemplate: "实部: %{x}<br />虚部: %{y}<br />频率: %{text}<extra></extra>",
      line: { color : "green" },
    };
    const temFitY = simNyquistData.y.map(y => -1 * y); 
    const temFitX = simNyquistData.x; 
    const temFitFre=simNyquistData.fre;

    const nyquistSimData = {
      x: temFitX,
      y: temFitY,
      text: temFitFre,
      mode: "lines+markers",
      name: "仿真数据",
      hovertemplate: "实部: %{x}<br />虚部: %{y}<br />频率: %{text}<extra></extra>",
      line: { color: "blue" },
      marker: { color: "blue" },
    };
    const nyquistLayout: Partial<Plotly.Layout> = {
      title: {
        text: "奈奎斯特图",
        xref: "paper",
        yref: "paper",
        x: -1,
        y: 1
      },
      xaxis: { title: "阻抗实部 Zr (Ω)" },
      yaxis: { title: "阻抗虚部的相反数 -Zm (Ω)" },
    
      font: { size: 13 },
      legend: {
        font: { size: 8 },
        x: -10,
        y: 1,
        xanchor: "left",
        yanchor: "top",
        traceorder: "normal",
      },
      margin: { l: 1, r: 1, b: 40, t: 30 },
    };
    const nyquistUpdatedData = [nyquistOriginalData, nyquistSimData];
  
    Plotly.react(simNyquistPlot.value!, nyquistUpdatedData, nyquistLayout);
  
 // ========== 更新波特图 ==========
  
        // 开始计算波特图数据
        // const bodeFittedData=computeBodePlot(nyquistFittedData.x, nyquistFittedData.y, nyquistFittedData.frequencies);
        const bodeFileData = authStore.bodePlotData[selectSimFiles.value];
        const gainBodeFittedData:number[]=[];
        const phaseBodeFittedData:number[]=[];
        const freBodeFittedData:number[]=[];
for (let i = 0; i < nyquistSimData.x.length; i++) {
 
        const magnitude = Math.sqrt(nyquistSimData.x[i] ** 2 + nyquistSimData.y[i] ** 2); // 计算模长（增益）
        gainBodeFittedData.push(magnitude);
        // 计算相位（弧度）
        const phaseAngle = Math.atan2(nyquistSimData.y[i], nyquistSimData.x[i]);
        // const phaseAngle = Math.atan( yData[i]/xData[i]);
         const phaseInDegrees = phaseAngle * (180 / Math.PI);  // 转换为度
         phaseBodeFittedData.push(phaseInDegrees);
         freBodeFittedData.push(Math.log10(nyquistSimData.text[i]));
}
//存储到中间变量
simBodePlotData.value.x=gainBodeFittedData;
simBodePlotData.value.y=phaseBodeFittedData;
simBodePlotData.value.fre=freBodeFittedData;
// ==========================================================
    const bodeOriginalData = [
      {
        x: bodeFileData.fre,
        y: bodeFileData.x,
        text:bodeFileData.fre.map(freq => Math.pow(10,freq).toFixed(3)),
        mode: "lines+marker",
        name: "选中数据 - |Z|",
        hovertemplate: "频率: %{text}<br />|Z|(Ω): %{y}<extra></extra>",
        yaxis: "y",
        line: { color : "green" },
      },
      {
        x: bodeFileData.fre,
        y: bodeFileData.y,
        text:bodeFileData.fre.map(freq => Math.pow(10,freq).toFixed(3)),
        mode: "lines+markers",
        name: "选中数据 - 相位",
        hovertemplate: "频率: %{text}<br />相位: %{y}<extra></extra>",
        yaxis: "y2",
        line: { color : "green"  ,
          dash: "dash",//设置为虚线
          
        },
        marker: { 
          color: "green",
              symbol: "triangle-up-open", // 设置标记为空心向上三角形
              size: 10, // 设置标记大小
        },
      },
    ];
    const bodeSimData = [
      {
        x: freBodeFittedData,
        y: gainBodeFittedData,
        text:freBodeFittedData.map(freq => Math.pow(10,freq).toFixed(3)),
        mode: "lines+markers",
        name: "仿真数据 - |Z|",
        hovertemplate: "频率: %{text}<br />|Z|(Ω): %{y}<extra></extra>",
        yaxis: "y",
        line: { color: "blue" },
        marker: { color: "blue" },
      },
      {
        x: freBodeFittedData,
        y: phaseBodeFittedData,
        text:freBodeFittedData.map(freq => Math.pow(10,freq).toFixed(3)),
        mode: "lines+markers",
        name: "仿真数据 - 相位",
        hovertemplate: "频率: %{text}<br />相位: %{y}<extra></extra>",
        yaxis: "y2",
        line: { color: "blue" },
        marker: { color: "blue" ,
              symbol: "triangle-up-open", // 设置标记为空心向上三角形
              size: 10, // 设置标记大小
              // symbol:"x-open",
        },
      },
    ];
    const bodeUpdatedData = [...bodeOriginalData, ...bodeSimData];
    const bodeLayout = {
      // 波特图布局，保持不变
      title: { text: "波特图", x: -1, y: 1 },
      xaxis: { title: "频率 (Hz)" },
      yaxis: { title: "|Z| (Ω)", side: "left", showgrid: true },
      yaxis2: {
        title: "相位 (°)",
        side: "right",
        overlaying: "y",
        showgrid: false,
      },
      legend: {
        x: 1,
        y: 1,
        xanchor: "left",
        yanchor: "top",
        traceorder: "normal",
      },
      font: { size: 13 },
      margin: { l: 1, r: 1, b: 40, t: 30 },
      hovermode: "x unified",
    } as Partial<Plotly.Layout>;
    Plotly.react(simBodePlot.value!, bodeUpdatedData, bodeLayout);
  }else{
    const temFitY = simNyquistData.y.map(y => -1 * y); 
    const temFitX = simNyquistData.x; 
    const temFitFre=simNyquistData.fre;
    const nyquistSimData = {
      x: temFitX,
      y: temFitY,
      text: temFitFre,
      mode: "lines+markers",
      name: "仿真数据",
      hovertemplate: "实部: %{x}<br />虚部: %{y}<br />频率: %{text}<extra></extra>",
      line: { color: "blue" },
      marker: { color: "blue" },
    };
    const nyquistLayout: Partial<Plotly.Layout> = {
      title: {
        text: "奈奎斯特图",
        xref: "paper",
        yref: "paper",
        x: -1,
        y: 1
      },
      xaxis: { title: "阻抗实部 Zr (Ω)" },
      yaxis: { title: "阻抗虚部的相反数 -Zm (Ω)" },
    
      font: { size: 13 },
      legend: {
        font: { size: 8 },
        x: -10,
        y: 1,
        xanchor: "left",
        yanchor: "top",
        traceorder: "normal",
      },
      margin: { l: 1, r: 1, b: 40, t: 30 },
    };
    const nyquistUpdatedData = [ nyquistSimData];
    if(simNyquistPlot.value){
      Plotly.newPlot(simNyquistPlot.value, nyquistUpdatedData, nyquistLayout);
    }
        const gainBodeFittedData:number[]=[];
        const phaseBodeFittedData:number[]=[];
        const freBodeFittedData:number[]=[];
    for (let i = 0; i < nyquistSimData.x.length; i++) {
 
 const magnitude = Math.sqrt(nyquistSimData.x[i] ** 2 + nyquistSimData.y[i] ** 2); // 计算模长（增益）
 gainBodeFittedData.push(magnitude);
 // 计算相位（弧度）
 const phaseAngle = Math.atan2(nyquistSimData.y[i], nyquistSimData.x[i]);
 // const phaseAngle = Math.atan( yData[i]/xData[i]);
  const phaseInDegrees = phaseAngle * (180 / Math.PI);  // 转换为度
  phaseBodeFittedData.push(phaseInDegrees);
  freBodeFittedData.push(Math.log10(nyquistSimData.text[i]));
}
//存储到中间变量
simBodePlotData.value.x=gainBodeFittedData;
simBodePlotData.value.y=phaseBodeFittedData;
simBodePlotData.value.fre=freBodeFittedData;
    const bodeSimData = [
      {
        x: freBodeFittedData,
        y: gainBodeFittedData,
        text:freBodeFittedData.map(freq => Math.pow(10,freq).toFixed(3)),
        mode: "lines+markers",
        name: "仿真数据 - |Z|",
        hovertemplate: "频率: %{text}<br />|Z|(Ω): %{y}<extra></extra>",
        yaxis: "y",
        line: { color: "blue" },
        marker: { color: "blue" },
      },
      {
        x: freBodeFittedData,
        y: phaseBodeFittedData,
        text:freBodeFittedData.map(freq => Math.pow(10,freq).toFixed(3)),
        mode: "lines+markers",
        name: "仿真数据 - 相位",
        hovertemplate: "频率: %{text}<br />相位: %{y}<extra></extra>",
        yaxis: "y2",
        line: { color: "blue" },
        marker: { color: "blue" ,
              symbol: "triangle-up-open", // 设置标记为空心向上三角形
              size: 10, // 设置标记大小
              // symbol:"x-open",
        },
      },
    ];
    const bodeUpdatedData = [...bodeSimData];
 const bodeLayout = {
      // 波特图布局，保持不变
      title: { text: "波特图", x: -1, y: 1 },
      xaxis: { title: "频率 (Hz)" },
      yaxis: { title: "|Z| (Ω)", side: "left", showgrid: true },
      yaxis2: {
        title: "相位 (°)",
        side: "right",
        overlaying: "y",
        showgrid: false,
      },
      legend: {
        x: 1,
        y: 1,
        xanchor: "left",
        yanchor: "top",
        traceorder: "normal",
      },
      font: { size: 13 },
      margin: { l: 1, r: 1, b: 40, t: 30 },
      hovermode: "x unified",
    } as Partial<Plotly.Layout>;
      if(simBodePlot.value){
        Plotly.newPlot(simBodePlot.value, bodeUpdatedData, bodeLayout);
      }
  }
  }

  
//===================导出数据功能=============
const nyquistBodeData = computed({
  get: () => circuitData.nyquistBodeData,
  set: (value) => {
    circuitData.nyquistBodeData = value;
  }
});
const bottomExportToExcel = () => {
  nyquistBodeData.value.freq = simNyquistPlotData.value.fre;
  nyquistBodeData.value.real = simNyquistPlotData.value.x;
  nyquistBodeData.value.imag = simNyquistPlotData.value.y;
  nyquistBodeData.value.magnitude = simBodePlotData.value.x;
  nyquistBodeData.value.phase = simBodePlotData.value.y;
  const arryNyquistBodeData=prepareNyquistBodeData(nyquistBodeData.value);
  exportToExcel(selectSimCircuitMode.value,startSimFrequency.value,endSimFrequency.value,curruntSimParams.value,arryNyquistBodeData,curruntCircuitImages.value)
};

function prepareNyquistBodeData( nyquistBodeData: { freq: number[]; real: number[]; imag: number[]; magnitude: number[]; phase: number[] }
) {
  const nyquistBodeDataArray: { freq: number; real: number; imag: number; magnitude: number; phase: number }[] = [];
  // 确保所有数组长度一致
  const length = Math.min(
    nyquistBodeData.freq.length,
    nyquistBodeData.real.length,
    nyquistBodeData.imag.length,
    nyquistBodeData.magnitude.length,
    nyquistBodeData.phase.length
  );
  for (let i = 0; i < length; i++) {
    nyquistBodeDataArray.push({
      freq: nyquistBodeData.freq[i],
      real: nyquistBodeData.real[i],
      imag: nyquistBodeData.imag[i],
      magnitude: nyquistBodeData.magnitude[i],
      phase: nyquistBodeData.phase[i],
    });
  }
  return nyquistBodeDataArray;
}

import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
async function exportToExcel(
  circuitType: string, // 电路类型
  startFreq: number, // 起始频率
  endFreq: number, // 终止频率
  params: { [s: string]: unknown; } | ArrayLike<unknown>, // 参数信息，例如 { Rs: 500, Rp: 500, C: 1e-7, sigma: 10 }
  nyquistBodeData: { freq: any; real: any; imag: any; magnitude: any; phase: any; }[], // 组合后的数据 [{ freq, real, imag, magnitude, phase }]
  imagePath: string// 图片路径，用于插入到 Excel
) {
  // 创建工作簿和工作表
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('仿真数据');
  // 填充表格基本数据
  worksheet.addRow(['电路模型：', circuitType]);
  worksheet.addRow(['起始频率：', startFreq]);
  worksheet.addRow(['终止频率：', endFreq]);
  // 添加电路参数
  worksheet.addRow([]);
  worksheet.addRow(['电路参数：']);
  Object.entries(params).forEach(([key, value]) => {
    worksheet.addRow([key, value]);
  });
  // 添加空行分隔
  worksheet.addRow([]);
  worksheet.addRow(['频率（Hz）', '阻抗实部 Zr(Ω)', '阻抗虚部 Zm (Ω)', '模长 |Z| (Ω)', '相位 度(°)']);
  // 填充奈奎斯特和波特图数据
  nyquistBodeData.forEach(({ freq, real, imag, magnitude, phase }) => {
    worksheet.addRow([freq, real, imag, magnitude, phase]);
  });
  // 插入图片
  if (imagePath) {
    const imageData = await fetch(imagePath)
      .then((res) => res.arrayBuffer())
      .catch((err) => console.error('图片加载失败', err));

    if (imageData) {
      const imageId = workbook.addImage({
        buffer: imageData,
        extension: 'png', // 确保图片格式正确
      });

      worksheet.addImage(imageId, {
        tl: { col:3, row: 1 }, // 图片插入的左上角位置
        ext: { width: 200, height: 100 }, // 图片大小
      });
    }
  }
  // 导出 Excel 文件
  const excelFileName = '仿真电路数据.xlsx';
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  // 触发下载
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = excelFileName;
  link.click();
}

//==================================================================清除数据部分==============
//清除分析数据
const ClearAnalyseDrawPlotData= () => {
      startSimFrequency.value=0;
      endSimFrequency.value=0;
      historyFit.value=[];
      simFrequency.value=[];
      simOmega.value=[];
      simParams.value=[];
  selectSimFiles.value = "";
      
  simBodePlotData.value = { x: [], y: [], fre: [] };
      
  simNyquistPlotData.value = { x: [], y: [], fre: [] };
  drawsimNyquistPlot();
      drawsimBodePlot();
      selectSimCircuitMode.value="Rp_C";
      circuitImages.value="/sim_Figure/RpC.png";
      nyquistBodeData.value={freq:[],real:[],imag:[],magnitude:[],phase:[]};
      curruntCircuitImages.value="";
      curruntSimParams.value = {};
      
}

//清空左边上传视图的  数据按钮触发的事件  清除所有上传的奈奎斯特图和波特图数据
const clearDrawPlotData = () => {
  if(authStore.nyquistPlotData && authStore.bodePlotData){
    authStore.nyquistPlotData = {};
    authStore.saveNyquistPlotData();
    authStore.bodePlotData = {};
    authStore.saveBodePlotData();
    fileName2.value = [];
    ElMessage.success("数据已清空！");
    }
    drawNyquistPlot();
    drawBodePlot();
    draw3DNyquistPlot();
    draw3DBodePlot();
    clearSelection();
  };


//拟合数据的清除选中电
const clearSelection = () => {
  selectedStartIndex = null;
  selectedEndIndex = null;
  inistantFitCircuitMode.value="Rp_C";
  FittingParams.value="";
  startPointInfo.value="";
  endPointInfo.value="";
  selectSimFiles.value=""
  // 重新绘制图表
  drawAnalyseNyquistPlot();
  drawAnalyseBodePlot();
};
//==================================================================生成参数对应的图

  // selectSimFiles
  watch(selectSimFiles, (newValue) => {
    drawsimNyquistPlot();
    drawsimBodePlot();
    if(simNyquistPlotData.value.fre.length>0){
    updateSimAnalyseData(simNyquistPlotData.value)
  }
  });
  //每次刷新页面会自动执行下面的函数
  onMounted(() => {
  authStore.loadNyquistPlotData();
  authStore.loadBodePlotData();
  circuitData.saveToolsViewData();
  circuitData.loadToolViewData();
  drawNyquistPlot();
  drawBodePlot();//波特图数据来源是是奈奎斯特的数据
  draw3DNyquistPlot();
  draw3DBodePlot();
  drawAnalyseNyquistPlot();
  drawAnalyseBodePlot();
  drawsimNyquistPlot();
  drawsimBodePlot();
  if(simNyquistPlotData.value.fre.length>0){
    updateSimAnalyseData(simNyquistPlotData.value)
  }
});
</script>
<style scoped>
  .simImage{
      /* 你可以为这个卡片添加一些样式 */
    display: flex;
    justify-content: flex-start; /* 将内容向右对齐 */
    width: 13vw;
    height:200px;
  }
  img {
  max-width: 100%; /* 让图片最大宽度为父元素的宽度 */
  height: auto;
}
  .historyFit{
    display: flex;
    justify-content: flex-start; /* 将内容向右对齐 */
    width: 13vw;
    height:200px;
  }
  .testt {
    height: 900px;}

  .custom-3d-plot​ {
    display: flex;
    justify-content: flex-start; /* 将内容向右对齐 */
  width: 600px;
  height:300px;
   margin: 1 ;
}  
</style>