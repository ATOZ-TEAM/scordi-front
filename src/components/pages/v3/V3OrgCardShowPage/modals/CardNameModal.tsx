import React, {memo, useEffect, useRef} from 'react';
import {useRecoilState} from 'recoil';
import {useForm} from 'react-hook-form';
import {useModal} from '^components/pages/v3/share/modals/useModal';
import {ModalTopbar} from '^components/pages/v3/share/modals/ModalTopbar';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {inputCardNameModal, inputCardHoldingMemeberModal, createCreditCardDtoAtom, currentCreditCardAtom} from './atom';
import {cardIdParamState, orgIdParamState, useRouterIdParamState} from '^atoms/common';
import {creditCardApi} from '^api/credit-cards.api';
import {useToast} from '^hooks/useToast';
import {ModalLikeBottomBar} from '../../layouts/V3ModalLikeLayout.mobile/ModalLikeBottomBar';
import {SkipButton} from '^v3/V3OrgCardShowPage/modals/SkipButton';

export const CardNameModal = memo(() => {
    const {Modal, close, isShow} = useModal(inputCardNameModal);
    const {open: openInputCardHoldingMemeberModal} = useModal(inputCardHoldingMemeberModal);
    const [createCreditCardDto, setCreateCreditCardDto] = useRecoilState(createCreditCardDtoAtom);
    const [currentCreditCard, setCurrenCreditCard] = useRecoilState(currentCreditCardAtom);
    const orgId = useRouterIdParamState('orgId', orgIdParamState);
    const cardId = useRouterIdParamState('cardId', cardIdParamState);
    const form = useForm();
    const {toast} = useToast();

    useEffect(() => {
        if (!isShow) {
            form.reset();
        }

        const cardNameInput = document.querySelector('input[name="cardName"]') as HTMLInputElement;
        cardNameInput?.focus();

        form.setValue('cardName', currentCreditCard.name);
    }, [isShow]);

    // 카드 이름 등록 함수
    const onSubmit = () => {
        const cardName = form.getValues('cardName');
        if (!cardName) return;

        setCreateCreditCardDto({...createCreditCardDto, name: cardName});
    };

    // 카드 이름 수정 함수
    const onUpdate = async () => {
        const cardName = form.getValues('cardName');
        if (!cardName) return;

        const datas = await creditCardApi.update(orgId, cardId, {
            name: cardName,
        });

        if (datas) {
            setCurrenCreditCard(datas.data);
            close();
            toast.success('변경되었습니다.');
        }
    };

    return (
        <Modal wrapperClassName="modal-right" className="p-0 max-w-none sm:max-w-[32rem] z-50">
            <ModalTopbar backBtnOnClick={close} topbarPosition="sticky" />
            <MobileSection.Padding>
                <p className="pt-10 mb-4">{cardId ? '카드 수정하기' : '새로운 카드 등록하기'}</p>
                <h2 className="h1 leading-tight mb-10">
                    카드를 구분할 수 있는 <br /> 별칭을 입력해주세요
                </h2>
                <SkipButton currentModal="cardName" isModify={!!cardId} />

                {/* 카드 이름 input */}
                <input
                    {...form.register('cardName')}
                    name="cardName"
                    type="text"
                    placeholder="광고비 카드"
                    className="input input-bordered w-full"
                />
            </MobileSection.Padding>
            <ModalLikeBottomBar>
                {cardId ? (
                    <button onClick={onUpdate} className="btn-modal">
                        확인
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            onSubmit();
                            openInputCardHoldingMemeberModal();
                        }}
                        className="btn-modal"
                    >
                        다음
                    </button>
                )}
            </ModalLikeBottomBar>
        </Modal>
    );
});
