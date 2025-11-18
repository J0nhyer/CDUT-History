// src/main/java/org/cdut/ai/config/SecurityConfig.java
package org.cdut.ai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authz -> authz
                        // 放行登录/注册/重置密码 + 预检
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/user/login",
                                "/user/register",
                                "/user/resetPassword",
                                "/user/__ping"
                        ).permitAll()
                        // 其它先放行，等联通后再收紧
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    /**
     * 全局 CORS：与前端保持一致
     * 当前前端 withCredentials = false，所以这里允许任意来源（*）且不返回凭据。
     * 如果未来改为 Cookie 会话：把 allowCredentials(true) 同时把 AllowedOrigins 改成具体域名（不能用 *）。
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();

        cfg.addAllowedOriginPattern("*");
        cfg.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        cfg.setAllowedHeaders(Arrays.asList("Content-Type","Authorization","X-Requested-With","Accept","Origin"));
        cfg.setExposedHeaders(Arrays.asList("Authorization","Content-Type"));
        cfg.setAllowCredentials(false); // 与前端 withCredentials=false 保持一致
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}