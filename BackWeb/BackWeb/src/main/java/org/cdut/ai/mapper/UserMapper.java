package org.cdut.ai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.cdut.ai.model.User;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    // 移除了 findByUsername 和 findByEmail 的定义，因为它们已在 XML 中定义
}