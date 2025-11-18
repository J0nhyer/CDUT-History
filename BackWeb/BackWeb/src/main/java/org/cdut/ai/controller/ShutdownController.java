package org.cdut.ai.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 提供一个受保护的接口，用于在需要时远程关闭 Spring Boot 应用。
 *
 * 需要在配置文件中设置 app.shutdown.token（例如 application.properties）。
 * 调用方必须在请求头中携带同样的 token：
 * curl -X POST http://localhost:8080/admin/shutdown -H "X-Shutdown-Token: yourToken"
 */
@RestController
@RequestMapping("/admin")
public class ShutdownController {

    private static final Logger log = LoggerFactory.getLogger(ShutdownController.class);
    private static final String TOKEN_PROPERTY = "app.shutdown.token";
    private static final String TOKEN_HEADER = "X-Shutdown-Token";

    private final ConfigurableApplicationContext context;
    private final Environment environment;
    private final AtomicBoolean shuttingDown = new AtomicBoolean(false);

    public ShutdownController(ConfigurableApplicationContext context, Environment environment) {
        this.context = context;
        this.environment = environment;
    }

    @PostMapping("/shutdown")
    public ResponseEntity<?> shutdown(@RequestHeader(value = TOKEN_HEADER, required = false) String token) {
        String expectedToken = environment.getProperty(TOKEN_PROPERTY);
        if (expectedToken == null || expectedToken.isBlank()) {
            log.warn("拒绝关停请求：未配置 {}", TOKEN_PROPERTY);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of(
                            "success", false,
                            "message", "Shutdown token 未配置，无法执行关停"
                    ));
        }

        if (!Objects.equals(expectedToken, token)) {
            log.warn("拒绝关停请求：token 不匹配");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "success", false,
                            "message", "未授权的关停请求"
                    ));
        }

        if (!shuttingDown.compareAndSet(false, true)) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "关停已在进行中"
            ));
        }

        log.info("收到关停指令，应用将在 1 秒后关闭...");

        new Thread(() -> {
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException ignored) {
            }
            try {
                context.close();
            } catch (Exception e) {
                log.error("关闭 Spring 上下文时出现异常", e);
            } finally {
                log.info("Spring 上下文已关闭，退出进程");
                System.exit(0);
            }
        }, "app-shutdown-thread").start();

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "关停指令已下发，应用即将关闭",
                "timestamp", Instant.now().toEpochMilli()
        ));
    }
}

