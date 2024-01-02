import React, {memo} from 'react';
import {ModalTopbar, useModal} from '^v3/share/modals';
import {newFormForBillingInfoModalAtom} from '^v3/share/modals/NewSubscriptionModalManually/atom';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {FormControl} from '^components/util/form-control';
import {ModalLikeBottomBar} from '^v3/layouts/V3ModalLikeLayout.mobile/ModalLikeBottomBar';
import {CurrentBillingAmountCurrencyModal} from './CurrentBillingAmountCurrencyModal';
import {CurrentBillingAmountInput} from './CurrentBillingAmountInput';
import {NextButton} from '^v3/share/modals/NewSubscriptionModalManually/FormForBillingInfoModal/NextButton';
import {BillingCycleOptionRadio} from '^v3/share/modals/NewSubscriptionModalManually/FormForBillingInfoModal/BillingCycleOptionRadio';
import {IsPerUserCheckbox} from '^v3/share/modals/NewSubscriptionModalManually/FormForBillingInfoModal/IsPerUserCheckbox';

export const FormForBillingInfoModal = memo(function FormForBillingInfoModal() {
    const {Modal, close} = useModal(newFormForBillingInfoModalAtom);

    return (
        <>
            <Modal wrapperClassName="modal-right" className="p-0 max-w-none sm:max-w-[32rem]">
                <ModalTopbar title="새로운 구독 추가" backBtnOnClick={close} topbarPosition="sticky" />

                <MobileSection.Padding>
                    <div>
                        <h3 className="font-bold text-2xl pt-5 mb-10">결제 정보 입력</h3>

                        <div className="w-full flex flex-col gap-4">
                            {/*<FormControl topLeftLabel="과금방식">*/}
                            {/*    <ButtonGroupRadio*/}
                            {/*        onChange={(o) => form.setValue('billingCycleOption', o.value)}*/}
                            {/*        options={[*/}
                            {/*            {label: '정해진 금액이에요', value: BillingCycleOptions.Monthly},*/}
                            {/*            {label: '사용량에 따라 달라요', value: BillingCycleOptions.Onetime},*/}
                            {/*        ]}*/}
                            {/*        defaultValue={formData.billingCycleOption ?? BillingCycleOptions.Monthly}*/}
                            {/*    />*/}
                            {/*</FormControl>*/}

                            <FormControl
                                topLeftLabel="결제주기"
                                bottomLeftHint="반복 지불이 아니면 '일회성'으로 체크해주세요"
                            >
                                <BillingCycleOptionRadio />
                            </FormControl>

                            <FormControl>
                                <IsPerUserCheckbox />
                            </FormControl>

                            <FormControl topLeftLabel="단위 금액">
                                <CurrentBillingAmountInput />
                            </FormControl>
                        </div>
                    </div>
                </MobileSection.Padding>

                <ModalLikeBottomBar>
                    <NextButton />
                </ModalLikeBottomBar>
            </Modal>

            <CurrentBillingAmountCurrencyModal />
        </>
    );
});
