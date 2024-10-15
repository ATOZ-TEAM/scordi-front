import React, {memo, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {ReactNodeLike} from 'prop-types';
import {orgIdParamState} from '^atoms/common';
import {OrgSettingsInformationPageRoute} from '^pages/orgs/[id]/settings';
import {OrgSettingsLayout} from '^clients/private/_layouts/OrgSettingsLayout';
import {SelectDropdown} from '^v3/share/Select';
import {useCurrentOrg} from '^models/Organization/hook';
import {ChangeOrgInformationModal} from './ChangeOrgInformationModal';
import {useRouter} from 'next/router';
import {OrgSettingsPaymentPageRoute} from '^pages/orgs/[id]/settings/payments';

export const OrgSettingsInformationPage = memo(function OrgSettingsInformationPage() {
    const orgId = useRecoilValue(orgIdParamState);
    const {currentOrg} = useCurrentOrg(orgId);
    const [isChangeOrgInformationModalOpened, setIsChangeOrgInformationModalOpened] = useState(false);
    const router = useRouter();

    return (
        <OrgSettingsLayout
            breadcrumbPath={{
                text: '워크스페이스 정보',
                active: true,
                href: OrgSettingsInformationPageRoute.path(orgId),
            }}
        >
            <ChangeOrgInformationModal
                isOpened={isChangeOrgInformationModalOpened}
                onClose={() => setIsChangeOrgInformationModalOpened(false)}
            />
            <OrgSettingsListItem
                title={'기본'}
                buttonAction={() => setIsChangeOrgInformationModalOpened(true)}
                listItems={[
                    {title: '워크스페이스명', desc: currentOrg?.name},
                    {
                        title: '주소',
                        desc: currentOrg?.address ? (
                            `${currentOrg?.address} ${currentOrg?.addressDetail}`
                        ) : (
                            <span className={'text-gray-400'}>주소를 등록해주세요</span>
                        ),
                    },
                    {title: '멤버', desc: `${currentOrg?.memberCount}명`},
                ]}
            />
            <OrgSettingsListItem
                title={'결제'}
                buttonAction={() => router.push(OrgSettingsPaymentPageRoute.path(orgId))}
                listItems={[
                    {title: '구독중인 플랜', desc: 'scordi 무료 체험'},
                    {title: '다음 결제일', desc: '-'},
                ]}
            />
            <div className={'pt-4 pb-12'}>
                <div className={'flex justify-start my-4'}>
                    <div className={'font-bold'}>워크스페이스 설정</div>
                </div>
                <div className={'flex justify-start items-center my-4'}>
                    <div className={'font-bold text-gray-600 w-40'}>언어 설정</div>
                    <SelectDropdown
                        placeholder="언어를 선택해주세요."
                        options={[{value: 'kr', text: '한국어', selected: true}]}
                        onChange={() => null}
                    />
                </div>
            </div>
        </OrgSettingsLayout>
    );
});

interface OrgSettingsListItemProps {
    title: string;
    buttonAction: () => void;
    listItems: {title: string; desc: ReactNodeLike}[];
}

const OrgSettingsListItem = memo(function (props: OrgSettingsListItemProps) {
    const {title, buttonAction, listItems} = props;
    return (
        <div className={'pt-4 pb-12'}>
            <div className={'flex justify-between items-center'}>
                <div className={'font-bold'}>{title}</div>
                <div className={'text-blue-500 cursor-pointer'} onClick={buttonAction}>
                    변경
                </div>
            </div>
            {listItems.map((item, i) => (
                <div key={i} className={'flex justify-start items-center my-4'}>
                    <div className={'font-bold text-gray-500 w-40'}>{item.title}</div>
                    <div>{item.desc}</div>
                </div>
            ))}
        </div>
    );
});