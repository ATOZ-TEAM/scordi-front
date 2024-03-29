import {useModal} from '^v3/share/modals';
import {appShowPageModal} from './atom';
import {useRecoilState} from 'recoil';
import {appIdState} from '^v3/V3OrgAppShowPage/atom';

export const useAppShowModal = () => {
    const {open, close, ...res} = useModal(appShowPageModal);
    const [appId, setAppId] = useRecoilState(appIdState);

    const show = (subscriptionId: number) => {
        setAppId(subscriptionId);
        open();
    };

    const hide = () => {
        close();
    };

    return {...res, show, hide, subjectId: appId};
};
