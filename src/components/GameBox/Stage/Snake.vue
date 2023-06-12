<template>
  <!-- 蛇 -->
  <div id="snake" v-show="isSnakeShow">
    <div v-for="index of snakeList" :key="index" :ref="divs"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
import pubsub, { publish } from "pubsub-js";
import useSnake from "../../../hooks/useSnake";
export default defineComponent({
  name: "Snake",
  setup() {
    // Hook -> useSnake
    const { Snake, snakes, snakeHead, divs } = useSnake();

    // 生命周期钩子
    onMounted(() => {
      // 创建蛇实例
      const snake = new Snake();
      snakes.runSnakeID = pubsub.subscribe("runSnake", (_, Arro: string) => {
        snake.snakeMoveHead(Arro);
      });
      snakes.reductionSnakeID = pubsub.subscribe(
        "reductionSnake",
        (_, ifShow) => {
          snake.reductionSnake(ifShow);
        }
      );
      snakes.receiveFoodXYID = pubsub.subscribe(
        "receiveFoodXY",
        (_, { x, y }) => {
          snakes.foodXY = [x, y];
        }
      );
    });
    onBeforeUnmount(() => {
      pubsub.unsubscribe(snakes.runSnakeID);
      pubsub.unsubscribe(snakes.reductionSnakeID);
      pubsub.unsubscribe(snakes.receiveFoodXYID);
    });

    // 返回对象
    return {
      ...toRefs(snakes),
      divs,
    };
  },
});
</script>

<style lang="less" scoped>
// 蛇🐍样式
#snake {
  & div:first-of-type {
    background: linear-gradient(135deg, #17ead9, #6078ea);
  }
  & > div {
    width: 10px;
    height: 10px;
    background: linear-gradient(135deg, #abdcff, #0396ff);
    border: 1px solid #ebedf3;
    border-radius: 10px;
    position: absolute;
    left: 150px;
    top: -360px;
  }
}
</style>
