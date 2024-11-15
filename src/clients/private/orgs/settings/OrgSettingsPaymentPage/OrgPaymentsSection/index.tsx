import React, {memo, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useScordiPaymentsInSettingPage} from '^models/_scordi/ScordiPayment/hook';
import {EmptyTable} from '^clients/private/_components/table/EmptyTable';
import {SettingsPaymentSection} from '../SettingsPaymentSection';
import {ScordiPaymentHeader} from './ScordiPaymentHeader';
import {ScordiPaymentItem, ScordiPaymentItemUIType} from './ScordiPaymentItem';
import {LinkTo} from '^components/util/LinkTo';
import {New_SaaS_Request_Form_Url} from '^config/constants';
import {IoIosHelpCircle} from 'react-icons/io';
import {channelTalkEnv} from '^config/environments';

interface OrgPaymentsSectionProps {
    orgId: number;
}

export const OrgPaymentsSection = memo((props: OrgPaymentsSectionProps) => {
    const {orgId} = props;
    const router = useRouter();
    const {isLoading, result, search, isEmptyResult} = useScordiPaymentsInSettingPage();
    const [uiVersion, setUiVersion] = useState<ScordiPaymentItemUIType>('notion');

    useEffect(() => {
        if (!router.isReady) return;
        if (!orgId || isNaN(orgId)) return;

        search({
            order: {id: 'DESC'},
            itemsPerPage: 0,
        });
    }, [orgId, router.isReady]);

    const switchUIMode = () => {
        setUiVersion((_v) => (_v === 'default' ? 'notion' : 'default'));
    };

    return (
        <SettingsPaymentSection
            title={
                <span>
                    결제 환불 <span onClick={switchUIMode}>내</span>역
                </span>
            }
            right={
                <div>
                    <LinkTo
                        className="flex items-center gap-2 cursor-pointer text-14 link link-hover text-gray-400 hover:text-gray-500 transition py-1 group"
                        href={channelTalkEnv.url}
                        target="_blank"
                        displayLoading={false}
                    >
                        <IoIosHelpCircle fontSize={18} className="relative top-[0px]" />
                        <span>취소/환불을 원하시나요?</span>
                    </LinkTo>
                </div>
            }
            isLoading={isLoading}
        >
            {isEmptyResult ? (
                <EmptyTable message="결제/환불 내역이 없어요." />
            ) : (
                <div className="grid grid-cols-1">
                    <ScordiPaymentHeader version={uiVersion} />

                    {result.items.map((scordiPayment, i) => (
                        <ScordiPaymentItem
                            key={i}
                            version={uiVersion}
                            scordiPayment={scordiPayment}
                            isLast={result.items.length === i + 1}
                        />
                    ))}
                </div>
            )}
        </SettingsPaymentSection>
    );
});
OrgPaymentsSection.displayName = 'OrgPaymentsSection';
