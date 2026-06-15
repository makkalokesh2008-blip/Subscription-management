package com.subscriptionhub.service;

import com.subscriptionhub.model.Plan;
import com.subscriptionhub.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;

    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    public Plan createPlan(Plan plan) {
        return planRepository.save(plan);
    }

    public Plan updatePlan(String id, Plan planDetails) {
        Plan plan = planRepository.findById(id).orElseThrow(() -> new RuntimeException("Plan not found"));
        plan.setName(planDetails.getName());
        plan.setCategory(planDetails.getCategory());
        plan.setPrice(planDetails.getPrice());
        plan.setBillingCycle(planDetails.getBillingCycle());
        plan.setColor(planDetails.getColor());
        return planRepository.save(plan);
    }

    public void deletePlan(String id) {
        planRepository.deleteById(id);
    }
    
    public long countPlans() {
        return planRepository.count();
    }
}
