import {memo, useState} from 'react';
import {FaBell, FaPlus} from 'react-icons/fa6';
import {useCurrentUser} from '^models/User/hook';
import {WorkspaceDropdown} from './WorkspaceDropdown';
import {ProfileDropdown} from './ProfileDropdown';
import {LinkTo} from '^components/util/LinkTo';
import {OrgSubscriptionSelectPageRoute} from '^pages/orgs/[id]/subscriptions/select';
import {useRecoilValue} from 'recoil';
import {currentOrgAtom} from '^models/Organization/atom';
import {useMeasuredUserId} from '^components/ExternalCDNScripts/measured';
import {t_membershipLevel} from '^models/Membership/types';
import {GiSadCrab} from 'react-icons/gi';

export const OrgTopBar = memo(() => {
    const {currentUser} = useCurrentUser();
    const currentOrg = useRecoilValue(currentOrgAtom);
    const currentMembership = currentOrg && currentUser && currentUser.findMembershipByOrgId(currentOrg.id);
    useMeasuredUserId();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <header className="container-fluid h-[56px] flex items-center gap-6 border-b bg-white-blurred text-scordi sticky top-0 z-20">
            <div className="hidden sm:block">
                <img src="/images/logo/scordi/favicon-bg-transparent.png" alt="Scordi Logo" className="h-7 mr-2" />
            </div>

            <WorkspaceDropdown />

            <div className="hidden lg:block">
                <div className="text-14 tracking-[0.01rem]">
                    {currentUser?.name}님은{' '}
                    {currentMembership ? (
                        <span>
                            {t_membershipLevel(currentMembership?.level, {inWord: false})}입니다
                            <span onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                                .
                            </span>
                        </span>
                    ) : (
                        ''
                    )}
                </div>
            </div>

            {/* @ts-ignore */}
            <marquee className={`w-[20rem] ${isHovered ? '' : 'hidden'}`} direction="right">
                <GiSadCrab className="text-red-600" fontSize={20} />
                {/* @ts-ignore */}
            </marquee>

            <div className="ml-auto flex items-center gap-8">
                <div className="hidden sm:block">
                    <LinkTo
                        href={currentOrg ? OrgSubscriptionSelectPageRoute.path(currentOrg.id) : '#'}
                        className={`btn btn-sm btn-scordi gap-2 ${
                            !currentOrg ? 'btn-disabled !bg-scordi !text-white opacity-30' : ''
                        }`}
                        disabled={!currentOrg}
                        loadingOnBtn
                    >
                        <FaPlus />
                        <span>구독 등록하기</span>
                    </LinkTo>
                </div>

                <div className="text-gray-400 transition-all hover:text-scordi-500 cursor-pointer">
                    <FaBell size={20} className="" />
                </div>

                <div>
                    <ProfileDropdown />
                </div>
            </div>
        </header>
    );
});
OrgTopBar.displayName = 'OrgTopBar';
