import React, {memo} from 'react';
import {Avatar} from '^components/Avatar';
import {currencyFormat, getCurrencySymbol} from '^api/tasting.api/gmail/agent/parse-email-price';
import {useRecoilValue} from 'recoil';
import {displayCurrencyAtom} from '^components/pages/LandingPages/TastingPage/pageAtoms';
import {mm_dd} from '^utils/dateTime';
import {BillingHistoryDto} from '^models/BillingHistory/type';

interface HistoryItemProps {
    history: BillingHistoryDto;
}

export const HistoryItem = memo((props: HistoryItemProps) => {
    const {history} = props;
    const displayCurrency = useRecoilValue(displayCurrencyAtom);
    const symbol = getCurrencySymbol(displayCurrency);

    const subscription = history.subscription;
    const product = subscription.product;

    const price = history.getPriceIn(displayCurrency);

    return (
        <li>
            <div className="!w-auto gap-4 px-4 py-3 -mx-4 hover:bg-neutral btn-like no-selectable">
                <Avatar src={product.image} className="w-9 h-9 outline outline-offset-1 outline-slate-100" />

                <div className="flex-1">
                    <p className="leading-none font-light text-xs underline">{mm_dd(history.sortKey)}</p>
                    <p className="font-semibold text-gray-800">{product.nameEn}</p>
                </div>

                <p className="text-[16px]">
                    <small className="mr-0.5">{symbol}</small>
                    <span className="font-semibold">{currencyFormat(price, displayCurrency)}</span>
                </p>
            </div>
        </li>
    );
});
