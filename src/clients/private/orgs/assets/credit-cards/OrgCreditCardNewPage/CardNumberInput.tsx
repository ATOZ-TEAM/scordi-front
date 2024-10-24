import React, {memo} from 'react';
import {NumericTextInput} from '^clients/private/_components/inputs/NumericTextInput';
import {inputTextToCardNumberInShortFormat} from '^utils/input-helper';
import {FormControl} from '^clients/private/_components/inputs/FormControl';

interface CardNumberInputProps {
    defaultValue?: string;
    maxLength?: number;
    onChange?: (val: string) => any;
    className?: string;
    readOnly?: boolean;
}

export const CardNumberInput = (props: CardNumberInputProps) => {
    const {defaultValue, maxLength = 4, onChange, className = '', readOnly = false} = props;
    return (
        <NumericTextInput
            minLength={4}
            maxLength={maxLength}
            placeholder="●●●●"
            defaultValue={defaultValue}
            invalidMessage="번호가 너무 짧아요"
            className={`input input-underline !bg-slate-100 px-2 w-full ${className}`}
            onChange={(e) => {
                const val = inputTextToCardNumberInShortFormat(e);
                onChange && onChange(val);
            }}
            readOnly={readOnly}
        />
    );
};
