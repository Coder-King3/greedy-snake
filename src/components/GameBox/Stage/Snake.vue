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
  onBeforeUnmount
} from 'vue';
import pubsub, { publish } from 'pubsub-js';

export default defineComponent({
  name: 'Snake',
  setup() {
    // 数据
    let snakes = reactive<{
      snakeList:number,
      snakeBody:unknown,
      foodXY:[number,number],
      isSnakeShow:boolean,
      runSnakeID:string,
      reductionSnakeID:string,
      receiveFoodXYID: string
    }>({
      snakeList: 1,
      snakeBody: [],
      foodXY: [0,0],
      isSnakeShow: false,
      runSnakeID: '',
      reductionSnakeID: '',
      receiveFoodXYID: ''
    })
    let snakeHead = computed(()=>{
      return <HTMLElement>(<HTMLCollection>snakes.snakeBody)[0];
    })
    // 方法
    let divs = (el:HTMLElement) => {// 获取蛇dom
      // 断言为HTMLElement类型的数组并添加到snakeBody
      (<Array<HTMLElement>>snakes.snakeBody).push(el);
    };

    // 创建蛇类
    class Snake{
      // 存取器
      get x(){
        return snakeHead.value.offsetLeft
      }
      get y(){
        return snakeHead.value.offsetTop
      }
      set x(value:number) {
        // 判断是否超出范围
        if (value < 0 || value > 290) {
          pubsub.publish('upIsLive',{liveState:false,message:'GAME OVER：蛇撞墙了'});
          return;
        }
        // 判断是否水平掉头
        if (
          <HTMLElement>(<HTMLCollection>snakes.snakeBody)[1] && 
          (<HTMLElement>(<HTMLCollection>snakes.snakeBody)[1]).offsetLeft === value
        ){
          // 阻止向左右掉头
          if (value > this.x) {
            let direction:string = 'ArrowLeft';
            pubsub.publish('directionRun',direction)
            return;
          }else{
            let direction:string = 'ArrowRight';
            pubsub.publish('directionRun',direction)
            return;
          }
        }
        // 移动蛇身体
        this.snakeMoveBody();
        // 更改蛇头位置
        snakeHead.value.style.left = value+'px';
        
      }
      set y(value:number) {
        // 判断是否超出范围
        if (value < 0 || value > 290) {
          pubsub.publish('upIsLive',{liveState:false,message:'GAME OVER：蛇撞墙了'});
          return;
        }
        // 判断是否水平掉头
        if (
          <HTMLElement>(<HTMLCollection>snakes.snakeBody)[1] && 
          (<HTMLElement>(<HTMLCollection>snakes.snakeBody)[1]).offsetTop === value
        ){
          // 阻止向左右掉头
          if (value > this.y) {
            let direction:string = 'ArrowUp';
            pubsub.publish('directionRun',direction)
            return;
          }else{
            let direction:string = 'ArrowDown';
            pubsub.publish('directionRun',direction)
            return;
          }
        }
        // 移动蛇身体
        this.snakeMoveBody();
        // 更改蛇头位置
        snakeHead.value.style.top = value+'px';
      }
      // 实例方法
      addBody(){
        snakes.snakeList++;
      }
      // 蛇移动方法
      snakeMoveHead(Arro:string){
        switch (Arro) {
          case 'ArrowUp':
            this.y -=10;
            break;
          case 'ArrowDown':
            this.y +=10;
            break;
          case 'ArrowLeft':
            this.x -=10;
            break;
          case 'ArrowRight':
            this.x +=10;
            break;
        }
        // 判断是否吃到食物
        this.checkEat(snakes.foodXY[0],snakes.foodXY[1])
        // 判断是否撞到自己
        if (((<Array<HTMLElement>>snakes.snakeBody)).length>4) {
          this.snakebumpOwn(this.x,this.y)
        }
      }
      // 蛇身体移动方法
      snakeMoveBody(){
        if ((<Array<HTMLElement>>(snakes.snakeBody)).length>1) {
          // 遍历获取所有身体
          for (let i=(<Array<HTMLElement>>(snakes.snakeBody)).length-1; i>0; i--) {
            // 获取前边身体坐标
            let X:number = (<HTMLElement>(<HTMLCollection>snakes.snakeBody)[i-1]).offsetLeft;
            let Y:number = (<HTMLElement>(<HTMLCollection>snakes.snakeBody)[i-1]).offsetTop;
            // 设置为当前身体值
            (<HTMLElement>(<HTMLCollection>snakes.snakeBody)[i]).style.left = X+'px';
            (<HTMLElement>(<HTMLCollection>snakes.snakeBody)[i]).style.top = Y+'px';
          }
        }
      }
      // 检测是否撞到自己
      snakebumpOwn(x:number,y:number){
        let isBumpOwn:boolean = false;
        // 遍历获取所有身体
        for (let j = 1; j < (<Array<HTMLElement>>snakes.snakeBody).length; j++) {
          let snakeBodyX:number = (<HTMLElement>(<HTMLCollection>snakes.snakeBody)[j]).offsetLeft;
          let snakeBodyY:number = (<HTMLElement>(<HTMLCollection>snakes.snakeBody)[j]).offsetTop;
          if (x === snakeBodyX && y === snakeBodyY){
            isBumpOwn = true;
            return;
          }
        }
        // 判断是否结束游戏
        if (isBumpOwn) {
          pubsub.publish('upIsLive',{liveState:false,message:'GAME OVER：撞到自己了！'});
        }
      }
      // 检测是否吃到食物
      checkEat(x:number, y:number){
        if (this.x === x && this.y === y) {
          // 食物被吃掉重新生成
          pubsub.publish('foodxyup');
          // 分数增加
          pubsub.publish('upScore');
          // 增加一节身体
          snakes.snakeList++;
          // 清空原有节点
          snakes.snakeBody = [];
        }
      }
      // 开始结束显隐蛇信息
      reductionSnake(ifShow:boolean){
        snakes.isSnakeShow = ifShow;
        snakes.snakeList = 1;
        snakeHead.value.style.left= 140+'px';
        snakeHead.value.style.top = 130+'px';
      }
    }
    
    // 生命周期钩子
    onMounted(()=>{
      // 创建蛇实例
      const snake = new Snake()
      snakes.runSnakeID = pubsub.subscribe('runSnake',(_,Arro:string)=>{
        snake.snakeMoveHead(Arro);
      })
      snakes.reductionSnakeID = pubsub.subscribe('reductionSnake',(_,ifShow)=>{
        snake.reductionSnake(ifShow);
      })
      snakes.receiveFoodXYID = pubsub.subscribe('receiveFoodXY',(_,{x,y})=>{
        snakes.foodXY = [x,y]
      })
    })
    onBeforeUnmount(()=>{
      pubsub.unsubscribe(snakes.runSnakeID);
      pubsub.unsubscribe(snakes.reductionSnakeID);
      pubsub.unsubscribe(snakes.receiveFoodXYID);
    })

    // 返回对象
    return {
      ...toRefs(snakes),
      divs,
    }
  }
});
</script>

<style lang="less" scoped>
  // 蛇🐍样式
  #snake {
    & div:first-of-type{
      background: linear-gradient(135deg,#17ead9,#6078ea);
    }
    &>div{
      width: 10px;
      height: 10px;
      background: linear-gradient(135deg,#abdcff,#0396ff);
      border: 1px solid #ebedf3;
      border-radius:10px;
      position: absolute;
      left: 150px;
      top: -360px;
    }
  }
</style>
