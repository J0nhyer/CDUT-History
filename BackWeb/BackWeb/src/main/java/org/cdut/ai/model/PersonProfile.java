package org.cdut.ai.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("person_profile")
public class PersonProfile {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("person_id")
    private String personId;

    @TableField("profile_json")
    private String profileJson;

    @TableField("updated_at")
    private LocalDateTime updatedAt;
}


