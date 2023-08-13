import {AdminDetailPageLayout} from '^components/pages/admin/layouts/DetailPageLayout';
import {AdminPrototypesPageRoute} from '^pages/admin/prototypes';
import {Fragment, memo, useEffect} from 'react';
import {atom, useRecoilState, useRecoilValue} from 'recoil';
import {useRouter} from 'next/router';
import {ApplicationPrototypeDto} from '^types/applicationPrototype.type';
import {applicationPrototypeApi} from '^api/applicationPrototype.api';
import {ContentTabNav} from '^layouts/ContentLayout';
import {EditPrototypeDetail} from '^components/pages/admin/prototypes/AdminPrototypeDetailpage/MenuContents/EditPrototypeDetail';
import {EditPrototypeIntroduce} from '^components/pages/admin/prototypes/AdminPrototypeDetailpage/MenuContents/EditPrototypeIntroduce';
import {EditPrototypePlanCycle} from '^components/pages/admin/prototypes/AdminPrototypeDetailpage/MenuContents/EditPrototypePlanCycle';

export const adminPrototypeDetail = atom<ApplicationPrototypeDto | null>({
    key: 'adminPrototypeDetail',
    default: null,
});

export const navTabIndex = atom({
    key: 'adminPrototypeDetailPage/NavTabIndex',
    default: 0,
});

export const AdminPrototypeDetailPage = memo(() => {
    const router = useRouter();
    const prototypeId = Number(router.query.id);
    const [_, setPrototype] = useRecoilState(adminPrototypeDetail);

    useEffect(() => {
        if (!prototypeId || isNaN(prototypeId)) return;
        applicationPrototypeApi.show(prototypeId).then((res) => setPrototype(res.data));
    }, [prototypeId]);

    const tabIndex = useRecoilValue(navTabIndex);
    const tabs = [
        {label: '정보', Component: EditPrototypeDetail},
        {label: '소개', Component: EditPrototypeIntroduce},
        {label: '구독 관리', Component: Fragment},
        {label: '크롤링 이력 조회', Component: Fragment},
        //
    ];
    const TabContentComponent = tabs[tabIndex]?.Component || Fragment;

    if (!prototypeId) return <>Prototype(id: #{prototypeId}) Not Found.</>;
    return (
        <AdminDetailPageLayout
            title="앱 상세"
            breadcrumbs={[
                {text: '앱 관리'},
                {text: '앱 목록', href: AdminPrototypesPageRoute.path()},
                {text: '앱 상세'},
                //
            ]}
            tabNav={<ContentTabNav resetIndex={true} tabs={tabs.map((tab) => tab.label)} recoilState={navTabIndex} />}
        >
            <div className="container pt-10 px-2 sm:px-4">
                <TabContentComponent />
            </div>
        </AdminDetailPageLayout>
    );
});
