import React, {memo} from 'react';
import {
    changePriceCurrency,
    currencyFormat,
    getCurrencySymbol,
    Price,
} from '^api/tasting.api/gmail/agent/parse-email-price';
import {useRecoilValue} from 'recoil';
import {displayCurrencyAtom} from './pageAtoms';

interface EmailParsedTableRowProps {
    date: Date;
    serviceName: string;
    title: string;
    attachments: {
        uid: string;
        fileName: string;
        url: string;
    }[];
    sender: string;
    price: Price;
}

export const EmailParsedTableRow = memo((props: EmailParsedTableRowProps) => {
    const {date, serviceName, title, attachments, sender, price} = props;
    const displayCurrency = useRecoilValue(displayCurrencyAtom);
    const symbol = getCurrencySymbol(displayCurrency);
    const amount = changePriceCurrency(price.amount, price.currency, displayCurrency);

    return (
        <tr>
            <td>
                <p className="text-gray-700">{date.toLocaleString()}</p>
            </td>
            <td>
                <div className="flex items-center space-x-3">
                    {/*<div className="avatar">*/}
                    {/*    <div className="mask mask-squircle w-12 h-12">*/}
                    {/*        <img src="/tailwind-css-component-profile-5@56w.png" alt="Avatar Tailwind CSS Component" />*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div>
                        <div className="font-bold capitalize">{serviceName}</div>
                        <div className="text-sm opacity-50">{sender}</div>
                    </div>
                </div>
            </td>
            <td>
                <p className="mb-1.5">{title}</p>
                <div className="flex space-x-1">
                    {attachments.map((attachment, i) => (
                        <span key={i} className="badge badge-ghost badge-sm">
                            {attachment.fileName}
                        </span>
                    ))}
                </div>
            </td>
            <td>
                <p className="text-right">
                    {price.hide ? (
                        <span className="text-gray-500">-</span>
                    ) : (
                        <>
                            <small className="mr-1">{symbol}</small>
                            <span>{currencyFormat(amount || 0, displayCurrency)}</span>
                        </>
                    )}
                </p>
            </td>
            <th>{/*<button className="btn btn-ghost btn-xs">details</button>*/}</th>
        </tr>
    );
});
