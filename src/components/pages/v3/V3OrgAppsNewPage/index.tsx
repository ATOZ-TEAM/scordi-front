import React, {memo} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {useTranslation} from 'next-i18next';
import {useOnResize2} from '^components/util/onResize2';
import {V3MainLayout} from '../layouts/V3MainLayout';
import {currentOrgAtom} from '^atoms/organizations.atom';
import {V3ModalLikeLayoutMobile} from '^v3/layouts/V3ModalLikeLayout.mobile';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {isOpenNewInvoiceAccountModalAtom} from '^v3/V3OrgHomePage/NewInvoiceAccountModal/atom';
import {NewInvoiceAccountModalMobile} from '^v3/V3OrgHomePage/NewInvoiceAccountModal/mobile';

export const V3OrgAppsNewPage = memo(() => {
    const currentOrg = useRecoilValue(currentOrgAtom);
    const {t} = useTranslation('org-home');
    const {isDesktop} = useOnResize2();
    const setModalShow = useSetRecoilState(isOpenNewInvoiceAccountModalAtom);

    if (isDesktop) {
        // PC size screen
        return (
            <V3MainLayout>
                <div>
                    <div>
                        <p>V3OrgAppsNew</p>
                    </div>
                </div>
            </V3MainLayout>
        );
    } else {
        // Mobile size screen
        return (
            <V3ModalLikeLayoutMobile modals={[NewInvoiceAccountModalMobile]}>
                <div className="h-full px-5 flex flex-col justify-start gap-20">
                    <div className="py-5">
                        <br />
                        <br />
                        <p className="mb-4">새로운 앱 등록하기</p>
                        <h2 className="h1 leading-tight">
                            어떤 방법으로 <br /> 앱을 등록할까요?
                        </h2>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button onClick={() => setModalShow(true)} className="btn btn-block border border-gray-200">
                            이메일로부터 여러 앱 한꺼번에 등록하기
                        </button>
                        <button className="btn btn-block border border-gray-200">
                            앱 로그인으로 자세한 앱 상태 조회하기
                        </button>
                        <button className="btn btn-block btn-link text-xs">그냥 직접 입력할래요</button>
                    </div>
                </div>
            </V3ModalLikeLayoutMobile>
        );
    }
});