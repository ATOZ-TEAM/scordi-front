import {memo} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {useModal} from '^v3/share/modals';
import {subscriptionApi} from '^models/Subscription/api';
import {memoAtom, newFormForFinishModalAtom, newSubscriptionManualFormData, subscriptionIdAtom} from '../atom';
import {NextButtonUI} from '../../../NextButtonUI';
import {useSubscriptionsV2} from '^models/Subscription/hook';
import {orgIdParamState} from '^atoms/common';
import {subscriptionsState} from '^models/Subscription/atom';
import {BillingCycleOptions} from '^models/Subscription/types/BillingCycleOptions';
import {PricingModelOptions} from '^models/Subscription/types/PricingModelOptions';
import {debounce} from 'lodash';

export const NextButton = memo(function NextButton() {
    const formData = useRecoilValue(newSubscriptionManualFormData);
    const {open: finishModalOpen} = useModal(newFormForFinishModalAtom);
    const setSubscriptionId = useSetRecoilState(subscriptionIdAtom);
    const setDesc = useSetRecoilState(memoAtom);

    // 구독리스트 > 요약패널 갱신용
    const organizationId = useRecoilValue(orgIdParamState);
    const setSubscriptions = useSetRecoilState(subscriptionsState);

    // 구독리스트 > 테이블 갱신용
    const {reload: reloadTableData} = useSubscriptionsV2();

    const refreshPageData = () => {
        // 구독리스트 > 요약패널 갱신
        subscriptionApi
            .index({
                where: {organizationId},
                relations: ['master'],
                itemsPerPage: 0,
            })
            .then((res) => setSubscriptions(res.data.items));

        // 구독리스트 > 테이블 갱신
        reloadTableData();
    };

    const onNext = debounce(() => {
        const req = subscriptionApi.create({
            ...formData,
            // 결제주기: 무료인 구독은 강제로 "무관" 값으로 정정하여 제출
            billingCycleType: formData.isFreeTier ? BillingCycleOptions.None : formData.billingCycleType,
            // 과금방식: 무료인 구독은 강제로 "무관" 값으로 정정하여 제출
            pricingModel: formData.isFreeTier ? PricingModelOptions.NONE : formData.pricingModel,
        });

        // 생성 진행 중인 상태 처리
        // 성공 완료 처리
        req.then((res) => {
            setDesc('');
            setSubscriptionId(res.data.id);
            refreshPageData();
            finishModalOpen();
        });

        // 실패시 처리
        req.catch((e) => console.log(e));
    }, 500);

    return (
        <NextButtonUI isActive={true} onClick={onNext}>
            등록하기
        </NextButtonUI>
    );
});
