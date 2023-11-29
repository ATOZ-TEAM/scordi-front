import {memo, useEffect} from 'react';
import {FaRegCalendarCheck, FaRegCalendarMinus, FaRegCalendarTimes} from 'react-icons/fa';
import {
    TbCalendarCancel,
    TbCalendarCheck,
    TbCalendarExclamation,
    TbCalendarOff,
    TbCalendarPause,
    TbCalendarX,
} from 'react-icons/tb';
import {SummaryCard} from '^v3/V3OrgAppsPage/SummarySection/SummaryCard';
import {SubscriptionManager} from '^models/Subscription/manager';
import {useSubscriptionsV2} from '^models/Subscription/hook';
import {useRecoilValue} from 'recoil';
import {subscriptionsForCurrentOrgState} from '^v3/V3OrgAppsPage/atom';

/**
 * 활성
 * 결제 실패
 * 일시정지
 * 구독취소
 * 만료됨
 */
export const SummarySection = memo(function SummarySection() {
    const subscriptions = useRecoilValue(subscriptionsForCurrentOrgState);
    const Subscription = SubscriptionManager.init(subscriptions || []);

    const activeCount = Subscription.success().length; // 활성
    const failedCount = Subscription.failed().length; // 결제 실패
    const pausedCount = Subscription.paused().length; // 일시정지
    const cancelCount = Subscription.canceled().length; // 구독취소
    const expireCount = Subscription.expired().length; // 만료됨

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
            <SummaryCard
                icon={<TbCalendarCheck size={22} />}
                label="활성"
                value={activeCount}
                className="text-scordi"
            />
            <SummaryCard
                icon={<TbCalendarExclamation size={22} />}
                label="결제 실패"
                value={failedCount}
                className={failedCount ? `text-error` : 'text-gray-500'}
            />
            <SummaryCard
                icon={<TbCalendarPause size={22} />}
                label="일시정지"
                value={pausedCount}
                className="text-gray-500"
            />
            <SummaryCard
                icon={<TbCalendarX size={22} />}
                label="구독취소"
                value={cancelCount}
                className="text-gray-500"
            />
            <SummaryCard
                icon={<TbCalendarOff size={22} />}
                label="만료됨"
                value={expireCount}
                className="text-gray-500 flex md:hidden xl:flex"
            />
        </section>
    );
});
