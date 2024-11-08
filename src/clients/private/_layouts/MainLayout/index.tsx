import {memo, useEffect, useState} from 'react';
import {WithChildren} from '^types/global.type';
import {Background} from './Background';
import {OrgTopBar} from './OrgTopBar';
import {TopNavBar} from './TopNavBar';
import {Footer} from '../_shared/Footer';
import {BaseLayout} from '^clients/private/_layouts/BaseLayout';
import {ChannelTalkHideStyle} from '^components/ExternalCDNScripts/channel-talk/ChannelTalkHideStyle';
import {TopLineBannerContainer} from '^models/TopLineBanner/components';

interface MainLayoutProps extends WithChildren {
    //
}

export const MainLayout = memo((props: MainLayoutProps) => {
    const {children} = props;

    return (
        <BaseLayout>
            <Background />
            <ChannelTalkHideStyle />

            {/* Body */}
            <div className="relative min-h-screen">
                <OrgTopBar />
                <TopNavBar />
                <TopLineBannerContainer />
                {children}
                <Footer />
            </div>
        </BaseLayout>
    );
});
MainLayout.displayName = 'MainLayout';

export * from './MainContainer';
