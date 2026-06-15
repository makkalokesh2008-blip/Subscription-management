package com.subscriptionhub.service;

import com.subscriptionhub.model.Subscription;
import com.subscriptionhub.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public List<Subscription> getAllUserSubscriptions(String userId) {
        return subscriptionRepository.findByUserId(userId);
    }
    
    public List<Subscription> getActiveUserSubscriptions(String userId) {
        return subscriptionRepository.findByUserIdAndStatus(userId, "ACTIVE");
    }

    public List<Subscription> getAllPlatformSubscriptions() {
        return subscriptionRepository.findAll();
    }

    public Optional<Subscription> getSubscriptionById(String id) {
        return subscriptionRepository.findById(id);
    }

    public Subscription addSubscription(Subscription subscription) {
        subscription.setCreatedAt(LocalDateTime.now());
        subscription.setUpdatedAt(LocalDateTime.now());
        return subscriptionRepository.save(subscription);
    }

    public Subscription updateSubscription(String id, Subscription subscriptionDetails) {
        return subscriptionRepository.findById(id).map(subscription -> {
            subscription.setServiceName(subscriptionDetails.getServiceName());
            subscription.setCategory(subscriptionDetails.getCategory());
            subscription.setMonthlyCost(subscriptionDetails.getMonthlyCost());
            subscription.setBillingCycle(subscriptionDetails.getBillingCycle());
            subscription.setRenewalDate(subscriptionDetails.getRenewalDate());
            subscription.setStatus(subscriptionDetails.getStatus());
            subscription.setLogo(subscriptionDetails.getLogo());
            subscription.setNotes(subscriptionDetails.getNotes());
            subscription.setUpdatedAt(LocalDateTime.now());
            return subscriptionRepository.save(subscription);
        }).orElseThrow(() -> new RuntimeException("Subscription not found with id " + id));
    }

    public void deleteSubscription(String id) {
        subscriptionRepository.deleteById(id);
    }
}
