import React, {Dispatch, FormEvent, memo, useEffect, useState} from 'react';
import {UseFormReturn} from 'react-hook-form';
import {useRecoilValue} from 'recoil';
import {CreditCardSecretInfo, UnSignedCreditCardFormData} from '^models/CreditCard/type';
import {cardIdParamState, currentCreditCardAtom} from '^models/CreditCard/atom';

interface InputCardNumberProps {
    form: UseFormReturn<UnSignedCreditCardFormData>;
    setDisabled?: Dispatch<React.SetStateAction<boolean>>;
}

export const InputCardNumber = memo((props: InputCardNumberProps) => {
    const {form, setDisabled} = props;
    const [cardInfo, setCardInfo] = useState<CreditCardSecretInfo>();
    const cardId = useRecoilValue(cardIdParamState);

    // Detail page 에서 모달 띄울 시 존재함.
    const currentCreditCard = useRecoilValue(currentCreditCardAtom);

    // 만약 수정 중인 경우 form에 기본 값을 세팅합니다.
    useEffect(() => {
        if (!currentCreditCard?.numbers) return;

        const decrypted = currentCreditCard.decryptSign();
        setCardInfo(decrypted);
    }, [currentCreditCard]);

    useEffect(() => {
        const number1 = document.querySelector('input[name="number1"]') as HTMLInputElement;
        !number1.value && number1.focus();

        if (!cardInfo || !cardId || isNaN(cardId)) return;

        form.setValue('number1', cardInfo.number1);
        form.setValue('number2', cardInfo.number2);
        form.setValue('number3', cardInfo.number3);
        form.setValue('number4', cardInfo.number4);
    }, [cardInfo, cardId]);

    const moveNextInput = (currentPart: number, value: string) => {
        if (value.length === 4 && currentPart < 4) {
            const nextPart = currentPart + 1;
            const nextInput = document.querySelector(`input[name="number${nextPart}"]`) as HTMLInputElement;
            nextInput && nextInput.focus();
        }

        if (value.length === 4 && currentPart === 4) {
            const lastInput = document.querySelector('input[name="number4"]') as HTMLInputElement;
            lastInput && lastInput.blur();
        }

        const cardNum1 = form.getValues('number1');
        const cardNum2 = form.getValues('number2');
        const cardNum3 = form.getValues('number3');
        const cardNum4 = form.getValues('number4');

        if (!cardNum1 || !cardNum2 || !cardNum3 || !cardNum4) {
            if (setDisabled) setDisabled(true);
            return;
        }
        if (setDisabled) setDisabled(false);
    };

    const maxLength = (e: FormEvent<HTMLInputElement>) => {
        if (e.currentTarget.value.length > e.currentTarget.maxLength) {
            e.currentTarget.value = e.currentTarget.value.slice(0, e.currentTarget.maxLength);
        }
    };

    return (
        <div>
            <div className="flex gap-3 mb-3">
                <input
                    {...form.register('number1')}
                    name="number1"
                    type="number"
                    placeholder="● ● ● ●"
                    maxLength={4}
                    defaultValue={cardInfo?.number1 ?? ''}
                    className="input input-bordered w-full placeholder:text-[0.5rem]"
                    onChange={(e) => moveNextInput(1, e.target.value)}
                    onInput={(e) => maxLength(e)}
                />
                <input
                    {...form.register('number2')}
                    type="number"
                    placeholder="● ● ● ●"
                    maxLength={4}
                    defaultValue={cardInfo?.number2 ?? ''}
                    className="input input-bordered w-full placeholder:text-[0.5rem]"
                    onChange={(e) => moveNextInput(2, e.target.value)}
                    onInput={(e) => maxLength(e)}
                />
                <input
                    {...form.register('number3')}
                    type="number"
                    placeholder="● ● ● ●"
                    maxLength={4}
                    defaultValue={cardInfo?.number3 ?? ''}
                    className="input input-bordered w-full placeholder:text-[0.5rem]"
                    onChange={(e) => moveNextInput(3, e.target.value)}
                    onInput={(e) => maxLength(e)}
                />
                <input
                    {...form.register('number4')}
                    type="number"
                    placeholder="● ● ● ●"
                    maxLength={4}
                    defaultValue={cardInfo?.number4 ?? ''}
                    className="input input-bordered w-full placeholder:text-[0.5rem]"
                    onChange={(e) => moveNextInput(4, e.target.value)}
                    onInput={(e) => maxLength(e)}
                />
            </div>
        </div>
    );
});