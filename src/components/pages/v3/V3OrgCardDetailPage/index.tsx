import React, {memo, useEffect} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import CryptoJS from 'crypto-js';
import {MobileSection} from '../share/sections/MobileSection';
import {V3ModalLikeLayoutMobile} from '../layouts/V3ModalLikeLayout.mobile';
import {InformationPanel} from './InformationPanel';
import {BsPlus} from 'react-icons/bs';
import {useModal} from '../share/modals/useModal';
import {currentCreditCardAtom, updateCreditCardDtoAtom} from '../V3OrgCardListPage/modals/atom';
import {ContentEmpty} from '../V3OrgHomePage/mobile/ContentEmpty';
import {creditCardApi} from '^api/credit-cards.api';
import {cardIdParamState, orgIdParamState, useRouterIdParamState} from '^atoms/common';
import {cardSign} from '^config/environments';
import {SubscriptionItem} from '../V3OrgHomePage/mobile/SubscriptionItem';
import {plainToInstance} from 'class-transformer';
import {useRouter} from 'next/router';
import {V3OrgCardListPageRoute} from '^pages/v3/orgs/[orgId]/cards';
import {CardFormModalGroup} from '../V3OrgCardListPage/modals/CardFormModalGroup';
import {inputCardNumberModal} from '../V3OrgCardListPage/modals/CardNumberModal/atom';
import {selectCardCompanyModal} from '../V3OrgCardListPage/modals/CardCompanyModal/atom';
import {inputCardNameModal} from '../V3OrgCardListPage/modals/CardNameModal/atom';
import {inputCardHoldingMemberModal} from '../V3OrgCardListPage/modals/CardHoldingMemberModal/atom';
import {selectAppModal, subscriptionsAtom} from '../V3OrgCardListPage/modals/SelectAppModal/atom';
import {creditCardSignAtom} from '^models/CreditCard/atom';
import {UnSignedCreditCardFormData} from '^models/CreditCard/credit-cards.type';

export const V3OrgCardDetailPage = memo(() => {
    const cardNumberModal = useModal(inputCardNumberModal);
    const cardNameModal = useModal(inputCardNameModal);
    const cardHoldingMemberModal = useModal(inputCardHoldingMemberModal);
    const cardCompanyModal = useModal(selectCardCompanyModal);
    const {open: openSelectAppModal, isShow: isSelectAppModal} = useModal(selectAppModal);
    const [subscriptions, setSubscriptions] = useRecoilState(subscriptionsAtom);
    const setCurrentCreditCard = useSetRecoilState(currentCreditCardAtom);
    const setCardDetailInfo = useSetRecoilState(updateCreditCardDtoAtom);
    const setCardSignInfo = useSetRecoilState(creditCardSignAtom);
    const orgId = useRecoilValue(orgIdParamState);
    const cardId = useRecoilValue(cardIdParamState);
    const router = useRouter();

    useEffect(() => {
        if (!cardId && isNaN(cardId)) return;

        creditCardApi.show(orgId, cardId).then((res) => {
            setCurrentCreditCard(res.data);
            const updateDto = plainToInstance(UnSignedCreditCardFormData, res.data).toUpdateDto();
            setCardDetailInfo(updateDto);
            setSubscriptions(res.data.subscriptions ?? []);
            const json = CryptoJS.AES.decrypt(res.data.sign, cardSign).toString(CryptoJS.enc.Utf8);
            const toString = JSON.parse(json);
            setCardSignInfo(toString);
        });
    }, [orgId, cardId]);

    const backBtnOnclick = () => {
        router.push(V3OrgCardListPageRoute.path(orgId));
    };

    const isModalClose = () => {
        if (
            cardNumberModal.isShow ||
            cardNameModal.isShow ||
            cardHoldingMemberModal.isShow ||
            cardCompanyModal.isShow ||
            isSelectAppModal
        )
            return false;
        else return true;
    };

    return (
        <V3ModalLikeLayoutMobile title="카드" backBtnOnClick={backBtnOnclick}>
            <MobileSection.List>
                {/* 카드정보 */}
                <InformationPanel />
                <div className="bg-white">
                    <MobileSection.Padding>
                        {subscriptions.length ? (
                            subscriptions.map((subscription, i) => <SubscriptionItem key={i} item={subscription} />)
                        ) : (
                            <ContentEmpty
                                text="등록된 앱이 없어요"
                                subtext="눌러서 앱 추가"
                                onClick={openSelectAppModal}
                            />
                        )}
                    </MobileSection.Padding>
                </div>

                {isModalClose() && (
                    <button className="btn btn-lg btn-scordi btn-circle btn-floating">
                        <BsPlus size={48} onClick={openSelectAppModal} />
                    </button>
                )}
            </MobileSection.List>
            <CardFormModalGroup />
        </V3ModalLikeLayoutMobile>
    );
});
