package com.subscriptionhub.service;

import com.subscriptionhub.model.Subscription;
import com.subscriptionhub.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public List<String> generateRecommendations(String userId) {
        List<Subscription> activeSubscriptions = subscriptionRepository.findByUserIdAndStatus(userId, "ACTIVE");
        List<String> recommendations = new ArrayList<>();

        // Logic 1: Detect Duplicates in Category
        Map<String, List<Subscription>> byCategory = activeSubscriptions.stream()
                .collect(Collectors.groupingBy(Subscription::getCategory));

        for (Map.Entry<String, List<Subscription>> entry : byCategory.entrySet()) {
            if (entry.getValue().size() > 1 && !entry.getKey().equalsIgnoreCase("Other")) {
                recommendations.add("You have " + entry.getValue().size() + " active subscriptions in the '" 
                        + entry.getKey() + "' category. Consider cancelling one to save money.");
            }
        }

        // Logic 2: High cost alerts
        for (Subscription sub : activeSubscriptions) {
            if (sub.getMonthlyCost() > 1500) {
                recommendations.add(sub.getServiceName() + " costs " + sub.getMonthlyCost() + " per month. Consider downgrading to a basic tier.");
            }
        }
        
        // Logic 3: Family plan suggestion
        long streamingCount = activeSubscriptions.stream()
            .filter(sub -> "Streaming".equalsIgnoreCase(sub.getCategory()) || "Entertainment".equalsIgnoreCase(sub.getCategory()))
            .count();
            
        if (streamingCount >= 3) {
            recommendations.add("You have multiple streaming services. Using family plans and sharing costs could reduce your spending by 25%.");
        }

        if (recommendations.isEmpty()) {
            recommendations.add("Your subscription portfolio looks optimized! No major issues detected.");
        }

        return recommendations;
    }
}
