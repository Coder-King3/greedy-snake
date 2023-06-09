<template>
  <div>
    <!-- 主容器 -->
    <div id="main">
      <!-- 游戏窗口 -->
      <Stage></Stage>
      <!-- 计分板 -->
      <ScoreBoard></ScoreBoard>
      <!-- 控制面板 -->
      <ControlPanel></ControlPanel>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Stage from './GameBox/Stage.vue';
import ScoreBoard from './GameBox/ScoreBoard.vue';
import ControlPanel from './GameBox/ControlPanel.vue';

export default defineComponent({
  name: 'GameBox',
  components: {Stage,ScoreBoard,ControlPanel}
});
</script>

<style lang="less">
  // 预设
  *{
    margin: 0;
    padding: 0;
    // 改变盒子的计算方式
    box-sizing: border-box;
  }
  body{
    font:bold 20px "Courier";
  }
  // 主容器
  #main {
    width: 360px;
    height: 450px;
    background-color: #ebedf3;
    margin: 36px auto;
    border: 10px solid #000000;
    box-shadow: 0 0 15px rgb(0,0,0,50%);
    border-radius:20px;
    // 对齐
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content:space-around;
  }
</style>
