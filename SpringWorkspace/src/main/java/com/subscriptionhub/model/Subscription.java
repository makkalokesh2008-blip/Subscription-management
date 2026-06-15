package com.subscriptionhub.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "subscriptions")
public class Subscription {

    @Id
    private String id;
    
    private String userId;
    
    private String serviceName;
    
    private String category;
    
    private Double monthlyCost;
    
    private String billingCycle; // e.g. "MONTHLY", "YEARLY"
    
    private LocalDate renewalDate;
    
    private String status; // e.g. "ACTIVE", "CANCELLED", "PAUSED"
    
    private String logo;
    
    private String notes;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
