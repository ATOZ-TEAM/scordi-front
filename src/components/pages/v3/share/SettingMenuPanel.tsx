import React, {memo} from 'react';
import {ActiveLinkTo} from '^v3/share/ActiveLinkTo';
import {orgIdParamState, useRouterIdParamState} from '^atoms/common';
import {V3OrgSettingsOrgPageRoute} from '^pages/v3/orgs/[orgId]/settings/org';
import {V3OrgSettingsBillingPageRoute} from '^pages/v3/orgs/[orgId]/settings/billing';
import {V3OrgSettingsMembersPageRoute} from '^pages/v3/orgs/[orgId]/settings/members';
import {HiOutlineBuildingOffice2, HiOutlineCreditCard, HiOutlineUserGroup} from 'react-icons/hi2';

export const V3OrgSettingsMenuPanel = memo(() => {
    const orgId = useRouterIdParamState('orgId', orgIdParamState);

    return (
        <ul className="menu bg-base-100 w-full shadow-lg py-8 px-5 rounded-box">
            <li className="mb-7">
                <span className="p-0 text-lg font-semibold !bg-white !text-gray-900">제로원리퍼블릭</span>
            </li>
            <li>
                <ActiveLinkTo href={V3OrgSettingsOrgPageRoute.path(orgId)} className="mb-0.5">
                    <HiOutlineBuildingOffice2 />
                    <span>회사 정보</span>
                </ActiveLinkTo>
            </li>
            <li>
                <ActiveLinkTo href={V3OrgSettingsBillingPageRoute.path(orgId)} className="mb-0.5">
                    <HiOutlineCreditCard />
                    <span>결제 관리</span>
                </ActiveLinkTo>
            </li>
            <li>
                <ActiveLinkTo href={V3OrgSettingsMembersPageRoute.path(orgId)} className="mb-0.5">
                    <HiOutlineUserGroup />
                    <span>멤버 관리</span>
                </ActiveLinkTo>
            </li>
        </ul>
    );
});
