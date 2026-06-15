package com.subscriptionhub.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "plans")
public class Plan {
    
    @Id
    private String id;
    
    private String name;
    
    private String category;
    
    private Double price;
    
    private String billingCycle;
    
    private String color;

    private String description;
    
    private Double yearlyPrice;
    
    private java.util.List<String> features;
    
    @Builder.Default
    private String status = "ACTIVE";
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
