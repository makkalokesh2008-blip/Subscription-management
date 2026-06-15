package com.subscriptionhub.service;

import com.subscriptionhub.model.Subscription;
import com.subscriptionhub.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public Map<String, Object> getUserAnalytics(String userId) {
        List<Subscription> activeSubscriptions = subscriptionRepository.findByUserIdAndStatus(userId, "ACTIVE");
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalActive", activeSubscriptions.size());
        
        double monthlySpending = activeSubscriptions.stream()
            .mapToDouble(sub -> {
                if ("YEARLY".equalsIgnoreCase(sub.getBillingCycle())) {
                    return sub.getMonthlyCost() / 12.0;
                }
                return sub.getMonthlyCost();
            }).sum();
            
        analytics.put("monthlySpending", monthlySpending);
        analytics.put("yearlySpending", monthlySpending * 12);
        
        Map<String, Double> categoryBreakdown = activeSubscriptions.stream()
            .collect(Collectors.groupingBy(
                Subscription::getCategory,
                Collectors.summingDouble(sub -> "YEARLY".equalsIgnoreCase(sub.getBillingCycle()) ? sub.getMonthlyCost() / 12.0 : sub.getMonthlyCost())
            ));
            
        analytics.put("categoryBreakdown", categoryBreakdown);
        
        return analytics;
    }
}
