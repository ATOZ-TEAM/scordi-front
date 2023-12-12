import {memo} from 'react';
import {SubscriptionDto} from '^models/Subscription/types';
import {PayingTypeSelect} from '^v3/V3OrgAppsPage/SubscriptionListSection/SubscriptionTable/SubscriptionTr/columns/PayingType/PayingTypeSelect';

interface PayingTypeProps {
    subscription: SubscriptionDto;
}

export const PayingType = memo((props: PayingTypeProps) => {
    const {subscription} = props;

    // const locale = (router.locale as Locale) || Locale.ko;

    /* 태그들로 표시해 줄 것: 연, 고정, 사용량, 크레딧, 1인당 */
    // TODO: "과금 방식" 이거 행에서 직접 사용자가 수정 가능하고,
    //  이렇게 '사용자편집' 된 billingType 을
    //  subscription 엔티티에 저장해둘 수 있으면 좋겠다.
    //  그리고 사용자에게 보여줄 때 우선순위는
    //  '크롤러가 발견해온거' (크롤러가 발견해온건 걍 편집 더이상 안되게 ui 처리) > '사용자편집' > '인보이스로부터 알아낸거'
    return <PayingTypeSelect subscription={subscription} />;
});
PayingType.displayName = 'PayingType';
