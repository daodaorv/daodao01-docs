<template>
  <view class="content">
    <!-- uni-ui 卡片组件 -->
    <uni-card title="叨叨房车租赁" sub-title="专业的房车租赁服务平台" :is-shadow="true" thumbnail="/static/logo.png">
      <text class="uni-body">欢迎使用叨叨房车租赁平台！</text>
    </uni-card>

    <!-- uni-ui 按钮组件 -->
    <view class="button-group">
      <uni-button type="primary" size="default">立即租车</uni-button>
      <uni-button type="success" size="default" plain>查看订单</uni-button>
    </view>

    <!-- uni-ui 徽章组件 -->
    <view class="badge-demo">
      <uni-badge text="hot" type="error" size="small">
        <text>热门推荐</text>
      </uni-badge>
    </view>

    <!-- uni-ui 列表组件 -->
    <uni-list>
      <uni-list-item title="经济型房车" note="￥299/天起" rightText="可租"></uni-list-item>
      <uni-list-item title="豪华型房车" note="￥599/天起" rightText="可租"></uni-list-item>
      <uni-list-item title="家庭型房车" note="￥499/天起" rightText="可租"></uni-list-item>
    </uni-list>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('叨叨房车租赁')
</script>

<style>
.content {
  padding: 20rpx;
}

.button-group {
  margin: 30rpx 0;
  display: flex;
  gap: 20rpx;
}

.badge-demo {
  margin: 30rpx 0;
  text-align: center;
}

.uni-body {
  font-size: 28rpx;
  color: #333;
}
</style>
