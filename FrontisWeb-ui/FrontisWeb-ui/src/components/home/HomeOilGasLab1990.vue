<template>
  <!-- 作为主页第 4 屏的内容块使用，外层由 MainPage 的 page-section 包裹 -->
  <div class="lab1990-section">
    <div class="text-block">
      <div class="label-row">
        <div class="label-line"></div>
        <div class="label-text">
          <div class="label-top">1990 · 油气藏重点实验室获批建设</div>
          <div class="label-sub">从教学型学院迈向科研高地</div>
        </div>
      </div>
      <p class="description">
        1990 年，成都理工大学油气藏重点实验室获批建设，标志着学校在能源资源领域
        的科研平台迈入新的阶段。围绕油气成藏机理、储层预测与开发等关键科学问题，
        实验室持续承担国家和省部级重大科研任务，为我国油气勘探与开发提供了重要的
        理论支撑与技术储备，也推动学校整体学科实力不断跃升。
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeOilGasLab1990'
}
</script>

<style scoped>
/* 整个第 4 页前景容器，撑满父级的 .page-section */
.lab1990-section {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 40px 64px;
  box-sizing: border-box;
  color: #ffffff;
}

/* 文本块，左下角对齐，和你前两页风格一致 */
.text-block {
  position: absolute;
  left: 8%;
  bottom: 14%;
  max-width: 520px;
}

/* 标题行 */
.label-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.label-line {
  width: 2px;
  height: 40px;
  border-radius: 999px;
  background: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.2));
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.85);
}

.label-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.label-top {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.95;
}

.label-sub {
  font-size: 13px;
  opacity: 0.9;
}

/* 正文描述 */
.description {
  margin: 8px 0 0 0;
  font-size: 0.98rem;
  line-height: 1.9;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .lab1990-section {
    padding: 40px 20px;
  }

  .text-block {
    left: 6%;
    right: 6%;
    bottom: 10%;
    max-width: none;
  }

  .description {
    font-size: 0.94rem;
  }
}
</style>