import React, {memo, useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {useModal} from '^components/pages/v3/share/modals/useModal';
import {ModalTopbar} from '^components/pages/v3/share/modals/ModalTopbar';
import {DefaultButton} from '^components/Button';
import {creditcardAtom, inputCardHoldingMemeberModal, selectAppModal} from './atom';
import {useRecoilState} from 'recoil';

export const CardHoldingMember = memo(() => {
    const {Modal, close, isShow} = useModal(inputCardHoldingMemeberModal);
    const {open: openSelectAppModal} = useModal(selectAppModal);
    const [creditCardData, setCreditCardData] = useRecoilState(creditcardAtom);
    const form = useForm();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isShow) {
            form.reset();
        }

        inputRef.current?.focus();
    }, [isShow]);

    const submitCardNumber = () => {
        // TODO: 완료되면 모든 모달 닫기
        // const cardHoldingMember = form.getValues('cardHoldingMember') ?? 1;
        // setCreditCardData({...creditCardData, holdingMemberId: cardHoldingMember});
    };

    return (
        <Modal wrapperClassName="modal-right" className="p-0 max-w-none sm:max-w-[32rem] z-50">
            <ModalTopbar backBtnOnClick={close} topbarPosition="sticky" />

            <div className="px-5 flex flex-col justify-start gap-10">
                <div className="py-5 pt-20">
                    <p className="mb-4">새로운 카드 등록하기</p>
                    <h2 className="h1 leading-tight">
                        카드를 소유하고 있는 사람의 <br /> 이름을 입력해주세요
                    </h2>
                </div>

                {/* 카드 소유자 input */}
                <div className="flex gap-3">
                    <input
                        {...form.register('cardHoldingMember')}
                        type="text"
                        placeholder="홍길동"
                        ref={inputRef}
                        className="input input-bordered w-full"
                    />
                </div>

                <DefaultButton
                    text="다음"
                    type="button"
                    onClick={() => {
                        openSelectAppModal();
                        submitCardNumber();
                    }}
                />
            </div>
        </Modal>
    );
});