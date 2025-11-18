package org.cdut.ai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.cdut.ai.model.KnowledgeEntry;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class KnowledgeBaseService {

    private static final TypeReference<List<KnowledgeEntry>> LIST_TYPE = new TypeReference<>() {};
    private final ObjectMapper objectMapper;
    private final Path storagePath;

    public KnowledgeBaseService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.storagePath = Path.of("data", "knowledge-base.json");
        initStorage();
    }

    public synchronized KnowledgeEntry addEntry(String title, String content, List<String> tags) {
        List<KnowledgeEntry> entries = loadAll();
        KnowledgeEntry entry = new KnowledgeEntry();
        entry.setId(UUID.randomUUID().toString());
        entry.setTitle(title);
        entry.setContent(content);
        entry.setTags(tags);
        entry.setCreatedAt(Instant.now());
        entries.add(entry);
        persist(entries);
        return entry;
    }

    public synchronized List<KnowledgeEntry> listEntries() {
        return loadAll();
    }

    public synchronized String buildPromptContext(String question, int limit) {
        List<KnowledgeEntry> entries = selectTopEntries(question, limit);
        if (entries.isEmpty()) {
            return "暂无校史资料，需要你根据公开信息谨慎回答。";
        }
        return entries.stream()
                .map(entry -> """
                        标题：%s
                        标签：%s
                        内容：%s
                        """.formatted(entry.getTitle(),
                        entry.getTags() == null ? "无" : String.join(",", entry.getTags()),
                        entry.getContent()))
                .collect(Collectors.joining("\n---\n"));
    }

    private List<KnowledgeEntry> selectTopEntries(String question, int limit) {
        List<KnowledgeEntry> entries = loadAll();
        if (!StringUtils.hasText(question)) {
            return entries.stream()
                    .sorted(Comparator.comparing(KnowledgeEntry::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                    .limit(limit)
                    .toList();
        }
        String[] keywords = question.toLowerCase(Locale.ROOT).split("\\s+");
        return entries.stream()
                .sorted(Comparator.comparingInt((KnowledgeEntry entry) -> scoreEntry(entry, keywords)).reversed())
                .limit(limit)
                .toList();
    }

    private int scoreEntry(KnowledgeEntry entry, String[] keywords) {
        if (keywords.length == 0) {
            return 0;
        }
        int score = 0;
        String title = defaultString(entry.getTitle()).toLowerCase(Locale.ROOT);
        String content = defaultString(entry.getContent()).toLowerCase(Locale.ROOT);
        List<String> tags = entry.getTags();
        for (String keyword : keywords) {
            if (!StringUtils.hasText(keyword)) {
                continue;
            }
            if (title.contains(keyword)) {
                score += 3;
            }
            if (content.contains(keyword)) {
                score += 2;
            }
            if (!CollectionUtils.isEmpty(tags) &&
                    tags.stream().filter(Objects::nonNull)
                            .map(tag -> tag.toLowerCase(Locale.ROOT))
                            .anyMatch(tag -> tag.contains(keyword))) {
                score += 1;
            }
        }
        return score;
    }

    private void initStorage() {
        try {
            Files.createDirectories(storagePath.getParent());
            if (Files.notExists(storagePath)) {
                Files.writeString(storagePath, "[]", StandardCharsets.UTF_8);
            }
        } catch (IOException e) {
            throw new IllegalStateException("初始化知识库存储失败", e);
        }
    }

    private List<KnowledgeEntry> loadAll() {
        try {
            byte[] data = Files.readAllBytes(storagePath);
            if (data.length == 0) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(data, LIST_TYPE);
        } catch (IOException e) {
            throw new IllegalStateException("读取知识库失败", e);
        }
    }

    private void persist(List<KnowledgeEntry> entries) {
        try {
            byte[] data = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(entries);
            Files.write(storagePath, data);
        } catch (IOException e) {
            throw new IllegalStateException("保存知识库失败", e);
        }
    }

    private String defaultString(String value) {
        return value == null ? "" : value;
    }
}
