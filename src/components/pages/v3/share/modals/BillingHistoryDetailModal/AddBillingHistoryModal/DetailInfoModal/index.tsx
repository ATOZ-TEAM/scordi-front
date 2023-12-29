import React, {ChangeEvent, memo} from 'react';
import {ModalTopbar, useModal} from '^v3/share/modals';
import {
    billingHistoryIdState,
    createBillingHistoryAtom,
    detailInfoModalState,
    finishModalState,
    isDomesticState,
} from '^v3/share/modals/BillingHistoryDetailModal/AddBillingHistoryModal/atoms';
import {useBillingHistoryInModal} from '^v3/share/modals/BillingHistoryDetailModal/hook';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {FormControl} from '^components/util/form-control';
import {TextInput} from '^v3/share/modals/BillingHistoryDetailModal/AddBillingHistoryModal/share/TextInput';
import {ButtonGroupRadio} from '^components/util/form-control/inputs';
import {ModalLikeBottomBar} from '^v3/layouts/V3ModalLikeLayout.mobile/ModalLikeBottomBar';
import {AddBillingHistoryModalBtn} from '^v3/share/modals/BillingHistoryDetailModal/AddBillingHistoryModal/share/AddBillingHistoryModalBtn';
import {CreateMoneyRequestDto, CurrencyCode} from '^types/money.type';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {selectedCurrencyState} from '^v3/share/modals/BillingHistoryDetailModal/atom';
import {appBillingHistoryApi} from '^models/BillingHistory/api';
import {appIdState} from '^v3/V3OrgAppShowPage/atom';

export const DetailInfoModal = memo(() => {
    const {Modal, close} = useModal(detailInfoModalState);
    const {open: OpenFinishModal} = useModal(finishModalState);
    const {billingHistory} = useBillingHistoryInModal();
    const [createBillingHistory, setCreateBillingHistory] = useRecoilState(createBillingHistoryAtom);
    const selectedCurrency = useRecoilValue(selectedCurrencyState);
    const isDomestic = useRecoilValue(isDomesticState);
    const appId = useRecoilValue(appIdState);
    const setBillingHistoryId = useSetRecoilState(billingHistoryIdState);

    const onVATChange = (e: ChangeEvent<HTMLInputElement>) => {
        const moneyLike: CreateMoneyRequestDto = {
            text: `${e.target.value}원`,
            amount: Number(e.target.value),
            code: CurrencyCode.KRW,
            exchangeRate: 1,
            exchangedCurrency: isDomestic ? CurrencyCode.KRW : selectedCurrency.label,
        };
        setCreateBillingHistory((prev) => ({...prev, vat: moneyLike}));
    };

    const onClick = () => {
        if (!appId) return;

        // const req = appBillingHistoryApi.createV2(appId, createBillingHistory);
        //
        // req.then((res) => {
        //     setBillingHistoryId(res.data.id);
        //
        // });
        //
        // req.catch((e) => console.log(e));
        OpenFinishModal();
    };

    return (
        <Modal wrapperClassName="modal-right" className="p-0 max-w-none sm:max-w-[32rem]">
            <ModalTopbar
                backBtnOnClick={close}
                topbarPosition="sticky"
                title={billingHistory ? billingHistory.pageSubject : '결제 내역 등록'}
            />
            <MobileSection.Padding>
                <h2 className="h1 leading-tight mb-10 whitespace-pre-line">
                    새로운 결제 내역을 <br /> 등록합니다.
                </h2>
                <section className="flex flex-col gap-5">
                    <FormControl topLeftLabel="결제 승인 번호를 입력해주세요">
                        <TextInput
                            type="number"
                            onChange={(e) => setCreateBillingHistory((prev) => ({...prev, uid: e.target.value}))}
                        />
                    </FormControl>

                    <FormControl topLeftLabel="국내 또는 해외 결제 여부를 선택해주세요">
                        <ButtonGroupRadio
                            options={[
                                {label: '공제', value: true},
                                {label: '불공제', value: false},
                            ]}
                            onChange={(e) => setCreateBillingHistory((prev) => ({...prev, isVATDeductible: e.value}))}
                            defaultValue={createBillingHistory.isVATDeductible}
                        />
                    </FormControl>

                    <FormControl topLeftLabel="부가세를 입력해주세요">
                        <TextInput type="number" onChange={onVATChange} />
                    </FormControl>
                </section>
            </MobileSection.Padding>

            <ModalLikeBottomBar className="left-0">
                <AddBillingHistoryModalBtn onClick={onClick} />
            </ModalLikeBottomBar>
        </Modal>
    );
});
