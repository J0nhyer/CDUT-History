package org.cdut.ai.controller;

import jakarta.validation.Valid;
import org.cdut.ai.dto.ChatRequest;
import org.cdut.ai.service.AiAssistantService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.Disposable;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequestMapping("/api/ai")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    public AiAssistantController(AiAssistantService aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }

    @PostMapping(value = "/chat",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter chat(@Valid @RequestBody ChatRequest request) {
        SseEmitter emitter = new SseEmitter(Duration.ofMinutes(5).toMillis());
        AtomicReference<Disposable> subscriptionRef = new AtomicReference<>();

        Disposable disposable = aiAssistantService.streamChat(request)
                .subscribe(
                        chunk -> sendChunk(emitter, chunk),
                        error -> {
                            try {
                                emitter.send(SseEmitter.event().name("error").data(error.getMessage()));
                            } catch (IOException ignored) {
                                // 忽略 SSE 发送错误
                            }
                            emitter.completeWithError(error);
                        },
                        emitter::complete
                );
        subscriptionRef.set(disposable);

        emitter.onTimeout(() -> {
            Disposable s = subscriptionRef.getAndSet(null);
            if (s != null) {
                s.dispose();
            }
            emitter.complete();
        });
        emitter.onCompletion(() -> {
            Disposable s = subscriptionRef.getAndSet(null);
            if (s != null) {
                s.dispose();
            }
        });

        return emitter;
    }

    private void sendChunk(SseEmitter emitter, String chunk) {
        try {
            emitter.send(SseEmitter.event().name("message").data(chunk));
        } catch (IOException ex) {
            emitter.completeWithError(ex);
        }
    }
}
