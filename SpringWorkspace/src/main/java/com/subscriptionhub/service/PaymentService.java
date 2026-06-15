package com.subscriptionhub.service;

import com.subscriptionhub.model.Payment;
import com.subscriptionhub.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByUserId(String userId) {
        return paymentRepository.findByUserId(userId);
    }

    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }
    
    public Payment updatePayment(String id, Payment paymentDetails) {
        Payment existing = paymentRepository.findById(id).orElseThrow(() -> new RuntimeException("Payment not found"));
        existing.setPlanName(paymentDetails.getPlanName());
        existing.setAmount(paymentDetails.getAmount());
        existing.setStatus(paymentDetails.getStatus());
        existing.setPaymentDate(paymentDetails.getPaymentDate());
        return paymentRepository.save(existing);
    }

    public void deletePayment(String id) {
        paymentRepository.deleteById(id);
    }
    
    public long countPayments() {
        return paymentRepository.count();
    }
}
