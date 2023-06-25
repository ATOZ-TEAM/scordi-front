import {memo, useEffect} from 'react';
import {WithChildren} from '^types/global.type';
import {FiMenu} from '@react-icons/all-files/fi/FiMenu';
import {AdminSideBar} from './AdminSideBar';
import {atom, useRecoilState} from 'recoil';

interface AdminPageLayoutProps extends WithChildren {}

const adminSignedInState = atom<false | string>({
    key: 'adminSignedInState',
    default: false,
});

export const AdminPageLayout = memo((props: AdminPageLayoutProps) => {
    const {children} = props;
    const [signedAdminKey, setSignedAdminKey] = useRecoilState(adminSignedInState);

    const login = () => {
        const text = prompt('관리자 비밀번호를 입력해주세요.');
        if (text && text === 'we can do it') {
            setSignedAdminKey(text);
        } else {
            alert('비밀번호가 맞지 않습니다.');
            login();
        }
    };

    useEffect(() => {
        if (!signedAdminKey) login();
    }, [signedAdminKey]);

    if (!signedAdminKey) return <>관리자 로그인이 필요합니다.</>;

    return (
        <div className="drawer drawer-mobile">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/*Page content here*/}
                <label
                    htmlFor="my-drawer-2"
                    className="btn btn-sm btn-ghost absolute z-20 top-[10px] left-[4px] drawer-button lg:hidden"
                >
                    <FiMenu />
                </label>

                <div id="page-content" className="w-full block">
                    {children}
                </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <AdminSideBar />
            </div>
        </div>
    );
});
