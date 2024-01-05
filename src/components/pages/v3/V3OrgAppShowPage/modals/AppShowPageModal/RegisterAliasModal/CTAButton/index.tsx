import {memo} from 'react';
import {ModalButton} from '^v3/share/ModalButton';
import {subscriptionApi} from '^models/Subscription/api';
import {useToast} from '^hooks/useToast';
import {updateCurrentSubscriptionState, useCurrentSubscription} from '^v3/V3OrgAppShowPage/atom';
import {useRecoilValue} from 'recoil';
import {orgIdParamState} from '^atoms/common';
import {useModal} from '^v3/share/modals';
import {registerAliasModal} from '^v3/V3OrgAppShowPage/modals/AppShowPageModal/RegisterAliasModal/atom';

export const CTAButton = memo(() => {
    const {currentSubscription, loadCurrentSubscription} = useCurrentSubscription();
    const {close} = useModal(registerAliasModal);

    const orgId = useRecoilValue(orgIdParamState);
    const formData = useRecoilValue(updateCurrentSubscriptionState);
    const {toast} = useToast();

    const onClick = () => {
        if (!orgId || !currentSubscription) return;

        const subscriptionId = currentSubscription.id;
        const req = subscriptionApi.update(subscriptionId, formData);

        req.then(() => {
            toast.success('등록되었습니다.');
            close();
            loadCurrentSubscription(orgId, subscriptionId);
        });
    };

    return <ModalButton onClick={onClick} />;
});
