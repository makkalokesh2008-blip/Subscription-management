package com.subscriptionhub.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final RestTemplate restTemplate;
    private final String NODE_SEARCH_URL = "http://localhost:5000/search";

    @GetMapping
    public ResponseEntity<?> getSearch(@RequestParam(required = false, defaultValue = "") String q) {
        try {
            String url = NODE_SEARCH_URL + "?q=" + q;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to connect to search service"));
        }
    }

    @PostMapping
    public ResponseEntity<?> postSearch(@RequestBody Map<String, Object> payload) {
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(NODE_SEARCH_URL, payload, Map.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to connect to search service"));
        }
    }
}
