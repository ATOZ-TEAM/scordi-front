import React, {memo} from 'react';
import {TitleSection} from '^components/v2/TitleSection';
import {useCurrentSubscription} from '^models/Subscription/hook';
import {AppNameWithLogoBlock} from '^components/pages/OrgAppInfoPage/AppNameWithLogoBlock';
import {BillingHistoryAmountInfoBlock} from '^components/pages/BillingHistoryShowPage/BillingHistoryAmountInfoBlock';
import {MobileKeyValueItem} from '^components/v2/MobileKeyValueItem';
import {MobileSection} from '^components/v2/MobileSection';
import {t_paidAt, useBillingHistory} from '^models/BillingHistory/hook';

type BillingHistoryInfoSectionProps = {};

export const BillingHistoryInfoSection = memo((props: BillingHistoryInfoSectionProps) => {
    const {currentSubscription: subscription} = useCurrentSubscription();
    const billingHistory = useBillingHistory();

    if (!subscription || !billingHistory) return <></>;

    return (
        <>
            <TitleSection.TopPadding />
            <TitleSection.Simple flex={false}>
                <AppNameWithLogoBlock product={subscription.product} />
                <BillingHistoryAmountInfoBlock billingHistory={billingHistory} />
            </TitleSection.Simple>

            <MobileSection className="pb-3 border-b-8">
                <MobileKeyValueItem label="결제일시" value={t_paidAt(billingHistory)} />
                {/*<MobileKeyValueItem label="결제상태" value={billingHistory.isSuccess ? '결제완료' : '-'} />*/}
            </MobileSection>
        </>
    );
});
