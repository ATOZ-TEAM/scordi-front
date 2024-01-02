// [SubscriptionDto] 구독 상태
export enum SubscriptionStatus {
    NONE = 'NONE', // 무관 (기본값)
    FREE_TRIAL_STARTED = 'FREE_TRIAL_STARTED', // 체험기간
    PAYMENT_SUCCESS = 'PAYMENT_SUCCESS', // 결제완료
    PAYMENT_PENDING = 'PAYMENT_PENDING', // 결제예정
    PAYMENT_FAILURE = 'PAYMENT_FAILURE', // 결제실패
    CANCELED = 'CANCELED', // 구독취소

    // 24.01.02, should be invisible options
    FREE_TRIAL_EXPIRED = 'FREE_TRIAL_EXPIRED',
    PAUSED = 'PAUSED',
}

export function t_SubscriptionStatus(status: SubscriptionStatus) {
    switch (status) {
        case SubscriptionStatus.FREE_TRIAL_STARTED:
            return '체험 기간';
        case SubscriptionStatus.PAYMENT_SUCCESS:
            return '결제 완료';
        case SubscriptionStatus.PAYMENT_PENDING:
            return '결제 예정';
        case SubscriptionStatus.PAYMENT_FAILURE:
            return '결제 실패';
        case SubscriptionStatus.CANCELED:
            return '구독 취소';
        default:
            return '무관';
    }
}

export function c_SubscriptionStatus(status: SubscriptionStatus) {
    switch (status) {
        case SubscriptionStatus.FREE_TRIAL_STARTED:
            return 'bg-cyan-200';
        case SubscriptionStatus.FREE_TRIAL_EXPIRED:
            return 'bg-pink-200';
        case SubscriptionStatus.PAYMENT_SUCCESS:
            return 'bg-green-200';
        case SubscriptionStatus.PAYMENT_PENDING:
            return 'bg-emerald-200';
        case SubscriptionStatus.PAYMENT_FAILURE:
            return 'bg-red-200';
        case SubscriptionStatus.PAUSED:
            return 'bg-sky-200';
        case SubscriptionStatus.CANCELED:
            return 'bg-orange-200';
        default:
            return 'bg-gray-100';
    }
}

export function subscriptionStatusOptions() {
    return Object.values(SubscriptionStatus).map((status) => ({
        status,
        label: t_SubscriptionStatus(status),
        className: c_SubscriptionStatus(status),
    }));
}
