package com.subscriptionhub.controller;

import com.subscriptionhub.model.Subscription;
import com.subscriptionhub.security.UserDetailsImpl;
import com.subscriptionhub.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    @GetMapping
    public List<Subscription> getAllSubscriptions() {
        return subscriptionService.getAllUserSubscriptions(getCurrentUserId());
    }
    
    @GetMapping("/platform/all")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public List<Subscription> getAllPlatformSubscriptions() {
        return subscriptionService.getAllPlatformSubscriptions();
    }
    
    @GetMapping("/active")
    public List<Subscription> getActiveSubscriptions() {
        return subscriptionService.getActiveUserSubscriptions(getCurrentUserId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getSubscriptionById(@PathVariable String id) {
        Subscription subscription = subscriptionService.getSubscriptionById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        if (!subscription.getUserId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(subscription);
    }

    @PostMapping
    public Subscription createSubscription(@RequestBody Subscription subscription) {
        subscription.setUserId(getCurrentUserId());
        return subscriptionService.addSubscription(subscription);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subscription> updateSubscription(@PathVariable String id, @RequestBody Subscription subscriptionDetails) {
        Subscription existing = subscriptionService.getSubscriptionById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
                
        if (!existing.getUserId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).build();
        }
        
        Subscription updatedSubscription = subscriptionService.updateSubscription(id, subscriptionDetails);
        return ResponseEntity.ok(updatedSubscription);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubscription(@PathVariable String id) {
        Subscription existing = subscriptionService.getSubscriptionById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
                
        if (!existing.getUserId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).build();
        }
        
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.ok().build();
    }
}
