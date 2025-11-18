package org.cdut.ai.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.cdut.ai.mapper.UserMapper;
import org.cdut.ai.model.User;
import org.cdut.ai.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    @Transactional
    public boolean register(User user) {
        if (user == null || user.getUsername() == null || user.getPassword() == null || user.getEmail() == null)
            return false;

        // 1. 检查密码长度（至少6位）
        if (user.getPassword().length() < 6) {
            return false;
        }

        // 2. 检查用户名或邮箱是否重复
        if (lambdaQuery().eq(User::getUsername, user.getUsername()).exists()) return false;
//        if (lambdaQuery().eq(User::getEmail, user.getEmail()).exists()) return false;

        // 3. 清空ID，确保是INSERT自增，而不是update
        user.setId(null);

        // 4. 加密保存密码
        user.setPassword(encoder.encode(user.getPassword()));

        // 5. 执行插入
        return save(user);
    }

    @Override
    public User login(String username, String rawPassword) {
        User db = findByUsername(username);
        if (db != null && encoder.matches(rawPassword, db.getPassword())) {
            return db;
        }
        return null;
    }

    @Override
    public boolean updatePassword(String username, String oldPassword, String newPassword) {
        User db = findByUsername(username);
        if (db == null) return false;
        if (!encoder.matches(oldPassword, db.getPassword())) return false;
        // 检查新密码长度（至少6位）
        if (newPassword == null || newPassword.length() < 6) {
            return false;
        }
        db.setPassword(encoder.encode(newPassword));
        return updateById(db);
    }

    @Override
    @Transactional
    public boolean updateEmail(String username, String newEmail) {
        User db = findByUsername(username);
        if (db == null) return false;
        // 检查新邮箱是否已被其他用户使用
        User existingUser = findByEmail(newEmail);
        if (existingUser != null && !existingUser.getUsername().equals(username)) {
            return false; // 邮箱已被其他用户使用
        }
        db.setEmail(newEmail);
        return updateById(db);
    }

    @Override
    public boolean resetPassword(String email, String newPassword) {
        User db = findByEmail(email);
        if (db == null) return false;
        // 检查新密码长度（至少6位）
        if (newPassword == null || newPassword.length() < 6) {
            return false;
        }
        db.setPassword(encoder.encode(newPassword));
        return updateById(db);
    }

    @Override
    public boolean forgotPassword(String username, String newPassword) {
        User db = findByUsername(username);
        if (db == null) return false;
        // 检查新密码长度（至少6位）
        if (newPassword == null || newPassword.length() < 6) {
            return false;
        }
        db.setPassword(encoder.encode(newPassword));
        return updateById(db);
    }

    @Override
    public User findByUsername(String username) {
        // 使用 oneOpt 避免多行异常
        return lambdaQuery().eq(User::getUsername, username).oneOpt().orElse(null);
    }

    @Override
    public User findByEmail(String email) {
        return lambdaQuery().eq(User::getEmail, email).oneOpt().orElse(null);
    }
}