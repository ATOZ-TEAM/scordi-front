import {memo} from 'react';
import {ContentPanel, ContentPanelMiniTitle} from '^layouts/ContentLayout';
import {useCurrentSubscription} from '^models/Subscription/hook';

export const ConnectPanel = memo(() => {
    const {currentSubscription: application} = useCurrentSubscription();

    if (!application) return <></>;

    const {product} = application;

    const connectionDesc = `
            We use app connections to measure app activity and usage.
             Please ensure a connection is provided by the app's admins.
            `.trim();

    return (
        <ContentPanel>
            <ContentPanelMiniTitle>Connections</ContentPanelMiniTitle>

            <div
                className="text-sm whitespace-pre-line mb-5 text-gray-500"
                dangerouslySetInnerHTML={{
                    __html: connectionDesc,
                }}
            />

            <div className="flex gap-2">
                <button className="ContentLayout--ContentButton btn-sm">Invite Someone To Connect</button>
                <button className="ContentLayout--ContentButton btn-sm btn-primary">Connect</button>
            </div>
        </ContentPanel>
    );
});
