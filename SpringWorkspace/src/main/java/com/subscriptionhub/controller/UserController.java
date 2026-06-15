package com.subscriptionhub.controller;

import com.subscriptionhub.model.User;
import com.subscriptionhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable String id, @RequestBody java.util.Map<String, String> payload) {
        return userRepository.findById(id).map(user -> {
            String newRole = payload.get("role");
            if (newRole != null && (newRole.equals("USER") || newRole.equals("ADMIN"))) {
                user.setRole(com.subscriptionhub.model.Role.valueOf(newRole));
                userRepository.save(user);
                return ResponseEntity.ok().body(new com.subscriptionhub.dto.MessageResponse("User role updated successfully"));
            }
            return ResponseEntity.badRequest().body(new com.subscriptionhub.dto.MessageResponse("Invalid role"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(new com.subscriptionhub.dto.MessageResponse("User deleted successfully"));
    }
}
