import { reactive, ref } from "vue";
import pubsub from "pubsub-js";

function useFood() {
  // 定义食物类
  class Food {
    // 属性
    element: HTMLElement; // foodDOM
    // 构造函数
    constructor() {
      // 获取页面foodDOM元素
      this.element = <HTMLElement>foodElement.value;
    }
    // 存取器
    get x() {
      return this.element.offsetLeft;
    }
    get y() {
      return this.element.offsetTop;
    }
    // 随机食物坐标
    changeXY() {
      foods.cordX =
        Math.round(Math.random() * foods.latticeNum) * foods.minLattice;
      foods.cordY =
        Math.round(Math.random() * foods.latticeNum) * foods.minLattice;
      this.element.style.left = foods.cordX + "px";
      this.element.style.top = foods.cordY + "px";
      pubsub.publish("receiveFoodXY", { x: foods.cordX, y: foods.cordY });
    }
    // 开始结束显隐食物信息
    reductionFood(isLive: boolean) {
      if (isLive) {
        // 开局随机食物坐标
        this.changeXY();
        // 显示
        isFoodShow.value = true;
      } else {
        // 隐藏
        isFoodShow.value = false;
      }
    }
  }

  // 数据
  let foods = reactive({
    cordX: 30,
    cordY: 30,
    latticeNum: 29,
    minLattice: 10,
    foodxyupID: "",
    reductionFoodID: "",
  });
  let foodElement = ref<unknown>(null);
  let isFoodShow = ref<boolean>(false);

  return { Food, foods, foodElement, isFoodShow };
}

export default useFood;
