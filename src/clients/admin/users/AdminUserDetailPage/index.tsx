import {Fragment, memo, useEffect} from 'react';
import {useRouter} from 'next/router';
import {atom, useRecoilState, useRecoilValue} from 'recoil';
import {UserDto} from '^models/User/types';
import {userManageApi} from '^models/User/api';
import {AdminUsersPageRoute} from '^pages/admin/users';
import {ContentTabNav} from '^layouts/ContentLayout';
import {AdminDetailPageLayout, AdminPageContainer} from '^admin/layouts';
import {UserBasicInfoTabContent} from './UserBasicInfoTabContent';
import {MembershipListTabContent} from './MembershipListTabContent';
import {SocialAccountListTabContent} from './SocialAccountListTabContent';
import {TagUI} from '^v3/share/table/columns/share/TagUI';

export const adminUserDetail = atom<UserDto | null>({
    key: 'adminUserDetail',
    default: null,
});

export const navTabIndex = atom({
    key: 'adminUserDetailPage/NavTabIndex',
    default: 0,
});

export const AdminUserDetailPage = memo(() => {
    const router = useRouter();
    const userId = Number(router.query.id);
    const [user, setUser] = useRecoilState(adminUserDetail);
    const tabIndex = useRecoilValue(navTabIndex);

    useEffect(() => {
        if (!userId || isNaN(userId)) return;
        userManageApi.show(userId).then((res) => setUser(res.data));
    }, [userId]);

    if (!user) return <>User(#{router.query.id}) Not Found.</>;

    const tabs = [
        {label: '기본정보', Component: UserBasicInfoTabContent},
        {label: '소속정보', Component: MembershipListTabContent},
        {label: '소셜계정 연동정보', Component: SocialAccountListTabContent},
    ];

    const TabContentComponent = tabs[tabIndex]?.Component || Fragment;

    return (
        <AdminDetailPageLayout
            title={
                <span className="inline-flex gap-4 items-center">
                    <span>
                        {user.name} (#{user.id})
                    </span>
                    {user.isAdmin && <button className="btn btn-sm !bg-red-200">ADMIN</button>}
                </span>
            }
            breadcrumbs={[{text: '회원관리'}, {text: '회원목록', href: AdminUsersPageRoute.path()}, {text: '회원상세'}]}
            // editPageRoute={''}
            // onDelete={() => console.log('delete!')}
            tabNav={<ContentTabNav resetIndex={true} tabs={tabs.map((tab) => tab.label)} recoilState={navTabIndex} />}
        >
            <AdminPageContainer>
                <TabContentComponent />
            </AdminPageContainer>
        </AdminDetailPageLayout>
    );
});
