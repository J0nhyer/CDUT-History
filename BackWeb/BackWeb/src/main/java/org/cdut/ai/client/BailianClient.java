package org.cdut.ai.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.cdut.ai.config.AliBailianProperties;
import org.cdut.ai.dto.ChatMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.List;

@Component
public class BailianClient {

    private static final Logger log = LoggerFactory.getLogger(BailianClient.class);

    private final WebClient webClient;
    private final AliBailianProperties properties;
    private final ObjectMapper objectMapper;

    public BailianClient(WebClient bailianWebClient,
                         AliBailianProperties properties,
                         ObjectMapper objectMapper) {
        this.webClient = bailianWebClient;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    public Flux<String> streamChat(List<ChatMessage> messages,
                                   double temperature,
                                   int maxTokens,
                                   boolean useKnowledge,
                                   String overrideKnowledgeBaseId) {
        BailianChatPayload payload = new BailianChatPayload();
        payload.setModel(properties.getModelCode());
        payload.setInput(new BailianInput(messages));

        BailianParameters parameters = new BailianParameters();
        parameters.setIncrementalOutput(true);
        parameters.setResultFormat("message");
        parameters.setTemperature(temperature);
        parameters.setMaxTokens(maxTokens);

        String knowledgeId = resolveKnowledgeBaseId(useKnowledge, overrideKnowledgeBaseId);
        if (StringUtils.hasText(knowledgeId)) {
            BailianParameters.KnowledgeConfiguration knowledgeConfig =
                    new BailianParameters.KnowledgeConfiguration();
            knowledgeConfig.setKnowledgeId(knowledgeId);
            parameters.setKnowledgeConfiguration(knowledgeConfig);
        }

        payload.setParameters(parameters);

        return executeStreaming(payload);
    }

    private String resolveKnowledgeBaseId(boolean useKnowledge, String overrideKnowledgeBaseId) {
        if (!useKnowledge) {
            return null;
        }
        if (StringUtils.hasText(overrideKnowledgeBaseId)) {
            return overrideKnowledgeBaseId;
        }
        return properties.isKnowledgeBaseEnabled() ? properties.getKnowledgeBaseId() : null;
    }

    private Flux<String> executeStreaming(BailianChatPayload payload) {
        return webClient.post()
                .uri("/api/v1/services/aigc/text-generation/generation")
                .header("X-DashScope-SSE", "enable")
                .accept(MediaType.TEXT_EVENT_STREAM)
                .bodyValue(payload)
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> response.bodyToMono(String.class)
                        .map(body -> new RuntimeException("调用百炼失败：" + body)))
                .bodyToFlux(String.class)
                .doOnNext(chunk -> log.debug("收到原始SSE数据: {}", chunk))
                .timeout(Duration.ofMinutes(5))
                .map(this::extractTextSafely)
                .filter(StringUtils::hasText)
                .doOnComplete(() -> log.debug("SSE流正常结束"))
                .doOnError(error -> log.error("SSE流发生错误", error))
                .onErrorResume(throwable -> {
                    log.error("SSE流发生严重错误，返回错误信息", throwable);
                    return Flux.just("[系统错误] 流处理异常: " + throwable.getMessage());
                });
    }

