<template>
  <!-- 游戏窗口 -->
  <div id="stage" :class="stage.stageBg">
    <!-- 蛇🐍本体 -->
    <Snake></Snake>
    <!-- 食物 -->
    <Food></Food>
  </div>
</template>

<script lang="ts">
  import { defineComponent,reactive,onMounted,onBeforeUnmount } from 'vue';
  import Food from './Stage/Food.vue';
  import Snake from './Stage/Snake.vue';
  import pubsub from 'pubsub-js';
  export default defineComponent({
    name: 'Stage',
    components: {Food,Snake},
    setup(){
      // 数据
      let stage = reactive({
        stageBg:{
          playStageBg: false,
          endStageBg: true,
        },
        switchMachineID: ''
      })

      // 方法
      let switchMachine = (_:string,isOnOff:boolean) =>{
        if (isOnOff) {
          stage.stageBg.playStageBg = true;
          stage.stageBg.endStageBg = false;
        }else {
          stage.stageBg.playStageBg = false;
          stage.stageBg.endStageBg = true;
        }
      }

      // 生命周期钩子
      onMounted(()=>{
        pubsub.subscribe('switchMachine',switchMachine)
      })
      onBeforeUnmount(()=>{
        pubsub.unsubscribe(stage.switchMachineID)
      })

      // 返回对象
      return {
        stage
      }
    }
  });
</script>

<style lang="less" scoped>
  // 游戏窗口
  #stage {
    width: 304px;
    height: 304px;
    border: 2px solid #000000;
    position: relative;
    
  }
  .playStageBg{
    background: url(../../assets/bg.png) no-repeat;
    background-position: 18% 50%
  }
  .endStageBg{
    background: #605e5c;
  }
</style>
