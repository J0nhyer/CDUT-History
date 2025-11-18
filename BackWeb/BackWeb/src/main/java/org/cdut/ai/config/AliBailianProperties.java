package org.cdut.ai.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

@Validated
@ConfigurationProperties(prefix = "ali.bailian")
public class AliBailianProperties {

    /**
     * DashScope / 百炼 API Key，建议通过环境变量注入。
     */
    @NotBlank(message = "ali.bailian.api-key 不能为空，请设置环境变量 ALI_BAILIAN_API_KEY")
    private String apiKey;

    /**
     * 默认模型编码，如 qwen-plus / qwen-max。
     */
    @NotBlank
    private String modelCode = "qwen-plus";

    /**
     * API 网关基地址。
     */
    @NotBlank
    private String baseUrl = "https://dashscope.aliyuncs.com";

    /**
     * 可选的知识库 ID，没有则不启用知识增强。
     */
    private String knowledgeBaseId;

    /**
     * Prompt 模板资源，可以是 classpath/file。
     */
    private Resource promptTemplate;

    /**
     * 控制输出多样性，0~1。
     */
    private double temperature = 0.2;

    /**
     * 响应 token 上限。
     */
    @Positive
    private int maxTokens = 1024;

    /**
     * HTTP 请求超时。
     */
    private Duration requestTimeout = Duration.ofSeconds(35);

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getModelCode() {
        return modelCode;
    }

    public void setModelCode(String modelCode) {
        this.modelCode = modelCode;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getKnowledgeBaseId() {
        return knowledgeBaseId;
    }

    public void setKnowledgeBaseId(String knowledgeBaseId) {
        this.knowledgeBaseId = knowledgeBaseId;
    }

    public Resource getPromptTemplate() {
        return promptTemplate;
    }

    public void setPromptTemplate(Resource promptTemplate) {
        this.promptTemplate = promptTemplate;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public int getMaxTokens() {
        return maxTokens;
    }

    public void setMaxTokens(int maxTokens) {
        this.maxTokens = maxTokens;
    }

    public Duration getRequestTimeout() {
        return requestTimeout;
    }

    public void setRequestTimeout(Duration requestTimeout) {
        this.requestTimeout = requestTimeout;
    }

    public boolean isKnowledgeBaseEnabled() {
        return knowledgeBaseId != null && !knowledgeBaseId.isBlank();
    }
}
