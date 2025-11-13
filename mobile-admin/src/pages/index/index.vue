<template>
  <view class="content">
    <!-- uni-ui 卡片组件 -->
    <uni-card title="叨叨房车管理" sub-title="移动管理端" :is-shadow="true" thumbnail="/static/logo.png">
      <text class="uni-body">欢迎使用叨叨房车管理平台！</text>
    </uni-card>

    <!-- uni-ui 按钮组件 -->
    <view class="button-group">
      <uni-button type="primary" size="default">车辆管理</uni-button>
      <uni-button type="warning" size="default" plain>订单管理</uni-button>
    </view>

    <!-- uni-ui 徽章组件 -->
    <view class="badge-demo">
      <uni-badge text="admin" type="primary" size="small">
        <text>管理员模式</text>
      </uni-badge>
    </view>

    <!-- uni-ui 列表组件 -->
    <uni-list>
      <uni-list-item title="车辆列表" note="管理所有房车信息" rightText="12辆"></uni-list-item>
      <uni-list-item title="订单管理" note="处理租赁订单" rightText="8个待处理"></uni-list-item>
      <uni-list-item title="用户管理" note="管理平台用户" rightText="156位用户"></uni-list-item>
    </uni-list>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('叨叨房车管理')
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
