import React, {useEffect} from 'react';
import {pathReplace, pathRoute} from '^types/pageRoute.type';
import {getOrgMainLayout} from '^layouts/org/mainLayout';
import {MobileTopNav, MobileTopNavRight} from '^components/v2/MobileTopNav';
import {BackButton} from '^components/v2/ui/buttons/BackButton';
import {BasicButton} from '^components/v2/ui/buttons/BasicButton';
import {TitleSection} from '^components/v2/TitleSection';
import {useApplication} from '^hooks/useApplications';
import {useBillingHistory} from '^hooks/useBillingHistories';
import {AppNameWithLogoBlock} from '^components/pages/OrgAppInfoPage/AppNameWithLogoBlock';
import {applicationIdParamState, billingHistoryIdParamState, useRouterIdParamState} from '^atoms/common';
import {BillingHistoryEditForm} from '^components/pages/BillingHistoryEditPage/BillingHistoryEditForm';
import {BillingHistoryAmountInputBlock} from '^components/pages/BillingHistoryEditPage/BillingHistoryAmountInputBlock';
import {useForm} from 'react-hook-form';
import {t_paidAt, UpdateBillingHistoryRequestDto} from '^types/billing.type';
import {BillingHistoryInputsBlock} from '^components/pages/BillingHistoryEditPage/BillingHistoryInputsBlock';
import {MobileBottomNav} from '^components/v2/MobileBottomNav';
import {CTAButton} from '^components/v2/ui/buttons/CTAButton';

export const BillingHistoryEditPageRoute = pathRoute({
    pathname: '/orgs/[id]/apps/[appId]/billingHistories/[billingHistoryId]/edit',
    path: (orgId: number, appId: number, billingHistoryId: number) =>
        pathReplace(BillingHistoryEditPageRoute.pathname, {
            id: orgId,
            appId,
            billingHistoryId,
        }),
});

export default function BillingHistoryEditPage() {
    useRouterIdParamState('appId', applicationIdParamState);
    useRouterIdParamState('billingHistoryId', billingHistoryIdParamState);
    const application = useApplication();
    const billingHistory = useBillingHistory();
    const form = useForm<UpdateBillingHistoryRequestDto>();

    if (!application || !billingHistory) return <></>;

    return (
        <BillingHistoryEditForm form={form}>
            <MobileTopNav>
                <BackButton text="취소" />
            </MobileTopNav>

            <TitleSection.TopPadding />
            <TitleSection.Simple flex={false}>
                <AppNameWithLogoBlock prototype={application.prototype} />
                <BillingHistoryAmountInputBlock form={form} />
            </TitleSection.Simple>

            <BillingHistoryInputsBlock form={form} />

            <MobileBottomNav>
                <CTAButton type="submit" text="저장" />
            </MobileBottomNav>
        </BillingHistoryEditForm>
    );
}

BillingHistoryEditPage.getLayout = getOrgMainLayout;
