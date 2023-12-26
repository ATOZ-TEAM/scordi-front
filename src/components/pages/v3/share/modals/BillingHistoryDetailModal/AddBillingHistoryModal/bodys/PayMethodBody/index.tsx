import React, {memo, useState} from 'react';
import Select from 'react-select';
import {
    CardComponents,
    PayMethodComponents,
    selectStylesOptions,
} from '^v3/share/modals/BillingHistoryDetailModal/AddBillingHistoryModal/bodys/PayMethodBody/selectOpions';
import {UseFormReturn} from 'react-hook-form';
import {useCreditCardsOfOrganization} from '^models/CreditCard/hook';
import {CreditCardDto} from '^models/CreditCard/type';
import {useSetRecoilState} from 'recoil';
import {AddBillingHistoryState} from '^v3/share/modals/BillingHistoryDetailModal/atom';
import {FormControl} from '^components/util/form-control';
import {CreateBillingHistoryRequestDto} from '^models/BillingHistory/type';

interface PayMethodBodyProps {
    form: UseFormReturn<CreateBillingHistoryRequestDto>;
}
export const PayMethodBody = memo((props: PayMethodBodyProps) => {
    const {CreditCard} = useCreditCardsOfOrganization(true);
    const setAddBillingHistoryState = useSetRecoilState(AddBillingHistoryState);
    const {form} = props;

    // string 또는 string[] -> option 형태로 변경시켜주는 함수
    const getOption = (options: string | string[]) => {
        if (typeof options === 'string') {
            return [
                {
                    label: options,
                    name: options,
                },
            ];
        }

        return options.map((item) => {
            return {
                label: item,
                name: item,
            };
        });
    };

    // 카드 번호만 가져오는 함수
    const getCreditCard = (cards: CreditCardDto[]) => {
        if (!cards) return;

        return cards
            .map((card) => {
                const cardInfo = card.decryptSign();

                if (!cardInfo.number1 || cardInfo.number2 || cardInfo.number3 || cardInfo.number4) return;

                const cardNumber = cardInfo.number1 + cardInfo.number2 + cardInfo.number3 + cardInfo.number4;
                return {id: card.id, label: cardNumber, name: cardNumber};
            })
            .filter(Boolean);
    };

    return (
        <>
            {/*현재는 선택 option 카드뿐이라 주식 처리*/}
            <div className="hidden">
                <FormControl topLeftLabel="결제 수단">
                    <Select
                        components={PayMethodComponents()}
                        styles={selectStylesOptions}
                        options={getOption(['카드', '계좌이체', '무통장입금', '현금영수증', '크레딧'])}
                    />
                </FormControl>
            </div>

            <FormControl topLeftLabel="어떤 카드로 결제하셨나요?">
                <input className="hidden" {...form.register('creditCardId')} />
                <Select
                    placeholder="카드 선택하기"
                    components={CardComponents()}
                    styles={selectStylesOptions}
                    options={getCreditCard(CreditCard?.list || [])}
                    onChange={(e) => form.setValue('creditCardId', e.id)}
                />
            </FormControl>

            <FormControl topLeftLabel="언제 결제하셨나요?">
                <input
                    type="datetime-local"
                    className="input input-bordered w-full text-sm font-semibold text-neutral-500"
                    {...form.register('paidAt')}
                />
            </FormControl>
        </>
    );
});
