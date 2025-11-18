package org.cdut.ai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.cdut.ai.model.DataImportLog;

import java.util.List;

@Mapper
public interface DataImportLogMapper extends BaseMapper<DataImportLog> {
    /**
     * 根据导入类型查询
     */
    List<DataImportLog> findByImportType(@Param("importType") String importType);
    
    /**
     * 根据状态查询
     */
    List<DataImportLog> findByStatus(@Param("status") String status);
    
    /**
     * 查询最近的导入记录
     */
    List<DataImportLog> findRecentLogs(@Param("limit") Integer limit);
}

