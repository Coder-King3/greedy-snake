<template>
  <!-- 食物 -->
  <div id="food" v-show="isFoodShow" ref="foodElement">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  onBeforeUnmount,
} from "vue";
import pubsub from "pubsub-js";
import useFood from "../../../hooks/useFood";
// import {} from 'vue'
export default defineComponent({
  name: "Food",
  setup() {
    // Hook -> useFood
    const { Food, foods, foodElement, isFoodShow } = useFood();

    // 生命周期钩子
    onMounted(() => {
      // 创建food实例
      const food = new Food();
      // 更改食物坐标
      foods.foodxyupID = pubsub.subscribe("foodxyup", () => {
        food.changeXY();
      });
      foods.reductionFoodID = pubsub.subscribe("reductionFood", (_, isLive) => {
        food.reductionFood(isLive);
      });
    });
    onBeforeUnmount(() => {
      pubsub.unsubscribe(foods.foodxyupID);
      pubsub.unsubscribe(foods.reductionFoodID);
    });

    // 返回对象
    return {
      isFoodShow,
      foodElement,
    };
  },
});
</script>

<style lang="less" scoped>
// 食物
#food {
  width: 10px;
  height: 10px;
  position: absolute;
  left: 150px;
  top: 150px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-content: space-between;
  & > div {
    width: 5px;
    height: 5px;
    transform: rotate(45deg);
  }
  & > div:nth-of-type(1) {
    background: #e84393;
  }
  & > div:nth-of-type(2) {
    background: #2ecc71;
  }
  & > div:nth-of-type(3) {
    background: #22a6b3;
  }
  & > div:nth-of-type(4) {
    background: #ffc312;
  }
}
</style>
