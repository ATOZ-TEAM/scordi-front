import React, {memo} from 'react';
import {WithChildren} from '^types/global.type';
import {safeImageSrc} from '^models/Product/type';
import {MobileEntityListItem} from '^components/v2/MobileEntityListSection/MobileEntityListItem';
import {SubscriptionDto} from 'src/models/Subscription/types';
import {useRouter} from 'next/router';
import {BillingHistoryShowPageRoute} from '^pages/orgs/[id]/apps/[appId]/billingHistories/[billingHistoryId]';
import {BillingHistoryDto} from '^models/BillingHistory/type';

type BillingHistoryItemProps = {
    subscription: SubscriptionDto;
    billingHistory: BillingHistoryDto;
    onClickMethod?: 'push' | 'replace' | undefined; // default: "push"
};

export const BillingHistoryItem = memo((props: BillingHistoryItemProps) => {
    const router = useRouter();
    const {subscription, billingHistory, onClickMethod = 'push'} = props;
    if (!subscription) return <></>;
    const {product, organizationId} = subscription;

    const isSuccess = !!billingHistory.paidAt;

    return (
        <MobileEntityListItem
            id={`billingHistory-${billingHistory.id}`}
            size="big"
            onClick={() => {
                const path = BillingHistoryShowPageRoute.path(organizationId, subscription.id, billingHistory.id);
                onClickMethod === 'replace' ? router.replace(path) : router.push(path);
            }}
        >
            <div className="flex items-center px-1">
                <img
                    width={32}
                    height={32}
                    className="mask mask-squircle"
                    src={safeImageSrc(product, 32, 32)}
                    alt={`${product.nameEn} logo image`}
                />
            </div>
            <div className="flex flex-1 items-center px-3">
                <p className={`text-left`}>
                    <span
                        className={`block leading-none font-semibold mb-1 ${
                            isSuccess ? 'text-base' : 'text-gray-400 line-through'
                        }`}
                    >
                        -${billingHistory.payAmount?.amount || 0}
                    </span>
                    <span
                        className={`block leading-none text-xs ${isSuccess ? 'text-gray-500' : 'text-gray-400'}`}
                        style={{textTransform: 'none'}}
                    >
                        {product.nameEn} {isSuccess}
                    </span>
                </p>
            </div>
            <div className="flex items-center px-1">
                <div className="text-right">
                    {/*<BasicButton2 text="Add" size="sm" color="secondary" className="no-animation" />*/}
                </div>
            </div>
        </MobileEntityListItem>
    );
});
