import React, {useEffect} from 'react';
import {pathRoute} from '^types/pageRoute.type';
import {useCurrentUser} from '^models/User/hook';
import {TextInput} from '^components/TextInput';
import {useForm} from 'react-hook-form';
import {getOrgMainLayout} from '^layouts/org/mainLayout';
import {MobileTopNav, MobileViewContainer} from '^components/MobileTopNav';
import {DefaultButton} from '^components/Button';
import {UserDto, UserEditProfileRequestDto} from '^models/User/types';
import {toast} from 'react-toastify';
import {useRecoilState} from 'recoil';
import {currentUserAtom} from '^models/User/atom';
import OrgMobileLayout from '^layouts/org/mobileLayout';
import {user} from '^api/session.api';

export const UserEditPageRoute = pathRoute({
    pathname: '/users/edit',
    path: () => UserEditPageRoute.pathname,
});

const UserEditPage = () => {
    const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
    const form = useForm<UserEditProfileRequestDto>();

    const UpdateUserHandler = () => {
        user.update(form.getValues()).then((res) => {
            toast.success('프로필이 수정되었습니다.');
            setCurrentUser(res.data);
        });
    };

    useEffect(() => {
        if (!currentUser) return;
        form.setValue('name', currentUser.name);
        form.setValue('phone', currentUser.phone);
        form.setValue('orgName', currentUser.orgName);
        form.setValue('email', currentUser.email);
    }, [currentUser]);

    return (
        <OrgMobileLayout>
            <MobileTopNav title={'내 정보 수정'} />
            <MobileViewContainer>
                <TextInput label={'이름'} {...form.register('name')} />
                <TextInput label={'전화번호'} {...form.register('phone')} />
                <TextInput label={'회사명'} {...form.register('orgName')} />
                <TextInput label={'회사 이메일 (아이디)'} {...form.register('email')} />
                <div className={'mt-[40px]'}>
                    <DefaultButton text={'저장하기'} onClick={UpdateUserHandler} />
                </div>
            </MobileViewContainer>
        </OrgMobileLayout>
    );
};

export default UserEditPage;
