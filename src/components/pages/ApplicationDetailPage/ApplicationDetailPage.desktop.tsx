import {memo} from 'react';
import OrgMainLayout from '^layouts/org/mainLayout';
import {ContentLayout, ContentTabNav} from '^layouts/ContentLayout';
import {applicationIdParamState, orgIdParamState, useRouterIdParamState} from '^atoms/common';
import {atom, useRecoilValue} from 'recoil';
import {ApplicationHeader} from './ApplicationHeader';
import {
    TabContentForInformation,
    TabContentForSpend,
    TabContentForInvoices,
    TabContentForHistories,
    TabContentForSettings,
} from './TabContents';
import {Badge} from '^components/Badge';
import {CurrentConnectStatus} from './CurrentConnectStatus';
import {Breadcrumb} from './Breadcrumb';

export const navTabIndex = atom({
    key: 'ApplicationDetailPageDesktop/NavTabIndex',
    default: 0,
});

export const ApplicationDetailPageDesktop = memo(() => {
    useRouterIdParamState('id', orgIdParamState);
    useRouterIdParamState('appId', applicationIdParamState);
    const tabIndex = useRecoilValue(navTabIndex);

    const tabs = [
        {label: 'information', Component: TabContentForInformation},
        {label: 'spend', Component: TabContentForSpend},
        {label: 'invoices', Component: TabContentForInvoices},
        {label: 'histories', Component: TabContentForHistories},
        {label: 'settings', Component: TabContentForSettings},
    ];

    const TabContentComponent = tabs[tabIndex].Component;

    return (
        <OrgMainLayout>
            <ContentLayout>
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
