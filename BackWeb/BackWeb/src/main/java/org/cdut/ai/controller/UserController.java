// src/main/java/org/cdut/ai/controller/UserController.java
package org.cdut.ai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.cdut.ai.model.User;
import org.cdut.ai.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "用户管理")
@RestController
@RequestMapping("/user")
//@CrossOrigin(allowCredentials = "true", originPatterns = "*", allowedHeaders = "*")
@CrossOrigin(allowCredentials = "false", originPatterns = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        // 检查密码长度（至少6位）
        if (user.getPassword() != null && user.getPassword().length() < 6) {
            result.put("success", false);
            result.put("message", "密码长度不能少于6位");
            return result;
        }
        if (userService.register(user)) {
            result.put("success", true);
            result.put("message", "注册成功");
            // 仅返回前端会用到的字段（不包含密码、也不包含 avatar）
            Map<String, Object> userView = new HashMap<>();
            userView.put("id", user.getId());
            userView.put("username", user.getUsername());
            userView.put("email", user.getEmail());
            result.put("user", userView);
        } else {
            result.put("success", false);
            result.put("message", "注册失败，用户名或邮箱已存在");
        }
        return result;
    }

    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username"); // 前端输入框名就是 username（占位提示“用户名或邮箱”不影响这里）
        String password = credentials.get("password");

        Map<String, Object> result = new HashMap<>();
        User user = userService.login(username, password); // 不改 Service 接口
        if (user != null) {
            result.put("success", true);
            result.put("message", "登录成功");
            Map<String, Object> userView = new HashMap<>();
            userView.put("id", user.getId());
            userView.put("username", user.getUsername());
            userView.put("email", user.getEmail());
            result.put("user", userView);
        } else {
            result.put("success", false);
            result.put("message", "用户名或密码错误");
        }
        return result;
    }

    @Operation(summary = "修改密码")
    @PostMapping("/updatePassword")
    public Map<String, Object> updatePassword(@RequestBody Map<String, String> passwords) {
        String username = passwords.get("username");
        String oldPassword = passwords.get("oldPassword");
        String newPassword = passwords.get("newPassword");

        Map<String, Object> result = new HashMap<>();
        // 检查新密码长度（至少6位）
        if (newPassword == null || newPassword.length() < 6) {
            result.put("success", false);
            result.put("message", "密码长度不能少于6位");
            return result;
        }
        if (userService.updatePassword(username, oldPassword, newPassword)) {
            result.put("success", true);
            result.put("message", "密码修改成功");
        } else {
            result.put("success", false);
            result.put("message", "原密码错误或用户不存在");
        }
        return result;
    }

    @Operation(summary = "修改邮箱")
    @PostMapping("/updateEmail")
    public Map<String, Object> updateEmail(@RequestBody Map<String, String> emailInfo) {
        String username = emailInfo.get("username");
        String newEmail = emailInfo.get("newEmail");

        Map<String, Object> result = new HashMap<>();
        if (userService.updateEmail(username, newEmail)) {
            result.put("success", true);
            result.put("message", "邮箱修改成功");
            // 返回更新后的用户信息
            User user = userService.findByUsername(username);
            if (user != null) {
                Map<String, Object> userView = new HashMap<>();
                userView.put("id", user.getId());
                userView.put("username", user.getUsername());
                userView.put("email", user.getEmail());
                result.put("user", userView);
            }
        } else {
            result.put("success", false);
            result.put("message", "邮箱修改失败，邮箱可能已被使用或用户不存在");
        }
        return result;
    }

    @Operation(summary = "重置密码")
    @PostMapping("/resetPassword")
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> resetInfo) {
        String email = resetInfo.get("email");
        String newPassword = resetInfo.get("newPassword");

        Map<String, Object> result = new HashMap<>();
        // 检查新密码长度（至少6位）
        if (newPassword == null || newPassword.length() < 6) {
            result.put("success", false);
            result.put("message", "密码长度不能少于6位");
            return result;
        }
        if (userService.resetPassword(email, newPassword)) {
            result.put("success", true);
            result.put("message", "密码重置成功");
        } else {
            result.put("success", false);
            result.put("message", "邮箱不存在");
        }
        return result;
    }

    @Operation(summary = "忘记密码")
    @PostMapping("/forgotPassword")
    public Map<String, Object> forgotPassword(@RequestBody Map<String, String> forgotInfo) {
        String username = forgotInfo.get("username");
        String newPassword = forgotInfo.get("newPassword");

        Map<String, Object> result = new HashMap<>();
        // 检查新密码长度（至少6位）
        if (newPassword == null || newPassword.length() < 6) {
            result.put("success", false);
            result.put("message", "密码长度不能少于6位");
            return result;
        }
        if (userService.forgotPassword(username, newPassword)) {
            result.put("success", true);
            result.put("message", "密码修改成功");
        } else {
            result.put("success", false);
            result.put("message", "用户名不存在");
        }
        return result;
    }

    @Operation(summary = "测试接口")
    @GetMapping("/test")
    public Map<String, Object> test() {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "后端连接正常");
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
}