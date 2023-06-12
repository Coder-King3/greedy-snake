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
        <button @click="runUp">↑</button>
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
} from "vue";
import pubsub from "pubsub-js";
import useControlPanel from "../../hooks/useControlPanel";
export default defineComponent({
  name: "ControlPanel",
  setup() {
    // Hook -> useFood
    const { ControlPanel, control, runSnake, gameTips } = useControlPanel();

    // 监视
    watch(
      () => control.isLive,
      (newValue: any) => {
        // 调用提示
        gameTips(newValue, control.message);
      },
      { deep: true }
    );

    // 生命周期钩子
    onMounted(() => {
      // 创建控制面板实例
      new ControlPanel();
      // 更改跑步速度
      control.receiveLevelID = pubsub.subscribe(
        "receiveLevel",
        (_, level: number) => {
          control.runTime = control.initial - level * 27;
        }
      );
      // 游戏的开始与结束
      control.upIsLiveID = pubsub.subscribe(
        "upIsLive",
        (_, { liveState, message }) => {
          control.isLive = <boolean>liveState;
          control.message = <string>message;
          // 开始游戏显示游戏体
          if (liveState) {
            runSnake("ArrowDown", control.runTime);
            pubsub.publish("reductionSnake", liveState);
            pubsub.publish("reductionFood", liveState);
            pubsub.publish("switchMachine", liveState);
          } else {
            pubsub.publish("reductionSnake", liveState);
            pubsub.publish("reductionFood", liveState);
            pubsub.publish("switchMachine", liveState);
            pubsub.publish("emptyScoreLevel");
          }
        }
      );
      control.directionRunID = pubsub.subscribe(
        "directionRun",
        (_, direction: string) => {
          clearTimeout(control.runTimeID);
          runSnake(direction, control.runTime);
        }
      );
    });

    onBeforeUnmount(() => {
      pubsub.unsubscribe(control.receiveLevelID);
      pubsub.unsubscribe(control.upIsLiveID);
      pubsub.unsubscribe(control.directionRunID);
    });

    // 返回对象
    return {
      ...toRefs(control),
    };
  },
});
</script>

<style lang="less" scoped>
#controlpanel {
  width: 240px;
  display: flex;
  justify-content: space-between;
  // 游戏选项按钮
  #optionBtn {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: space-around;
    button {
      width: 90px;
      height: 25px;
      padding: 2px;
      background: #f0f0f0;
    }
  }
  // 摇杆
  #rocker {
    width: 90px;
    text-align: center;
    display: flex;
    flex-flow: row wrap;
    & > div button {
      width: 20px;
      height: 20px;
      font-weight: bold;
      background: #f0f0f0;
    }
    #rocker_top {
      width: 90px;
    }
    #rocker_right {
      width: 45px;
    }
    #rocker_left {
      width: 45px;
    }
    #rocker_bottom {
      width: 90px;
    }
  }
}
</style>
