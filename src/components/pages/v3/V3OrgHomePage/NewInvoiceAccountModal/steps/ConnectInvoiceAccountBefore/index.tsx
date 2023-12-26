import React, {memo} from 'react';
import {GoogleComplianceDisclosureTag} from '^components/GoogleCompliance';
import {useTranslation} from 'next-i18next';
import {useSetRecoilState} from 'recoil';
import {connectInvoiceAccountCodeAtom} from '^v3/share/OnboardingFlow/steps/ConnectInvoiceAccountBeforeLoad/atom';
import {connectInvoiceAccountStatus, InvoiceAccount} from '^v3/V3OrgHomePage/NewInvoiceAccountModal/atom';
import {GoogleLoginBtn} from '^components/pages/UsersLogin/GoogleLoginBtn';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {googleOauthClientId} from '^api/tasting.api/gmail/constant';

export const ConnectInvoiceAccountBefore = memo(() => {
    const setCode = useSetRecoilState(connectInvoiceAccountCodeAtom);
    const setConnectStatus = useSetRecoilState(connectInvoiceAccountStatus);
    const {t} = useTranslation('org-home');

    const onClick = (code: string) => {
        setCode(code);
        setConnectStatus(InvoiceAccount.isLoading);
    };

    return (
        <>
            <h3 className="font-bold text-2xl">{t('newInvoiceAccountModal.title')}</h3>
            <p className="py-4 text-lg" dangerouslySetInnerHTML={{__html: t('newInvoiceAccountModal.description')}} />
            <GoogleComplianceDisclosureTag feature={'gmail'} />

            <GoogleOAuthProvider clientId={googleOauthClientId}>
                <GoogleLoginBtn about="gmail" onCode={onClick} />
            </GoogleOAuthProvider>
        </>
    );
});