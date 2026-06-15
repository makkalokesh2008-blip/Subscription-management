package com.subscriptionhub.service;

import com.subscriptionhub.model.Payment;
import com.subscriptionhub.model.Plan;
import com.subscriptionhub.repository.PaymentRepository;
import com.subscriptionhub.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final PlanRepository planRepository;
    private final PaymentRepository paymentRepository;
    private final com.subscriptionhub.repository.UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedPlans();
        seedPayments();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@subscriptionhub.com")) {
            log.info("Seeding admin user...");
            com.subscriptionhub.model.User admin = com.subscriptionhub.model.User.builder()
                .name("Admin User")
                .email("admin@subscriptionhub.com")
                .password(passwordEncoder.encode("admin123"))
                .role(com.subscriptionhub.model.Role.ADMIN)
                .build();
            userRepository.save(admin);
            log.info("Admin user seeded.");
        }
    }

    private void seedPlans() {
        if (planRepository.count() == 0) {
            log.info("Seeding initial plans...");
            List<Plan> plans = List.of(
                Plan.builder().name("Netflix Premium").category("Entertainment").price(649.0).billingCycle("MONTHLY").color("#E50914").build(),
                Plan.builder().name("Spotify Premium").category("Entertainment").price(119.0).billingCycle("MONTHLY").color("#1DB954").build(),
                Plan.builder().name("Amazon Prime").category("Entertainment").price(1499.0).billingCycle("YEARLY").color("#00A8E1").build(),
                Plan.builder().name("Disney+").category("Entertainment").price(899.0).billingCycle("YEARLY").color("#113CCF").build(),
                Plan.builder().name("YouTube Premium").category("Entertainment").price(129.0).billingCycle("MONTHLY").color("#FF0000").build(),
                Plan.builder().name("ChatGPT Plus").category("Productivity").price(1650.0).billingCycle("MONTHLY").color("#10A37F").build(),
                Plan.builder().name("Microsoft 365").category("Productivity").price(489.0).billingCycle("MONTHLY").color("#0078D4").build(),
                Plan.builder().name("Adobe Creative Cloud").category("Productivity").price(4230.0).billingCycle("MONTHLY").color("#FF0000").build()
            );
            planRepository.saveAll(plans);
            log.info("Seeded {} plans.", plans.size());
        }
    }

    private void seedPayments() {
        if (paymentRepository.count() == 0) {
            log.info("Seeding initial payments...");
            List<Payment> payments = List.of(
                Payment.builder().userId("demo-user-1").userName("Demo User").planName("Netflix Premium").amount(649.0).status("SUCCESS").paymentDate(LocalDateTime.now().minusDays(2)).build(),
                Payment.builder().userId("demo-user-1").userName("Demo User").planName("Spotify Premium").amount(119.0).status("SUCCESS").paymentDate(LocalDateTime.now().minusDays(5)).build(),
                Payment.builder().userId("demo-user-2").userName("Admin User").planName("Amazon Prime").amount(1499.0).status("SUCCESS").paymentDate(LocalDateTime.now().minusDays(15)).build(),
                Payment.builder().userId("demo-user-3").userName("Alice").planName("ChatGPT Plus").amount(1650.0).status("FAILED").paymentDate(LocalDateTime.now().minusDays(1)).build(),
                Payment.builder().userId("demo-user-1").userName("Demo User").planName("Microsoft 365").amount(489.0).status("SUCCESS").paymentDate(LocalDateTime.now().minusDays(10)).build()
            );
            paymentRepository.saveAll(payments);
            log.info("Seeded {} payments.", payments.size());
        }
    }
}
