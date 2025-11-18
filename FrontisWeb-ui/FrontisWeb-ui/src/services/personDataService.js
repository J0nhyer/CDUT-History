import { fetchPersonAdvancedMap, fetchPersonAdvancedById, fetchPersonList } from '@/api/person';

let profileCachePromise = null;
let profileMapCache = null;

function resolveAssetPath(path) {
  console.log('[resolveAssetPath] 输入路径:', path);
  
  if (!path) {
    console.log('[resolveAssetPath] 路径为空');
    return null;
  }
  
  // 如果已经是完整URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    console.log('[resolveAssetPath] HTTP URL，直接返回');
    return path;
  }
  
  // 处理 persons/ 开头的路径（新格式）- 保持为相对路径字符串，让组件的computed处理
  if (path.startsWith('persons/')) {
    console.log('[resolveAssetPath] persons/路径，保持原样返回（让组件处理require）');
    return path;  // 返回字符串，让displayImage计算属性处理require
  }
  
  // 处理相对路径
  if (path.startsWith('/assets/')) {
    console.log('[resolveAssetPath] /assets/路径，直接返回');
    return path;
  }
  
  // 处理@/assets路径
  if (path.startsWith('@/assets/')) {
    const converted = path.replace('@/assets/', '/assets/');
    console.log('[resolveAssetPath] @/assets/路径，转换为:', converted);
    return converted;
  }
  
  // 其他情况返回原路径
  console.log('[resolveAssetPath] 其他情况，返回原路径');
  return path;
}

function normalizeProfile(profile) {
  if (!profile || typeof profile !== 'object') return {};
  const cloned = JSON.parse(JSON.stringify(profile));

  // 处理图片路径
  if (cloned.image) {
    cloned.image = resolveAssetPath(cloned.image);
  }

  // 处理keyTags
  if (Array.isArray(cloned.keyTags)) {
    cloned.keyTags = cloned.keyTags.filter(Boolean);
  } else if (cloned.keyTagsList) {
    cloned.keyTags = cloned.keyTagsList.filter(Boolean);
  }

  // 处理biography
  if (Array.isArray(cloned.biography)) {
    cloned.biography = cloned.biography.map(section => {
      const mapped = { ...section };
      if (mapped.mediaUrl) {
        mapped.mediaUrl = resolveAssetPath(mapped.mediaUrl);
      }
      // 处理tags
      if (mapped.tagsList && !mapped.tags) {
        mapped.tags = mapped.tagsList;
      }
      return mapped;
    });
  }

  // 处理relationships
  if (Array.isArray(cloned.relationships)) {
    cloned.relationships = cloned.relationships.map(rel => ({ ...rel }));
  }

  // 确保有默认值（即使后端没有这些字段）
  if (!cloned.timeline) cloned.timeline = [];
  if (!cloned.achievements) cloned.achievements = [];
  if (!cloned.videos) cloned.videos = [];
  if (!cloned.audios) cloned.audios = [];
  if (!cloned.vrScenes) cloned.vrScenes = [];
  if (!cloned.anecdotes) cloned.anecdotes = [];

  return cloned;
}

