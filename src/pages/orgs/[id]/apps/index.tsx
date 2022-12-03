import React, {useEffect, useState} from 'react';
import {PageRoute} from '^types/pageRoute.type';
import {useRouter} from 'next/router';
import {getOrgMainLayout} from '^layouts/org/mainLayout';
import {ContentPanel, ContentPanelList} from '^layouts/ContentLayout/ContentPanel';
import {ApplicationDto} from '^types/application.type';
import {getApplications} from '^api/application.api';
import {errorNotify} from '^utils/toast-notify';
import {OrgAppListItem} from '^components/OrgAppListItem';
import {MobileTopNav} from '^components/MobileTopNav';
import {AppIconButton} from '^components/AppIconButton';
import {ContentLayout} from '^layouts/ContentLayout';
import {AppInfoPageRoute} from '^pages/orgs/[id]/apps/[appId]';

export const OrgAppsIndexPageRoute: PageRoute = {
    pathname: '/orgs/[id]/apps',
    path: (orgId: number) => OrgAppsIndexPageRoute.pathname.replace('[id]', String(orgId)),
};

function OrgAppsIndexPage() {
    const router = useRouter();
    const organizationId = Number(router.query.id);
    const [apps, setApps] = useState<ApplicationDto[]>([]);

    useEffect(() => {
        !!organizationId &&
            getApplications({where: {organizationId}, order: {id: 'DESC'}})
                .then(({data}) => {
                    setApps(data.items);
                })
                .catch(errorNotify);
    }, [organizationId]);

    return (
        <>
            <MobileTopNav title={'등록한 서비스'} />
            <div className={'p-5'}>
                {apps.length <= 0 ? (
                    <div className="flex flex-col gap-4 items-center justify-center opacity-50">
                        <img
                            className="w-[50%] lg:w-[30%] min-w-[200px]"
                            src="/images/illustration/big-isolated-employee-working-office-workplace-flat-illustration/Mar-Business_1-800px.png"
                            alt="Result not found."
                        />
                        <div className="pb-10">
                            <p className="text-gray-500 font-bold text-2xl">사용하고 있는 서비스를 등록해보세요 :)</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        {apps.map((app) => (
                            <AppIconButton
                                name={app.prototype.name}
                                icon={app.prototype.image}
                                onClick={() =>
                                    router.push(AppInfoPageRoute.path(organizationId.toString(), app.id.toString()))
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

OrgAppsIndexPage.getLayout = getOrgMainLayout;

export default OrgAppsIndexPage;
