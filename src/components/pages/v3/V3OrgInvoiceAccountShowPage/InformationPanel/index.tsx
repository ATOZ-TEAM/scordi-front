import React, {memo} from 'react';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {useCurrentInvoiceAccount} from '^v3/V3OrgInvoiceAccountShowPage/atom';
import {Avatar2} from '^components/Avatar';

export const InformationPanel = memo(() => {
    const {currentInvoiceAccount: invoiceAccount, isLoading} = useCurrentInvoiceAccount();

    return (
        <MobileSection.Item>
            <MobileSection.Padding>
                <div className="w-full h-[40px]" />
                {isLoading ? (
                    <p className="text-center">loading ...</p>
                ) : (
                    <div className="flex gap-4 items-center" onClick={() => console.log(invoiceAccount)}>
                        <Avatar2
                            src={invoiceAccount?.image || invoiceAccount?.providerImg}
                            size={10}
                            className="bg-gray-100 p-2"
                        />

                        <div className="flex-1">
                            <p className="text-[16px]">{invoiceAccount?.email}</p>
                            <p className="text-[13px] text-gray-500">{invoiceAccount?.provider}</p>
                        </div>
                    </div>
                )}
            </MobileSection.Padding>
        </MobileSection.Item>
    );
});
