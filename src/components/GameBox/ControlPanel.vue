<template>
  <div id="controlpanel">
    <!-- 开始结束 -->
    <div id="optionBtn">
      <button v-show="!isLive" @click="playGame">Play Game ▶</button>
      <button v-show="isLive" @click="endGame">End Game ■</button>
    </div>
    <!-- 控制摇杆 -->
    <div id="rocker">
      <div id="rocker_top">
        <button  @click="runUp">↑</button>
      </div>
      <div id="rocker_right">
        <button @click="runLeft">←</button>
      </div>
      <div id="rocker_left">
        <button @click="runRight">→</button>
      </div>
      <div id="rocker_bottom">
        <button @click="runDown">↓</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { 
  defineComponent,
  reactive,
  toRefs,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import pubsub from 'pubsub-js';

export default defineComponent({
  name: 'ControlPanel',
  setup() {
    let control = reactive({
      // 数据
      direction: '',
      runTimeID: 0,
      initial: 300,
      runTime: 300,
      isLive: false,
      message: '',
      receiveLevelID: '',
      upIsLiveID: '',
      directionRunID: '',
      // 方法
      runUp(){
        runSnake('ArrowUp',control.runTime)
      },
      runDown(){
        runSnake('ArrowDown',control.runTime)
      },
      runLeft(){
        runSnake('ArrowLeft',control.runTime)
      },
      runRight(){
        runSnake('ArrowRight',control.runTime)
      },
      playGame(){
        pubsub.publish('upIsLive',{liveState:true,message:''});
      },
      endGame(){
        pubsub.publish('upIsLive',{liveState:false,message:''});
      }
    })
    let runSnake = function(direction:string,runTime:number) {
      // 关闭定时器(防抖)
      clearTimeout(control.runTimeID)
      // control.isLive为true时游戏未结束继续跑
      if (control.isLive) {
        control.runTimeID = setTimeout(()=>{
          // 更改蛇坐标
          pubsub.publish('runSnake',direction)
          // 递归调用
          runSnake(direction,runTime);
        },runTime);
      }
    }
    let gameTips = function(istips:boolean,tips:string) {
      if (istips === false && tips != '') {
        alert(tips);
      }
    }

    // 创建控制面板类
    class ControlPanel {
      // 构造函数
      constructor() {
        this.init()
      }
      // 初始化函数
      init() {
        // 全局监听键盘方向键
        this.runDirectionKey();
      }
      // 监听方向事件
      runDirectionKey(){
        document.onkeydown = (e)=> {
          control.direction = e.key;
          switch (control.direction) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
              runSnake(control.direction,control.runTime);
              break;
          }
        }
      }
    }

    // 监视
    watch(()=>control.isLive,(newValue)=>{
      // 调用提示
      gameTips(newValue,control.message);
    },{deep:true}) 

    // 生命周期钩子
    onMounted(()=>{
      // 创建控制面板实例
      new ControlPanel();
      // 更改跑步速度
      control.receiveLevelID = pubsub.subscribe('receiveLevel',(_,level:number)=>{
        control.runTime = control.initial - level * 27;
      })
      // 游戏的开始与结束
      control.upIsLiveID = pubsub.subscribe('upIsLive',(_,{liveState,message})=>{
        control.isLive = <boolean>liveState;
        control.message = <string>message;
        // 开始游戏显示游戏体
        if (liveState) {
          runSnake('ArrowDown',control.runTime)
          pubsub.publish('reductionSnake',liveState);
          pubsub.publish('reductionFood',liveState);
          pubsub.publish('switchMachine',liveState);
        }else{
          pubsub.publish('reductionSnake',liveState);
          pubsub.publish('reductionFood',liveState);
          pubsub.publish('switchMachine',liveState);
          pubsub.publish('emptyScoreLevel');
        }
      })
      control.directionRunID = pubsub.subscribe('directionRun',(_,direction:string)=>{
        clearTimeout(control.runTimeID);
        runSnake(direction,control.runTime);
      })
    })
    onBeforeUnmount(()=>{
      pubsub.unsubscribe(control.receiveLevelID);
      pubsub.unsubscribe(control.upIsLiveID);
      pubsub.unsubscribe(control.directionRunID);
    })

    // 返回对象
    return {
      ...toRefs(control)
    }
  },
});
</script>

<style lang="less" scoped>
  #controlpanel{
    width: 240px;
    display: flex;
    justify-content:space-between;
    // 游戏选项按钮
    #optionBtn{
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content:space-around;
      button{
        width: 90px;
        height: 25px;
        padding: 2px;
        background: #f0f0f0;
      }
    }
    // 摇杆
    #rocker{
      width: 90px;
      text-align: center;
      display: flex;
      flex-flow: row wrap;
      &>div button{
        width: 20px;
        height: 20px;
        font-weight: bold;
        background: #f0f0f0;
      }
      #rocker_top{
        width: 90px;
      }
      #rocker_right{
        width: 45px;
      }
      #rocker_left{
        width: 45px;
      }
      #rocker_bottom{
        width: 90px;
      }
    }
  }
</style>
