import { reactive } from "vue";
import pubsub from "pubsub-js";

function useControlPanel() {
  // 创建控制面板类
  class ControlPanel {
    // 构造函数
    constructor() {
      this.init();
    }
    // 初始化函数
    init() {
      // 全局监听键盘方向键
      this.runDirectionKey();
    }
    // 监听方向事件
    runDirectionKey() {
      document.onkeydown = (e) => {
        control.direction = e.key;
        switch (control.direction) {
          case "ArrowUp":
          case "ArrowDown":
          case "ArrowLeft":
          case "ArrowRight":
            runSnake(control.direction, control.runTime);
            break;
        }
      };
    }
  }
  let control = reactive({
    // 数据
    direction: "",
    runTimeID: 0,
    initial: 300,
    runTime: 300,
    isLive: false,
    message: "",
    receiveLevelID: "",
    upIsLiveID: "",
    directionRunID: "",
    // 方法
    runUp() {
      runSnake("ArrowUp", control.runTime);
    },
    runDown() {
      runSnake("ArrowDown", control.runTime);
    },
    runLeft() {
      runSnake("ArrowLeft", control.runTime);
    },
    runRight() {
      runSnake("ArrowRight", control.runTime);
    },
    playGame() {
      pubsub.publish("upIsLive", { liveState: true, message: "" });
    },
    endGame() {
      pubsub.publish("upIsLive", { liveState: false, message: "" });
    },
  });
  let runSnake = function (direction: string, runTime: number) {
    // 关闭定时器(防抖)
    clearTimeout(control.runTimeID);
    // control.isLive为true时游戏未结束继续跑
    if (control.isLive) {
      control.runTimeID = setTimeout(() => {
        // 更改蛇坐标
        pubsub.publish("runSnake", direction);
        // 递归调用
        runSnake(direction, runTime);
      }, runTime);
    }
  };
  let gameTips = function (istips: boolean, tips: string) {
    if (istips === false && tips != "") {
      alert(tips);
    }
  };

  return { ControlPanel, control, runSnake, gameTips };
}

export default useControlPanel;