    private String extractTextSafely(String rawChunk) {
        if (!StringUtils.hasText(rawChunk)) {
            return "";
        }

        String line = rawChunk.trim();
        if (line.isEmpty() || line.startsWith(":")) {
            return "";
        }

        String eventType = "message";
        String dataContent = line;

        // 处理事件类型
        if (line.startsWith("event:")) {
            eventType = line.substring(6).trim();
            return "";  // 事件行本身不包含数据
        }

        if (line.startsWith("data:")) {
            dataContent = line.substring(5).trim();
        }

        // 处理结束信号
        if ("end".equals(eventType) || "[DONE]".equals(dataContent)) {
            log.debug("收到流结束信号");
            return "";
        }

        // 处理结果和错误事件
        if ("result".equals(eventType) || "message".equals(eventType)) {
            try {
                JsonNode node = objectMapper.readTree(dataContent);
                JsonNode output = node.path("output");

                // 优先尝试从 output.text 提取
                if (output.has("text")) {
                    JsonNode textNode = output.get("text");
                    if (textNode.isArray()) {
                        return String.join("", objectMapper.convertValue(textNode, List.class));
                    }
                    return textNode.asText();
                }

                // 尝试从 output.choices 提取
                if (output.has("choices") && output.get("choices").isArray()) {
                    StringBuilder builder = new StringBuilder();
                    output.get("choices").forEach(choice -> {
                        JsonNode msg = choice.path("message").path("content");
                        if (msg.isArray()) {
                            msg.forEach(fragment -> builder.append(fragment.path("text").asText("")));
                        } else {
                            builder.append(msg.asText(""));
                        }
                    });
                    if (builder.length() > 0) {
                        return builder.toString();
                    }
                }

                // 尝试从根节点的 output_text 提取
                if (node.has("output_text") && node.get("output_text").isArray()) {
                    return node.get("output_text").get(0).asText();
                }

            } catch (Exception ex) {
                log.warn("解析百炼流式片段失败：{}, 原始数据: {}", ex.getMessage(), dataContent);
                return "";
            }
        }

        // 处理错误事件
        if ("error".equals(eventType)) {
            try {
                JsonNode node = objectMapper.readTree(dataContent);
                if (node.has("message")) {
                    String errorMsg = node.get("message").asText();
                    log.error("阿里百炼返回错误: {}", errorMsg);
                    return "[错误] " + errorMsg;
                }
            } catch (Exception ex) {
                log.warn("解析错误事件失败：{}", ex.getMessage());
            }
        }

        return "";
    }

    public Duration getRequestTimeout() {
        return properties.getRequestTimeout();
    }

    // 内部类保持不变
    private static class BailianChatPayload {
        private String model;
        private BailianInput input;
        private BailianParameters parameters;

        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }
        public BailianInput getInput() { return input; }
        public void setInput(BailianInput input) { this.input = input; }
        public BailianParameters getParameters() { return parameters; }
        public void setParameters(BailianParameters parameters) { this.parameters = parameters; }
    }

    private static class BailianInput {
        @JsonProperty("messages")
        private List<ChatMessage> messages;

        public BailianInput(List<ChatMessage> messages) { this.messages = messages; }
        public List<ChatMessage> getMessages() { return messages; }
        public void setMessages(List<ChatMessage> messages) { this.messages = messages; }
    }

    private static class BailianParameters {
        @JsonProperty("incremental_output")
        private boolean incrementalOutput;
        @JsonProperty("result_format")
        private String resultFormat;
        private Double temperature;
        @JsonProperty("max_tokens")
        private Integer maxTokens;
        @JsonProperty("knowledge_configuration")
        private KnowledgeConfiguration knowledgeConfiguration;

        public boolean isIncrementalOutput() { return incrementalOutput; }
        public void setIncrementalOutput(boolean incrementalOutput) { this.incrementalOutput = incrementalOutput; }
        public String getResultFormat() { return resultFormat; }
        public void setResultFormat(String resultFormat) { this.resultFormat = resultFormat; }
        public Double getTemperature() { return temperature; }
        public void setTemperature(Double temperature) { this.temperature = temperature; }
        public Integer getMaxTokens() { return maxTokens; }
        public void setMaxTokens(Integer maxTokens) { this.maxTokens = maxTokens; }
        public KnowledgeConfiguration getKnowledgeConfiguration() { return knowledgeConfiguration; }
        public void setKnowledgeConfiguration(KnowledgeConfiguration knowledgeConfiguration) { this.knowledgeConfiguration = knowledgeConfiguration; }

        private static class KnowledgeConfiguration {
            @JsonProperty("knowledge_id")
            private String knowledgeId;
            public String getKnowledgeId() { return knowledgeId; }
            public void setKnowledgeId(String knowledgeId) { this.knowledgeId = knowledgeId; }
        }
    }
}