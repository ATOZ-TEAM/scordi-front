import React, {memo} from 'react';
import {useRecoilValue} from 'recoil';
import {displayCurrencyAtom} from '^components/pages/LandingPages/TastingPage/pageAtoms';
import {currencyFormat, getCurrencySymbol} from '^api/tasting.api/gmail/agent/parse-email-price';

interface PriceHeaderV2Props {
    totalPrice: number;
    billingCycleTypeText: string;
}

export const PriceHeaderV2 = memo((props: PriceHeaderV2Props) => {
    const displayCurrency = useRecoilValue(displayCurrencyAtom);
    const symbol = getCurrencySymbol(displayCurrency);
    const {totalPrice, billingCycleTypeText} = props;

    return (
        <p className="text-3xl font-bold mb-12">
            <small className="mr-1">{symbol}</small>
            <span>{currencyFormat(totalPrice, displayCurrency)}</span>

            <span className="ml-2 text-lg font-normal text-gray-500">/ {billingCycleTypeText}</span>
        </p>
    );
});
PriceHeaderV2.displayName = 'PriceHeaderV2';
