<template>
  <!-- 计分板 -->
  <div id="score-panel">
    <div>SCORE:{{score}}</div>
    <div>LEVEL:{{level}}</div>
  </div>
</template>

<script lang="ts">
  import { 
    defineComponent,
    reactive,
    toRefs,
    onMounted,
    onBeforeUnmount 
  } from 'vue';
  import pubsub from 'pubsub-js';
  export default defineComponent({
    name: 'ScoreBoard',
    setup() {
      // 数据
      let scoring = reactive({
        score: 0,
        level: 0,
        rankScore: 3,
        maxLevel: 10,
        noticeTime:'',
        upScoreID: '',
        upLevelID: '',
        emptyScoreLevelID: ''
      })

      // 定义计分板类
      class ScorePanel{
        // 加分方法
        addScore(){
          scoring.score++;// 分数自增
          // 判断是否升级
          if (scoring.score % scoring.rankScore === 0) {
            this.upLevel()
          }
        }
        // 升级方法
        upLevel(){
          // 判断等级上限
          if (scoring.level < scoring.maxLevel) {
            scoring.level++;// 等级自增
          }
          pubsub.publish('receiveLevel',scoring.level);// 发送level
        }
      }

      // 生命周期钩子
      onMounted(()=>{
        // 创建计分板实例
        const sp = new ScorePanel();
        // 绑定事件
        scoring.upScoreID = pubsub.subscribe('upScore',()=>{
          sp.addScore();
        })
        scoring.upLevelID = pubsub.subscribe('upLevel',()=>{
          sp.upLevel();
        })
        scoring.emptyScoreLevelID = pubsub.subscribe('emptyScoreLevel',()=>{
          scoring.score = 0;
          scoring.level = 0;
        })
      })
      onBeforeUnmount(()=>{
        pubsub.unsubscribe(scoring.upScoreID);
        pubsub.unsubscribe(scoring.upLevelID);
        pubsub.unsubscribe(scoring.emptyScoreLevelID);
      })

      // 返回对象
      return {
        ...toRefs(scoring)
      }
    },
  });
</script>

<style lang="less" scoped>
  // 计分板
  #score-panel{
    width: 300px;
    display: flex;
    justify-content:space-between;
  }
</style>
