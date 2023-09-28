import React, {memo, useEffect} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {useRouter} from 'next/router';
import {SubscriptionDto} from '^types/subscription.type';
import {OrgAppShowPageRoute} from '^pages/orgs/[id]/apps/[appId]';
import {BillingScheduleShallowDto as ScheduleDto} from '^types/billing.type';
import {intlDateShort, yyyy_mm_dd} from '^utils/dateTime';
import {useDashboardSummary} from '^hooks/useDashboardSummary';
import {useCalendar} from '^hooks/useCalendar';
import {useSubscriptions} from '^hooks/useSubscriptions';
import {MobileSection} from '^components/v2/MobileSection';
import {getSubscriptionsParamsState} from '^atoms/subscriptions.atom';
import {didPayAppsState, willPayAppsState} from '^atoms/billingSchedules.atom';
import {getBillingSchedulesParamsState} from '^atoms/billingSchedules.atom';

export const BillingListMobile = memo(() => {
    const router = useRouter();
    const organizationId = Number(router.query.id);
    const {year, month} = useCalendar();
    const summaryDto = useDashboardSummary();
    const subsQueryResult = useSubscriptions();
    const setAppsQueryParam = useSetRecoilState(getSubscriptionsParamsState);
    const setSchedulesQueryParam = useSetRecoilState(getBillingSchedulesParamsState);
    const willPayApps = useRecoilValue(willPayAppsState);
    const didPayApps = useRecoilValue(didPayAppsState);

    const startDate = yyyy_mm_dd(new Date(year, month - 1, 1));
    const endDate = yyyy_mm_dd(new Date(year, month, 0));
    const updateQueryParam = () => {
        setSchedulesQueryParam({where: {organizationId}, startDate, endDate});
    };

    useEffect(() => {
        if (isNaN(organizationId)) return;
        updateQueryParam();
        setAppsQueryParam({
            where: {organizationId},
            order: {id: 'DESC'},
            itemsPerPage: 300,
        });
    }, [organizationId]);

    useEffect(() => {
        updateQueryParam();
    }, [year, month]);

    if (!summaryDto || !organizationId || !subsQueryResult) return <></>;
    const {items: subs} = subsQueryResult;

    return (
        <MobileSection>
            {willPayApps.length > 0 && (
                <>
                    <BillingListTitle title={'앞으로 결제될 금액'} price={summaryDto.willPayAmount} />
                    {willPayApps.map((schedule, index) => (
                        <BillingListMobileItem
                            shallow={schedule}
                            subscription={subs.find((item) => item.id === schedule.subscriptionId)!}
                            key={index}
                            onClick={() =>
                                router.push(OrgAppShowPageRoute.path(organizationId, schedule.subscriptionId))
                            }
                        />
                    ))}
                </>
            )}
            {didPayApps.length > 0 && (
                <>
                    <BillingListTitle title={'지금까지 결제한 금액'} price={summaryDto.didPayAmount} />
                    {didPayApps.map((schedule, index) => (
                        <BillingListMobileItem
                            shallow={schedule}
                            subscription={subs.find((item) => item.id === schedule.subscriptionId)!}
                            key={index}
                            onClick={() =>
                                router.push(OrgAppShowPageRoute.path(organizationId, schedule.subscriptionId))
                            }
                        />
                    ))}
                </>
            )}
        </MobileSection>
    );
});

type BillingListTitleProps = {
    title: string;
    price: number;
};

const BillingListTitle = memo((props: BillingListTitleProps) => {
    return (
        <div className={'flex justify-between text-[15px] py-1.5 mb-3'}>
            <p className={'text-[#6D7684]'}>{props.title}</p>
            <p className={'font-bold'}>US${props.price.toLocaleString()}</p>
        </div>
    );
});

type BillingListMobileItemProps = {
    subscription: SubscriptionDto;
    onClick?: () => void;
    shallow?: ScheduleDto;
};

const BillingListMobileItem = memo((props: BillingListMobileItemProps) => {
    const {shallow: schedule, subscription} = props;

    if (!schedule) return <></>;

    const amount = schedule.payAmount?.amount || 0;
    const billingDate = schedule.billingDate || '';
    const billingDateStr = intlDateShort(billingDate);
    const product = subscription.product || {};
    const serviceName = product.nameEn;
    const somethingWrong = schedule.somethingWrong();

    return (
        <div className={'flex bg-[#F9FAFB] rounded-[14px] p-[14px] items-center mb-3'} onClick={props.onClick}>
            <div className={`avatar ${somethingWrong ? 'opacity-50' : ''}`}>
                <div className="mask mask-squircle h-12 w-12">
                    <img src={product.image} alt={`${serviceName} logo`} />
                </div>
            </div>
            <div className={`pl-[10px]`}>
                <p className={'text-[#8D95A1] capitalize font-semibold'}>{serviceName}</p>
                <p className={`font-bold ${somethingWrong ? 'opacity-50 line-through text-red-400' : ''}`}>
                    US${amount.toLocaleString()}
                </p>
            </div>
            <div className={'flex-1'} />
            <div className={`p-[10px] ${somethingWrong ? 'bg-red-200' : 'bg-[#F3F0FF]'} rounded-[12px]`}>
                <p className={`${somethingWrong ? 'text-red-400' : 'text-[#7963F7]'} font-bold`}>
                    {billingDateStr}
                    <span className={`badge badge-error text-white font-bold ml-2`}>!</span>
                </p>
            </div>
        </div>
    );
});
