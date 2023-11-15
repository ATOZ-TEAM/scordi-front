import React, {memo} from 'react';
import {V3ModalLikeLayoutMobile} from '^v3/layouts/V3ModalLikeLayout.mobile';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {InformationPanel} from './InformationPanel';
import {useBillingHistoriesV3} from '^models/BillingHistory/hook';
import {AccountListModal} from '^v3/share/modals/AccountListModal';
import {useCurrentSubscription} from '^v3/V3OrgAppShowPage/atom';
import {BillingHistoryDetailModal} from '^v3/share/modals/BillingHistoryDetailModal';
import {BillingHistoryContentPanel} from '^v3/share/modals/BillingHistoryDetailModal/BillingHistoryContentPanel';
import {RegisterCreditCardModal} from '^v3/share/modals/ConnectCreditCardModal';

export const V3OrgAppShowPage = memo(() => {
    const {currentSubscription} = useCurrentSubscription();
    const {result} = useBillingHistoriesV3();

    return (
        <V3ModalLikeLayoutMobile
            title={currentSubscription ? currentSubscription.product.name() : ''}
            modals={[BillingHistoryDetailModal, AccountListModal, RegisterCreditCardModal]}
        >
            <MobileSection.List className="h-full">
                <InformationPanel />
                <BillingHistoryContentPanel billingHistories={result.items} />
            </MobileSection.List>
        </V3ModalLikeLayoutMobile>
    );
});
