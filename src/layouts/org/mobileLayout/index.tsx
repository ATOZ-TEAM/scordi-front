import {OrganizationDto} from "^types/organizationTypes";
import {PreLoader} from "^components/PreLoader";
import React from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {Icon} from "^components/Icon";
import {OrgHomeRoute} from "^pages/orgs/[id]/home";
import {UserSettingsPageRoute} from "^pages/users/settings";
import AppSearchPage, { AppSearchPageRoute } from "^pages/apps/search";

type OrgMobileLayoutProps = {
    org: OrganizationDto | null;
    children: any;
}

const OrgMobileLayout = ({org, children}: OrgMobileLayoutProps) => {
    const router = useRouter();

    if (!org) return <PreLoader/>;
    return (
        <>
            {router.pathname === OrgHomeRoute.pathname ? (
                <>
                    <MobileTopBar/>
                    {children}
                    <div
                        className={'flex fixed bottom-0 w-full border border-t-1 items-center p-[22px] justify-center space-x-20'}>
                        {/* TODO: 아이콘 나중에 바꿀 것 */}
                        <MobileNavItem href={OrgHomeRoute.path(org.id)} icon={<Icon.Home/>}/>
                        <MobileNavItem href={AppSearchPageRoute.pathname} icon={<Icon.Plus/>}/>
                        <MobileNavItem href={UserSettingsPageRoute.pathname} icon={<Icon.User/>}/>
                    </div>
                </>
            ) : (
                <>
                    {children}
                </>
            )}
        </>
    )
}

const MobileTopBar = () => {
    const router = useRouter();

    return (
        <div className={'flex justify-between p-[20px]'}>
            <div className={'flex'}>
                <Icon.Star/>
                <p className={'text-[21px] ml-2'}>scordi</p>
            </div>
            <div className={'flex space-x-4'}>
                <Icon.Bell/>
                <Icon.User onClick={() => router.push(UserSettingsPageRoute.pathname)}/>
            </div>
        </div>
    )
}

type MobileNavItemProps = {
    icon: any;
    href: string;
}

const MobileNavItem = (props: MobileNavItemProps) => {
    const router = useRouter();

    // TODO: 주소 따라서 아이콘 색상 바꿔주기

    return (
        <Link href={props.href}>
            {props.icon}
        </Link>
    )
}

export default OrgMobileLayout;