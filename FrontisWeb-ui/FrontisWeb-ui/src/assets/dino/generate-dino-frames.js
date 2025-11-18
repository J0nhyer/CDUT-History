// 恐龙行走帧生成器
// 在浏览器中运行此代码来生成恐龙行走的帧动画

function generateDinoWalkFrames() {
    // 创建一个包含多帧的简单恐龙行走动画
    const frames = 8; // 8帧动画
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    const dinoFrames = [];
    
    for (let frame = 0; frame < frames; frame++) {
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制背景（可选）
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 计算每一帧的腿部和尾巴角度
        const legAngle1 = Math.sin((frame / frames) * Math.PI * 2) * 25;
        const legAngle2 = Math.sin((frame / frames) * Math.PI * 2 + Math.PI) * 25;
        const tailAngle = Math.sin((frame / frames) * Math.PI * 2) * 15;
        
        // 保存当前状态
        ctx.save();
        
        // 绘制恐龙身体
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(45, 50, 30, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制恐龙头
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.arc(25, 45, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制眼睛
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(20, 43, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制嘴巴
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(22, 47, 5, 0.3, Math.PI);
        ctx.stroke();
        
        // 绘制腿1
        ctx.save();
        ctx.translate(35, 70);
        ctx.rotate(legAngle1 * Math.PI / 180);
        ctx.fillStyle = '#654321';
        ctx.fillRect(-8, 0, 16, 15);
        // 脚
        ctx.fillRect(-5, 15, 10, 8);
        ctx.restore();
        
        // 绘制腿2
        ctx.save();
        ctx.translate(55, 70);
        ctx.rotate(legAngle2 * Math.PI / 180);
        ctx.fillStyle = '#654321';
        ctx.fillRect(-8, 0, 16, 15);
        // 脚
        ctx.fillRect(-5, 15, 10, 8);
        ctx.restore();
        
        // 绘制尾巴
        ctx.save();
        ctx.translate(75, 45);
        ctx.rotate(tailAngle * Math.PI / 180);
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.ellipse(0, 0, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // 恢复到之前的状态
        ctx.restore();
        
        // 将当前帧转换为图片数据
        const imageData = canvas.toDataURL('image/png');
        dinoFrames.push({
            frame: frame,
            data: imageData,
            filename: `dino-walk-${frame + 1}.png`
        });
    }
    
    return dinoFrames;
}

// 使用示例
console.log('恐龙行走动画生成器已加载');
console.log('调用 generateDinoWalkFrames() 函数生成动画帧');

// 导出功能
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateDinoWalkFrames };
}

