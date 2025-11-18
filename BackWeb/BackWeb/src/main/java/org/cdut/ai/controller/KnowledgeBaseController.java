package org.cdut.ai.controller;

import jakarta.validation.Valid;
import org.cdut.ai.dto.KnowledgeDocumentRequest;
import org.cdut.ai.model.KnowledgeEntry;
import org.cdut.ai.service.KnowledgeBaseService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge")
public class KnowledgeBaseController {

    private final KnowledgeBaseService knowledgeBaseService;

    public KnowledgeBaseController(KnowledgeBaseService knowledgeBaseService) {
        this.knowledgeBaseService = knowledgeBaseService;
    }

    @PostMapping("/documents")
    public KnowledgeEntry addDocument(@Valid @RequestBody KnowledgeDocumentRequest request) {
        return knowledgeBaseService.addEntry(request.getTitle(), request.getContent(), request.getTags());
    }

    @GetMapping("/documents")
    public List<KnowledgeEntry> listDocuments() {
        return knowledgeBaseService.listEntries();
    }
}
