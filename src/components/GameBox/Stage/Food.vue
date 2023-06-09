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
  onBeforeUnmount
} from 'vue';
import pubsub from 'pubsub-js';
export default defineComponent({
  name: 'Food',
  setup() {
    // 数据
    let foods = reactive({
      cordX: 30,
      cordY: 30,
      latticeNum: 29,
      minLattice: 10,
      foodxyupID: '',
      reductionFoodID: ''
    })
    let foodElement = ref<unknown>(null);
    let isFoodShow =  ref<boolean>(false);
    
    // 定义食物类
    class Food{
      // 属性
      element:HTMLElement;// foodDOM
      // 构造函数
      constructor(){
        // 获取页面foodDOM元素
        this.element = <HTMLElement>foodElement.value;
      }
      // 存取器
      get x(){
        return this.element.offsetLeft
      }
      get y(){
        return this.element.offsetTop
      }
      // 随机食物坐标
      changeXY(){
        foods.cordX = Math.round(Math.random() * foods.latticeNum) * foods.minLattice;
        foods.cordY = Math.round(Math.random() * foods.latticeNum) * foods.minLattice;
        this.element.style.left = foods.cordX+'px';
        this.element.style.top = foods.cordY+'px';
        pubsub.publish('receiveFoodXY',{x:foods.cordX,y:foods.cordY})
      }
      // 开始结束显隐食物信息
      reductionFood(isLive:boolean){
        if (isLive) {
          // 开局随机食物坐标
          this.changeXY();
          // 显示
          isFoodShow.value = true;
        }else{
          // 隐藏
          isFoodShow.value = false;
        }
      }
    }

    // 生命周期钩子
    onMounted(()=>{
      // 创建food实例
      const food = new Food();
      // 更改食物坐标
      foods.foodxyupID = pubsub.subscribe('foodxyup',()=>{
        food.changeXY();
      });
      foods.reductionFoodID = pubsub.subscribe('reductionFood',(_,isLive)=>{
        food.reductionFood(isLive);
      })
    })
    onBeforeUnmount(()=>{
      pubsub.unsubscribe(foods.foodxyupID);
      pubsub.unsubscribe(foods.reductionFoodID);
    })

    // 返回对象
    return {
      isFoodShow,
      foodElement
    }
    
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
    justify-content:space-between;
    align-content: space-between;
    &>div {
      width: 5px;
      height: 5px;
      transform: rotate(45deg);
    }
    &>div:nth-of-type(1) {
      background: #e84393;
    }
    &>div:nth-of-type(2) {
      background: #2ecc71;
    }
    &>div:nth-of-type(3) {
      background: #22a6b3;
    }
    &>div:nth-of-type(4) {
      background: #ffc312;
    }
  }
</style>
