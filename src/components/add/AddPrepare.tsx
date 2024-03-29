import {AppIconButton} from '^components/AppIconButton';
import {DefaultButton} from '^components/Button';
import {useRouter} from 'next/router';
import {NotificationPageRoute} from '^pages/apps/add/notification';
import {ProductDto} from '^models/Product/type';
import {errorNotify} from '^utils/toast-notify';
import {MobileViewContainer} from '^components/MobileTopNav';
import {productApi} from '^models/Product/api';

type AddPrepareProps = {
    appInfo: ProductDto;
};

export const AddPrepare = ({appInfo}: AddPrepareProps) => {
    const router = useRouter();

    const applyAlert = () => {
        if (!appInfo || !appInfo.id) return;

        productApi
            .alert(appInfo.id)
            .then((res) => {
                if (`${res.data}` === 'true') {
                    router.push(NotificationPageRoute.pathname);
                }
            })
            .catch(errorNotify);
    };

    return (
        <MobileViewContainer>
            <h2>서비스 연동하기</h2>
            <p className={'mt-[20px] text-[#6D7684]'}>
                자동연동을 준비중인 서비스 입니다.
                <br />
                작업이 완료되면 알려드릴 수 있게 알림 신청을 해주세요.
            </p>

            <div className={'py-[30px] text-center'}>
                <AppIconButton name={appInfo.nameEn} icon={appInfo.image} />
            </div>
            <DefaultButton text={'작업이 완료되면 알림받기'} onClick={applyAlert} />
        </MobileViewContainer>
    );
};
