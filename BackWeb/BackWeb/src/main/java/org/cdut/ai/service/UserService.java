// src/main/java/org/cdut/ai/service/UserService.java
package org.cdut.ai.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.cdut.ai.model.User;

public interface UserService extends IService<User> {
    boolean register(User user);
    User login(String username, String password);
    boolean updatePassword(String username, String oldPassword, String newPassword);
    boolean updateEmail(String username, String newEmail);
    boolean resetPassword(String email, String newPassword);
    boolean forgotPassword(String username, String newPassword);

    // 可以选择保留这些方法，但通常放在 mapper 中
    User findByUsername(String username);
    User findByEmail(String email);
}
