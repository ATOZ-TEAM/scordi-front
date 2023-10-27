import React, {memo} from 'react';
import {useModal} from '^components/pages/v3/share/modals/useModal';
import {ModalTopbar} from '^components/pages/v3/share/modals/ModalTopbar';
import {DefaultButton} from '^components/Button';
import {creditcardAtom, inputCardHoldingMemeberModal, selectAppModal} from '../atom';
import {useRecoilState, useRecoilValue} from 'recoil';
import {cardIdParamState, orgIdParamState, useRouterIdParamState} from '^atoms/common';
import {creditCardApi} from '^api/credit-crads.api';
import {useRouter} from 'next/router';
import {V3OrgCardDetailPageRoute} from '^pages/v3/orgs/[orgId]/cards/[cardId]';
import {CardAppList} from './CardAppList';
import {toast} from 'react-toastify';
import {selectedAppsAtom} from '../../atom';

export const SelectAppModal = memo(() => {
    const {Modal, close} = useModal(selectAppModal);
    const {close: closeInputCardHoldingMemberModal} = useModal(inputCardHoldingMemeberModal);
    const [creditCardData, setCreditCardData] = useRecoilState(creditcardAtom);
    const selectedApps = useRecoilValue(selectedAppsAtom);
    const orgId = useRouterIdParamState('orgId', orgIdParamState);
    const cardId = useRouterIdParamState('cardId', cardIdParamState);
    const router = useRouter();

    // 카드 연동 앱 등록 함수
    const submitCardNumber = () => {
        const productIds = selectedApps.map((app) => {
            return app.id;
        });
        setCreditCardData({...creditCardData, productIds: productIds});

        creditCardApi.create(orgId, creditCardData).then((res) => {
            router.push(V3OrgCardDetailPageRoute.path(orgId, res.data.id));
        });

        close();
        closeInputCardHoldingMemberModal();
    };

    // 카드 연동 앱 수정 함수
    const updateCardApps = async () => {
        if (!selectedApps) return;
        const productIds = selectedApps.map((app) => {
            return app.id;
        });

        const data = await creditCardApi.update(orgId, cardId, {productIds: productIds});

        if (data) {
            toast.success('앱 등록이 완료되었습니다.');
            setTimeout(() => {
                close();
            }, 2000);
        }
    };

    return (
        <Modal wrapperClassName="modal-right" className="p-0 max-w-none sm:max-w-[32rem] z-50">
            <ModalTopbar backBtnOnClick={close} topbarPosition="sticky" />

            <div className="px-5 flex flex-col justify-start gap-10">
                <div className="py-5 pt-20">
                    <p className="mb-4">새로운 카드 등록하기</p>
                    <h2 className="h1 leading-tight">
                        사용중인 서비스를
                        <br />
                        등록해주세요
                    </h2>
                </div>

                <CardAppList />
                {cardId ? (
                    <DefaultButton text="확인" type="button" onClick={updateCardApps} />
                ) : (
                    <DefaultButton text="완료" type="button" onClick={submitCardNumber} />
                )}
            </div>
        </Modal>
    );
});
