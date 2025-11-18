package org.cdut;

import org.cdut.ai.config.AliBailianProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AliBailianProperties.class)
public class APP {
    public static void main(String[] args) {
        SpringApplication.run(APP.class, args);
    }
}
