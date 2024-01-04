import React, {memo} from 'react';
import {ModalTopbar, useModal} from '^v3/share/modals';
import {
    finishModalState,
    memoModalState,
    memoState,
} from '^v3/share/modals/BillingHistoryDetailModal/NewBillingHistoryModal/atoms';
import {useBillingHistoryInModal} from '^v3/share/modals/BillingHistoryDetailModal/hook';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {Container} from '^v3/share/OnboardingFlow/Container';
import {CheckCircle} from '^components/react-icons/check-circle';
import {useRecoilValue} from 'recoil';
import {useNewBillingHistoryModal} from '^v3/share/modals/BillingHistoryDetailModal/NewBillingHistoryModal/NewBillingHistoryModalGroup/hook';
import {useBillingHistoriesV3} from '^models/BillingHistory/hook';
import {ModalLikeBottomBar} from '^v3/layouts/V3ModalLikeLayout.mobile/ModalLikeBottomBar';
import {useRouter} from 'next/router';
import {ModalButton} from '^v3/share/ModalButton';

export const FinishModal = memo(() => {
    const {Modal, close} = useModal(finishModalState);
    const {open: openMemoModal} = useModal(memoModalState);
    const memo = useRecoilValue(memoState);
    const {billingHistory} = useBillingHistoryInModal();
    const {modalGroupClose} = useNewBillingHistoryModal();

    const onClick = () => {
        modalGroupClose();
    };

    return (
        <Modal onClose={onClick} wrapperClassName="modal-right" className="p-0 max-w-none sm:max-w-[32rem]">
            <ModalTopbar
                backBtnOnClick={onClick}
                topbarPosition="sticky"
                title={billingHistory ? billingHistory.pageSubject : '결제 내역 등록'}
            />
            <MobileSection.Padding>
                <div className="py-28 flex flex-col">
                    <Container size="sm" className="flex justify-center mb-4">
                        <CheckCircle className="w-[60px]" color="#5E5FEE" />
                    </Container>

                    <Container size="lg" className="mb-10">
                        <div className="text-center">
                            <h3 className="font-bold text-3xl mb-4">결제 내역이 등록되었어요!</h3>
                        </div>
                    </Container>

                    <Container className="flex flex-col items-center">
                        <button onClick={openMemoModal} className="btn btn-sm text-scordi mb-3 w-fit px-3">
                            {memo ? memo : '메모 남기기'}
                        </button>
                    </Container>
                </div>
            </MobileSection.Padding>

            <ModalLikeBottomBar className="left-0">
                <ModalButton onClick={onClick} text="닫기" />
            </ModalLikeBottomBar>
        </Modal>
    );
});
