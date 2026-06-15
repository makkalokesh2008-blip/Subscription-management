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
@Document(collection = "payments")
public class Payment {
    
    @Id
    private String id;
    
    private String userId;
    
    private String userName;
    
    private String planName;
    
    private Double amount;
    
    private String status;
    
    @Builder.Default
    private LocalDateTime paymentDate = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
