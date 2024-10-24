import {memo} from 'react';
import {WithChildren} from '^types/global.type';
import {Background} from './Background';
import {OrgTopBar} from './OrgTopBar';
import {TobNavBar} from './TobNavBar';
import {Footer} from '../_shared/Footer';
import {BaseLayout} from '^clients/private/_layouts/BaseLayout';
import {ChannelTalkHideStyle} from '^components/ExternalCDNScripts/channel-talk/ChannelTalkHideStyle';

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
                <TobNavBar />

                {children}

                <Footer />
            </div>
        </BaseLayout>
    );
});
MainLayout.displayName = 'MainLayout';

export * from './MainContainer';
