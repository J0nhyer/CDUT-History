package org.cdut.ai.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("data_import_log")
public class DataImportLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String importType;   // 导入类型
    private String sourceFile;   // 源文件路径
    private Integer totalCount;  // 总记录数
    private Integer successCount; // 成功记录数
    private Integer failCount;    // 失败记录数
    private String status;       // 状态
    private String errorMessage; // 错误信息
    private LocalDateTime importedAt; // 导入时间
    private LocalDateTime completedAt; // 完成时间
}

