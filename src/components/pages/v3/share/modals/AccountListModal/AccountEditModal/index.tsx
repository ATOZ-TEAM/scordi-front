import React, {memo, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {plainToInstance} from 'class-transformer';
import {UnSignedAccountFormData} from '^models/Account/types';
import {accountApi} from '^models/Account/api';
import {useAccounts} from '^models/Account/hook';
import {AccountForm} from '../form';
import {useAccountEditModal} from './hook';
import {ModalTopbar} from '^v3/share/modals/ModalTopbar';
import {useToast} from '^hooks/useToast';

export const AccountEditModal = memo(() => {
    const form = useForm<UnSignedAccountFormData>();
    const {isShow, Modal, hide, data} = useAccountEditModal();
    const {fetchAllAccountsBy, reload: refreshAccountList} = useAccounts();
    const {product, account} = data;
    const {toast} = useToast();

    // 키보드 이벤트 바인딩
    useEffect(() => {
        const keyClicked = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onBack();
            return e;
        };
        window.addEventListener('keyup', keyClicked);
        return () => {
            window.removeEventListener('keyup', keyClicked);
        };
    }, []);

    const onBack = () => hide();

    const onSubmit = (dto: UnSignedAccountFormData) => {
        if (!account) return;
        const {organizationId, id} = account;

        const {productId} = dto;
        if (!productId) {
            alert('무언가 잘못되었습니다. 스코디팀에게 문의해주세요!');
            return;
        }
        const formData = plainToInstance(UnSignedAccountFormData, dto).toUpdateDto();
        const req = accountApi.update(organizationId, id, formData);
        req.then(() => {
            toast.success('저장되었습니다.');
            refreshAccountList();
            fetchAllAccountsBy({productId}, true).finally(() => onBack());
        });
        req.catch((err) => toast.error(err.response.data.message));
    };

    return (
        <Modal wrapperClassName="modal-right" className="p-0 max-w-none sm:max-w-[32rem]">
            <ModalTopbar title="계정 정보 변경" backBtnOnClick={onBack} topbarPosition="sticky" />
            <AccountForm form={form} isShow={isShow} account={account} product={product} onSubmit={onSubmit} />
        </Modal>
    );
});
