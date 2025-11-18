package org.cdut.ai;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * BCrypt 加密测试类
 * 用于演示为什么不同密码的加密值看起来相似
 */
public class BCryptTest {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        System.out.println("=== BCrypt 加密测试 ===\n");
        
        // 测试密码 123456
        String password1 = "123456";
        String hash1_1 = encoder.encode(password1);
        String hash1_2 = encoder.encode(password1);
        String hash1_3 = encoder.encode(password1);
        
        System.out.println("密码: " + password1);
        System.out.println("第1次加密: " + hash1_1);
        System.out.println("第2次加密: " + hash1_2);
        System.out.println("第3次加密: " + hash1_3);
        System.out.println("相同密码，每次加密结果都不同！\n");
        
        // 测试密码 654321
        String password2 = "654321";
        String hash2_1 = encoder.encode(password2);
        String hash2_2 = encoder.encode(password2);
        String hash2_3 = encoder.encode(password2);
        
        System.out.println("密码: " + password2);
        System.out.println("第1次加密: " + hash2_1);
        System.out.println("第2次加密: " + hash2_2);
        System.out.println("第3次加密: " + hash2_3);
        System.out.println("相同密码，每次加密结果都不同！\n");
        
        // 分析哈希值结构
        System.out.println("=== BCrypt 哈希值结构分析 ===\n");
        System.out.println("格式: $2a$10$盐值(22字符)哈希值(31字符)");
        System.out.println("总长度: 60字符\n");
        
        System.out.println("示例哈希值: " + hash1_1);
        System.out.println("前7字符(算法标识): " + hash1_1.substring(0, 7));
        System.out.println("盐值部分(前29字符): " + hash1_1.substring(0, 29));
        System.out.println("哈希值部分(后31字符): " + hash1_1.substring(29));
        System.out.println();
        
        System.out.println("示例哈希值: " + hash2_1);
        System.out.println("前7字符(算法标识): " + hash2_1.substring(0, 7));
        System.out.println("盐值部分(前29字符): " + hash2_1.substring(0, 29));
        System.out.println("哈希值部分(后31字符): " + hash2_1.substring(29));
        System.out.println();
        
        // 验证密码
        System.out.println("=== 密码验证测试 ===\n");
        System.out.println("验证 123456 与 hash1_1: " + encoder.matches("123456", hash1_1));
        System.out.println("验证 123456 与 hash1_2: " + encoder.matches("123456", hash1_2));
        System.out.println("验证 654321 与 hash2_1: " + encoder.matches("654321", hash2_1));
        System.out.println("验证 123456 与 hash2_1: " + encoder.matches("123456", hash2_1)); // 应该为false
        System.out.println("验证 654321 与 hash1_1: " + encoder.matches("654321", hash1_1)); // 应该为false
    }
}

