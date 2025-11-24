package com.tudespensa.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

/**
 * Simple health‑check endpoint used to verify that the Spring Boot application
 * is up and listening on the configured port (default 8080).
 *
 * Access it with: http://localhost:8080/health
 */
@RestController
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
