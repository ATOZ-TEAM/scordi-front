import React, {memo} from 'react';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {ContentEmpty} from '^v3/V3OrgHomePage/mobile/ContentEmpty';

export const InvoiceAccountsPanel = memo(() => {
    return (
        <MobileSection.Item>
            <MobileSection.Padding>
                <MobileSection.Heading title="결제 수신 계정">
                    <div className="text-sm text-gray-500">
                        <div>계정 없음</div>
                    </div>
                </MobileSection.Heading>

                <ContentEmpty text="연결된 계정이 없어요" subtext="눌러서 계정 추가" onClick={console.log} />
            </MobileSection.Padding>
        </MobileSection.Item>
    );
});
