import React, {memo} from 'react';
import {TitleSection} from '^components/v2/TitleSection';
import {useBillingHistory} from '^hooks/useBillingHistories';
import {useRouter} from 'next/router';
import {BillingHistoryDto} from '^types/billing.type';

type BillingHistoryAmountInfoBlockProps = {
    billingHistory: BillingHistoryDto;
};

export const BillingHistoryAmountInfoBlock = memo((props: BillingHistoryAmountInfoBlockProps) => {
    const {billingHistory} = props;

    return (
        <TitleSection.Title size="2xl" className="text-left py-3">
            <div className="font-bold">- US$ {billingHistory.paidAmount.toLocaleString()}</div>
        </TitleSection.Title>
    );
});