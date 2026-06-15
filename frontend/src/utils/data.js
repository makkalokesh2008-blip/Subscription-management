export function asArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  if (Array.isArray(value?.content)) {
    return value.content;
  }

  if (Array.isArray(value?.items)) {
    return value.items;
  }

  return [];
}

export function getPlanName(plan) {
  return plan?.planName || plan?.name || "Subscription Plan";
}

export function getPlanDuration(plan) {
  return plan?.duration || plan?.durationMonths || plan?.duration_days || plan?.durationDays || "Flexible";
}

export function getPlanBenefits(plan) {
  return plan?.benefits || plan?.description || "";
}

export function getSubscriptionPlanName(subscription) {
  return getPlanName(subscription?.plan) || subscription?.planName || "Subscription";
}

export function getPaymentStatus(payment) {
  return String(payment?.status || "PENDING").toUpperCase();
}

export function isSuccessfulPayment(payment) {
  const status = getPaymentStatus(payment);
  return status === "SUCCESS" || status === "COMPLETED" || status === "PAID";
}

export function getPaymentUserName(payment) {
  return payment?.user?.name || payment?.userName || "Unknown";
}

export function getPaymentUserEmail(payment) {
  return payment?.user?.email || payment?.userEmail || payment?.email || "N/A";
}

export function getPaymentPlanName(payment) {
  return (
    payment?.plan?.name ||
    payment?.plan?.planName ||
    payment?.planName ||
    getPlanName(payment?.plan) ||
    "Standard Plan"
  );
}

export function getPaymentDateValue(payment) {
  return (
    payment?.paid_at ||
    payment?.paidAt ||
    payment?.createdAt ||
    payment?.created_at ||
    payment?.paymentDate ||
    payment?.date
  );
}

/** Join payments with subscriptions/users when API returns only amount/status. */
export function enrichPayments(payments, subscriptions = [], users = []) {
  const usedSubscriptionIds = new Set();

  return payments.map((payment) => {
    const hasUser = Boolean(payment?.user?.name || payment?.userName);
    const hasPlan = Boolean(
      payment?.planName || payment?.plan?.name || payment?.plan?.planName
    );

    if (hasUser && hasPlan) {
      return payment;
    }

    const amount = Number(payment?.amount || 0);

    let subscription = subscriptions.find((sub) => {
      const planPrice = Number(sub?.plan?.price ?? 0);
      return planPrice === amount && !usedSubscriptionIds.has(sub.id);
    });

    if (!subscription) {
      subscription = subscriptions.find((sub) => Number(sub?.plan?.price ?? 0) === amount);
    }

    if (!subscription) {
      return payment;
    }

    usedSubscriptionIds.add(subscription.id);

    const user =
      subscription.user ||
      users.find((row) => row.id === subscription.user?.id || row.id === subscription.user_id);

    return {
      ...payment,
      user: user
        ? { id: user.id, name: user.name, email: user.email }
        : payment.user,
      userName: user?.name || payment.userName,
      userEmail: user?.email || payment.userEmail,
      plan: subscription.plan || payment.plan,
      planName: subscription.plan?.planName || subscription.plan?.name || payment.planName,
      paymentDate: payment.paymentDate || payment.createdAt || subscription.createdAt
    };
  });
}

export function formatPaymentDate(dateString) {
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-CA");
}

export function formatCurrency(amount) {
  const value = Number(amount || 0);
  return `₹${value.toLocaleString("en-IN")}`;
}

export function sumPaymentAmounts(payments) {
  return payments.reduce((sum, payment) => sum + Number(payment?.amount || 0), 0);
}
