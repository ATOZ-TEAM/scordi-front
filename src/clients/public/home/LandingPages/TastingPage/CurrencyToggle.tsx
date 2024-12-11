import React, {memo} from 'react';
import {useRecoilState} from 'recoil';
import {displayCurrencyAtom} from './pageAtoms';
import {CurrencyCode} from '^models/Money';
import {ReactNodeElement} from '^types/global.type';

interface CurrencyToggleProps {
    leftText?: ReactNodeElement;
    rightText?: ReactNodeElement;
    className?: string;
}

export const CurrencyToggle = memo((props: CurrencyToggleProps) => {
    const {leftText, rightText, className = ''} = props;
    const [displayCurrency, setDisplayCurrency] = useRecoilState(displayCurrencyAtom);

    return (
        <div className="flex justify-center">
            <div className="form-control">
                <label className={`cursor-pointer label gap-3 ${className}`}>
                    {leftText ?? <span className="label-text">{CurrencyCode.USD}</span>}

                    <input
                        type="checkbox"
                        className={`toggle ${displayCurrency === CurrencyCode.KRW ? 'bg-scordi' : 'bg-gray-300'}`}
                        checked={displayCurrency === CurrencyCode.KRW}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setDisplayCurrency(checked ? CurrencyCode.KRW : CurrencyCode.USD);
                        }}
                    />

                    {rightText ?? <span className="label-text">{CurrencyCode.KRW}</span>}
                </label>
            </div>
        </div>
    );
});
