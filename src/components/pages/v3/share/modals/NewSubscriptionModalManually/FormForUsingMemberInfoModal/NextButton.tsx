import {memo} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {debounce} from 'lodash';
import {useModal} from '^v3/share/modals';
import {subscriptionApi} from '^models/Subscription/api';
import {memoAtom, newFormForFinishModalAtom, newSubscriptionManualFormData, subscriptionIdAtom} from '../atom';
import {NextButtonUI} from '../../../NextButtonUI';
import {useSubscriptionTableListAtom} from '^models/Subscription/hook';
import {BillingCycleOptions} from '^models/Subscription/types/BillingCycleOptions';
import {PricingModelOptions} from '^models/Subscription/types/PricingModelOptions';
import {useSubscriptionMenuSummaryV2} from '^models/SubscsriptionSummary/hook';

interface NextButtonProps {
    refreshPageData: () => any;
}

export const NextButton = memo(function NextButton(props: NextButtonProps) {
    const formData = useRecoilValue(newSubscriptionManualFormData);
    const {open: finishModalOpen} = useModal(newFormForFinishModalAtom);
    const setSubscriptionId = useSetRecoilState(subscriptionIdAtom);
    const setDesc = useSetRecoilState(memoAtom);

    const {refreshPageData} = props;

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
