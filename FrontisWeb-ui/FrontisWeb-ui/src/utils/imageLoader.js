// 图片加载器 - 使用Vite的import.meta.glob预加载所有人物图片和事件图片
import unknownImageSrc from '@/assets/persons/unknown.png'

// 预加载所有persons目录下的图片 (Vite方式)
const personsImages = import.meta.glob('@/assets/persons/*.{png,jpg,jpeg,gif,svg,webp}', { eager: true });

// 预加载所有events目录下的图片（支持jpg和jpeg）
const eventsImages = import.meta.glob('@/assets/events/*.{png,jpg,jpeg,gif,svg,webp}', { eager: true });

// 创建图片映射表
const imageMap = {};
Object.entries(personsImages).forEach(([path, module]) => {
  // path格式: "/src/assets/persons/liubaojun.png"
  const fileName = path.split('/').pop();
  imageMap[fileName] = module.default;
  console.log(`[imageLoader] 加载人物图片: ${fileName} ->`, imageMap[fileName]);
});

// 创建事件图片映射表
const eventImageMap = {};
Object.entries(eventsImages).forEach(([path, module]) => {
  const fileName = path.split('/').pop();
  eventImageMap[fileName] = module.default;
  console.log(`[imageLoader] 加载事件图片: ${fileName} ->`, eventImageMap[fileName]);
});

// 设置默认图片
const unknownImage = imageMap['unknown.png'] || unknownImageSrc;
console.log('[imageLoader] 默认图片设置完成:', unknownImage);

/**
 * 获取人物图片
 * @param {string} path - 图片路径，支持以下格式：
 *   - "persons/liubaojun.png"
 *   - "liubaojun.png"
 *   - "@/assets/persons/liubaojun.png"
 * @returns {any} webpack打包后的图片资源
 */
export function getPersonImage(path) {
  console.log('[getPersonImage] 输入路径:', path);
  
  if (!path) {
    console.log('[getPersonImage] 路径为空，返回unknown');
    return unknownImage;
  }
  
  // 如果已经是完整的webpack资源，直接返回
  if (typeof path === 'object') {
    console.log('[getPersonImage] 已是webpack资源，直接返回');
    return path;
  }
  
  // 如果是HTTP URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    console.log('[getPersonImage] HTTP URL，直接返回');
    return path;
  }
  
  // 提取文件名
  let fileName = path;
  if (path.startsWith('persons/')) {
    fileName = path.substring('persons/'.length);
  } else if (path.startsWith('@/assets/persons/')) {
    fileName = path.substring('@/assets/persons/'.length);
  } else if (path.startsWith('/assets/persons/')) {
    fileName = path.substring('/assets/persons/'.length);
  }
  
  console.log('[getPersonImage] 提取文件名:', fileName);
  
  // 从映射表中获取图片
  if (imageMap[fileName]) {
    console.log('[getPersonImage] 找到图片:', fileName);
    return imageMap[fileName];
  }
  
  // 如果找不到，返回unknown
  console.warn('[getPersonImage] 找不到图片:', fileName, '返回unknown');
  return unknownImage;
}

/**
 * 获取默认图片（unknown.png）
 */
export function getUnknownImage() {
  return unknownImage;
}

/**
 * 获取所有可用的图片列表
 */
export function getAllPersonImages() {
  return Object.keys(imageMap);
}

/**
 * 获取事件图片
 * @param {string} path - 图片路径，支持以下格式：
 *   - "events/event-1956.png"
 *   - "event-1956.png"
 *   - "@/assets/events/event-1956.png"
 * @returns {any} Vite打包后的图片资源
 */
export function getEventImage(path) {
  console.log('[getEventImage] 输入路径:', path);
  
  if (!path) {
    console.log('[getEventImage] 路径为空，返回unknown');
    return unknownImage;
  }
  
  // 如果已经是完整的资源，直接返回
  if (typeof path === 'object') {
    console.log('[getEventImage] 已是资源，直接返回');
    return path;
  }
  
  // 如果是HTTP URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    console.log('[getEventImage] HTTP URL，直接返回');
    return path;
  }
  
  // 提取文件名
  let fileName = path;
  if (path.startsWith('events/')) {
    fileName = path.substring('events/'.length);
  } else if (path.startsWith('@/assets/events/')) {
    fileName = path.substring('@/assets/events/'.length);
  } else if (path.startsWith('/assets/events/')) {
    fileName = path.substring('/assets/events/'.length);
  }
  
  console.log('[getEventImage] 提取文件名:', fileName);
  
  // 从映射表中获取图片
  if (eventImageMap[fileName]) {
    console.log('[getEventImage] 找到图片:', fileName);
    return eventImageMap[fileName];
  }
  
  // 如果找不到，返回unknown
  console.warn('[getEventImage] 找不到图片:', fileName, '返回unknown');
  return unknownImage;
}

console.log('[imageLoader] 已加载的人物图片:', Object.keys(imageMap));
console.log('[imageLoader] 已加载的事件图片:', Object.keys(eventImageMap));
