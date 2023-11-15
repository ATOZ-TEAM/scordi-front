import React, {memo, useEffect, useState} from 'react';
import {LandingPageLayout} from '../LandingPageLayout';
import {useRouter} from 'next/router';
import {useForm} from 'react-hook-form';
import {UserDto, UserGoogleSocialSignUpRequestDtoV2} from '^types/user.type';
import {toast} from 'react-toastify';
import {useRecoilState, useRecoilValue} from 'recoil';
import {codeConfirmedState, isTermModalOpenedState, phoneAuthDataState} from './BetaSignPhoneAuthPage.atom';
import {PhoneNumberInput} from './PhoneNumberInput';
import {AuthCodeInput} from './AuthCodeInput';
import {errorNotify} from '^utils/toast-notify';
import {useSocialLogin, useSocialLoginV2} from '^hooks/useCurrentUser';
import {SignWelcomePageRoute} from '^pages/sign/welcome';
import {useTranslation} from 'next-i18next';
import {ApiError} from '^api/api';
import {BetaSignSocialPageRoute} from '^pages/sign/social';
import {invitedOrgIdAtom} from '^v3/V3OrgJoin/atom';
import {googleCodeAtom} from '^components/pages/UsersLogin/atom';
import {userSocialGoogleApi} from '^api/social-google.api';
import {TermModalV2} from '^components/pages/LandingPages/BetaSignPhoneAuthPage/TermModalV2';

export const BetaSignPhoneAuthPage2 = memo(() => {
    const router = useRouter();
    const socialLogin = useSocialLogin();
    const socialLoginV2 = useSocialLoginV2();
    const code = useRecoilValue(googleCodeAtom);
    const phoneAuthData = useRecoilValue(phoneAuthDataState);
    const invitedOrgId = useRecoilValue(invitedOrgIdAtom);
    const form = useForm<UserGoogleSocialSignUpRequestDtoV2>();
    const [isOpened, setIsOpened] = useRecoilState(isTermModalOpenedState);
    const codeConfirmed = useRecoilValue(codeConfirmedState);
    const {t} = useTranslation('sign');
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        console.log('\ninvited from', invitedOrgId);
        if (!code) {
            router.replace(BetaSignSocialPageRoute.path());
            return;
        }

        form.setValue('code', 'code');
        setPageLoaded(true);
    }, []);

    useEffect(() => {
        form.setValue('phone', phoneAuthData.phoneNumber);
    }, [phoneAuthData.phoneNumber]);

    // 가입 후처리 콜백
    const findOrCreateUserCallback = async () => {
        if (!code) return;

        // 정상적인 온보딩 플로우
        await socialLoginV2(code)
            .then(() => router.push(SignWelcomePageRoute.path()))
            .catch(errorNotify);
    };

    // 인증 완료 후 최종 가입시도
    const onLastSubmit = (data: UserGoogleSocialSignUpRequestDtoV2) => {
        if (!data.isAgreeForServiceUsageTerm || !data.isAgreeForPrivacyPolicyTerm) {
            setIsOpened(true);
            return;
        }

        const {googleSignUp: singUp, googleSignUpInvited: singUpInvited, findSocialUserByCode} = userSocialGoogleApi;

        // 먼저 이메일을 통해 가입여부를 확인하고
        findSocialUserByCode(data.code)
            .then((res) => {
                // 가입된 사용자라면 후처리 로직만 실행하고
                const user = res.data;
                if (user.orgId) {
                    toast.info('가입한 계정이 있어 기존 계정으로 진행합니다.');
                    findOrCreateUserCallback();
                } else {
                    alert('[에러] 조직이 설정되지 않은 사용자입니다.\n관리자에게 문의해주세요.');
                }
            })
            .catch((err: ApiError) => {
                console.log({err});
                // 기존에 가입되어있지 않은 사용자라면
                if (err?.response?.data?.status === 404) {
                    // 가입을 시킵니다.
                    // 초대된 회원의 경우 다른 API를 사용합니다.
                    if (invitedOrgId) {
                        singUpInvited({organizationId: invitedOrgId, ...data})
                            .then(findOrCreateUserCallback)
                            .catch((err: ApiError) => {
                                errorNotify(err);
                            });
                    } else {
                        singUp(data)
                            .then(findOrCreateUserCallback)
                            .catch((err: ApiError) => {
                                console.log('가입 catch', err);
                                errorNotify(err);
                            });
                    }
                } else {
                    errorNotify(err);
                }
            });
    };

    // 약관 동의 모달 완료
    const agreeModalOnConfirm = () => onLastSubmit(form.getValues());

    if (!pageLoaded) {
        return (
            <LandingPageLayout pageName="BetaSignPhoneAuthPage">
                <div className="mx-auto text-center py-20 w-full max-w-lg space-y-5">
                    <h1
                        className="text-2xl sm:text-4xl mb-8 font-bold"
                        dangerouslySetInnerHTML={{__html: t('auth_check.page_title')}}
                    />
                </div>
            </LandingPageLayout>
        );
    }

    return (
        <LandingPageLayout pageName="BetaSignPhoneAuthPage">
            <div className="mx-auto text-center py-20 w-full max-w-lg space-y-5">
                <h1
                    className="text-2xl sm:text-4xl mb-8 font-bold"
                    onClick={() => {
                        console.log(form.getValues());
                    }}
                    dangerouslySetInnerHTML={{__html: t('phone_auth.page_title')}}
                />

                <div className="p-4">
                    <form className="mx-auto mb-14">
                        {/* Phone Number */}
                        <PhoneNumberInput />

                        {/* Auth Code */}
                        <AuthCodeInput />
                    </form>

                    <div>
                        <button
                            className="btn sm:btn-lg btn-block btn-scordi-500 normal-case disabled:!bg-slate-100 disabled:!border-slate-300"
                            disabled={!form.watch('phone') || !codeConfirmed}
                            onClick={agreeModalOnConfirm}
                        >
                            {t('phone_auth.start_with_phone_number')}
                        </button>
                    </div>
                </div>
            </div>

            <hr />

            <TermModalV2 form={form} onConfirm={agreeModalOnConfirm} />
        </LandingPageLayout>
    );
});