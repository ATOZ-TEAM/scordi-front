import {Fragment, memo} from 'react';
import {atom, useRecoilValue} from 'recoil';
import {subscriptionIdParamState, orgIdParamState, useRouterIdParamState} from '^atoms/common';
import OrgMainLayout from '^layouts/org/mainLayout';
import {ContentLayout, ContentTabNav} from '^layouts/ContentLayout';
import {useCurrentUser} from '^models/User/hook';
import {ApplicationHeader} from './ApplicationHeader';
import {
    TabContentForInformation,
    TabContentForSpend,
    TabContentForInvoices,
    TabContentForHistories,
    TabContentForSettings,
} from './TabContents';
import {CurrentConnectStatus} from './CurrentConnectStatus';
import {Breadcrumb} from './Breadcrumb';
import {ConnectStatusPooling} from './ConnectStatusPooling';

export const navTabIndex = atom({
    key: 'OrgAppShowPageDesktop/NavTabIndex',
    default: 0,
});

export const OrgAppShowPageDesktop = memo(() => {
    useRouterIdParamState('id', orgIdParamState);
    useRouterIdParamState('appId', subscriptionIdParamState);
    const {currentUser} = useCurrentUser();
    const tabIndex = useRecoilValue(navTabIndex);

    const tabs = [
        {label: 'information', Component: TabContentForInformation},
        {label: 'spend', Component: TabContentForSpend},
        {label: 'invoices', Component: TabContentForInvoices},
        {label: 'histories', Component: TabContentForHistories},
    ];

    if (currentUser && currentUser.isAdmin) {
        tabs.push({label: 'settings (admin only)', Component: TabContentForSettings});
    }

    const TabContentComponent = tabs[tabIndex]?.Component || Fragment;

    return (
        <OrgMainLayout>
            <ContentLayout>
                <ConnectStatusPooling />
                <div className="flex justify-between items-baseline">
                    <Breadcrumb />
                </div>
                <ApplicationHeader>
                    <CurrentConnectStatus />
                </ApplicationHeader>

                <ContentTabNav resetIndex={true} tabs={tabs.map((tab) => tab.label)} recoilState={navTabIndex} />

                <TabContentComponent />
            </ContentLayout>
        </OrgMainLayout>
    );
});
