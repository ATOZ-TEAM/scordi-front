import {atom} from 'recoil';
import React, {memo} from 'react';
import {useModal} from '^v3/share/modals/useModal';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {BillingHistoriesPageBody} from '../BillingHistoriesPageBody';
import {ModalLikeTopbar} from '^v3/layouts/V3ModalLikeLayout.mobile/ModalLikeTopbar';

export const billingHistoriesPayModal = {
    isShowAtom: atom({
        key: 'v3/billingHistoriesPageModalIsShow',
        default: false,
    }),
    popStateSyncKey: 'billingHistoriesPageModal',
};

export const BillingHistoriesPageModal = memo(() => {
    const {isShow, close, Modal, CloseButton} = useModal(billingHistoriesPayModal);

    return (
        <Modal wrapperClassName="modal-right" className="p-0 max-w-none sm:max-w-[32rem]">
            <ModalLikeTopbar backBtnOnClick={close} topbarPosition="sticky" />
            <MobileSection.List>{isShow && <BillingHistoriesPageBody />}</MobileSection.List>
        </Modal>
    );
});