async function loadProfileMap() {
  if (profileMapCache) {
    console.log('[loadProfileMap] ✅ 使用缓存数据，数量:', Object.keys(profileMapCache).length);
    return profileMapCache;
  }
  if (!profileCachePromise) {
    console.log('[loadProfileMap] 🔄 开始从API加载数据...');
    console.log('[loadProfileMap] 📡 请求URL: /api/person/advanced');
    
    profileCachePromise = fetchPersonAdvancedMap()
      .then(res => {
        console.log('[loadProfileMap] ✅ API响应成功:', res);
        // axios拦截器已经返回了response.data，所以res就是后端返回的数据结构
        if (res && res.success) {
          const data = res.data || {};
          console.log('[loadProfileMap] 📦 原始数据对象:', data);
          console.log('[loadProfileMap] 📊 数据条数:', Object.keys(data).length);
          
          if (Object.keys(data).length === 0) {
            console.warn('[loadProfileMap] ⚠️ 警告：后端返回的数据为空对象！');
            console.warn('[loadProfileMap] ⚠️ 可能原因：数据库中没有人物的PersonProfile数据');
          }
          
          const normalized = {};
          Object.entries(data).forEach(([id, profile]) => {
            normalized[id] = normalizeProfile(profile);
          });
          console.log('[loadProfileMap] ✅ 标准化后的数据，数量:', Object.keys(normalized).length);
          profileMapCache = normalized;
          return normalized;
        }
        console.error('[loadProfileMap] ❌ API返回失败:', res);
        console.error('[loadProfileMap] ❌ 响应结构:', {
          success: res?.success,
          message: res?.message,
          data: res?.data
        });
        throw new Error(res?.message || '加载人物数据失败');
      })
      .catch(async error => {
        console.error('[loadProfileMap] ❌ 加载人物数据失败:', error);
        console.error('[loadProfileMap] ❌ 错误类型:', error.constructor.name);
        console.error('[loadProfileMap] ❌ 错误消息:', error.message);
        console.error('[loadProfileMap] ❌ 错误代码:', error.code);
        
        if (error.response) {
          // 服务器返回了错误响应
          console.error('[loadProfileMap] ❌ HTTP状态码:', error.response.status);
          console.error('[loadProfileMap] ❌ 响应数据:', error.response.data);
        } else if (error.request) {
          // 请求已发出但没有收到响应
          console.error('[loadProfileMap] ❌ 请求已发出但无响应，可能原因：');
          console.error('[loadProfileMap]    1. 后端服务未启动（检查 http://localhost:8080）');
          console.error('[loadProfileMap]    2. Vite代理配置错误');
          console.error('[loadProfileMap]    3. 网络连接问题');
        } else {
          // 其他错误
          console.error('[loadProfileMap] ❌ 其他错误:', error);
        }
        
        // 数据库连接失败，返回空对象
        console.error('[loadProfileMap] ❌ 无法加载数据，请检查数据库连接');
        return {};
      })
      .finally(() => {
        profileCachePromise = null;
      });
  }
  return profileCachePromise;
}

export async function getAllPersonProfiles() {
  return await loadProfileMap();
}

export async function getPersonProfileById(personId) {
  const map = await loadProfileMap();
  if (map[personId]) {
    return map[personId];
  }
  const response = await fetchPersonAdvancedById(personId);
  // axios拦截器已经返回了response.data
  if (response && response.success) {
    const profile = normalizeProfile(response.data);
    if (profileMapCache) {
      profileMapCache[personId] = profile;
    }
    return profile;
  }
  return null;
}

// 获取所有人物列表（用于PersonsPage）
export async function getAllPersons() {
  try {
    const response = await fetchPersonList();
    // axios拦截器已经返回了response.data
    if (response && response.success) {
      return response.data || [];
    }
    return [];
  } catch (error) {
    console.error('获取人物列表失败:', error);
    return [];
  }
}

// 获取人物详情（用于详情页）
export async function getPersonDetail(personId) {
  try {
    console.log(`[personDataService] 开始获取人物详情: ${personId}`);
    const response = await fetchPersonAdvancedById(personId);
    console.log(`[personDataService] API响应:`, response);
    
    // axios拦截器已经返回了response.data
    if (response && response.success) {
      const normalized = normalizeProfile(response.data);
      console.log(`[personDataService] 标准化后的数据:`, normalized);
      return normalized;
    } else {
      console.warn(`[personDataService] API返回失败:`, response);
      return null;
    }
  } catch (error) {
    console.error(`[personDataService] 获取人物详情失败 (${personId}):`, error);
    console.error(`[personDataService] 错误详情:`, error.response || error.message);
    return null;
  }
}


