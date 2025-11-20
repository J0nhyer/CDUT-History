<template>
  <!-- 作为首页第 N 屏的内容块使用，外层由 MainPage 的 page-section 包裹 -->
  <div class="rename1993-section">
    <div class="text-block">
      <div class="label-row">
        <div class="label-line"></div>
        <div class="label-text">
          <div class="label-top">1993 · 学校更名庆祝大会</div>
          <div class="label-sub">校名焕新 · 发展迈入新阶段</div>
        </div>
      </div>
      <p class="description">
        1993 年，学校举行更名庆祝大会，标志着办学定位与发展阶段的又一次重要跃迁。
        在服务国家能源资源与地质事业的基础上，学校不断拓展学科布局与人才培养方向，
        “成理人”的视野与舞台从此更加开阔。更名不仅是名称的变化，更是办学格局、
        学科体系与社会影响力全面升级的新起点。
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeRename1993'
}
</script>

<style scoped>
/* 整个 1993 更名事件前景容器，撑满父级 .page-section */
.rename1993-section {
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

/* 文本块：右上偏中，和 2、3、4 屏的左下/右下布局错开 */
.text-block {
  position: absolute;
  right: 8%;
  top: 20%;
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
  .rename1993-section {
    padding: 40px 20px;
  }

  .text-block {
    right: 6%;
    left: 6%;
    top: 18%;
    max-width: none;
  }

  .description {
    font-size: 0.94rem;
  }
}
</style>