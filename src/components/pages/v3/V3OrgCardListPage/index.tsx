import React, {memo} from 'react';
import {HeaderPanel} from './HeaderPanel';
import {BsPlus} from 'react-icons/bs';
import {CardList} from './CardList';
import {V3ModalLikeLayoutMobile} from '../layouts/V3ModalLikeLayout.mobile';
import {MobileSection} from '../share/sections/MobileSection';
import {useModal} from '../share/modals/useModal';
import {useRouter} from 'next/router';
import {V3OrgHomePageRoute} from '^pages/v3/orgs/[orgId]';
import {orgIdParamState} from '^atoms/common';
import {CardFormModalGroup} from '^components/pages/v3/V3OrgCardListPage/modals/CardFormModalGroup';
import {inputCardNumberModal} from './modals/CardNumberModal/atom';
import {useRecoilValue} from 'recoil';
import {useOnResize2} from '^components/util/onResize2';
import {V3MainLayout} from '^v3/layouts/V3MainLayout';
import {LNBIndex} from '^v3/share/LeftNavBar';
import {currentOrgAtom} from '^models/Organization/atom';

export const V3OrgCardListPage = memo(() => {
    const cardNumberModal = useModal(inputCardNumberModal);
    const currentOrg = useRecoilValue(currentOrgAtom);
    const {isDesktop} = useOnResize2();
    const router = useRouter();

    const backBtnOnclick = () => {
        if (!currentOrg) return;
        router.push(V3OrgHomePageRoute.path(currentOrg.id));
    };

    if (isDesktop) {
        return (
            <V3MainLayout activeTabIndex={LNBIndex.Cards}>
                <div>
                    <p>V3OrgCardListPage</p>
                </div>
            </V3MainLayout>
        );
    } else {
        return (
            <V3ModalLikeLayoutMobile title="카드" backBtnOnClick={backBtnOnclick} modals={[CardFormModalGroup]}>
                <MobileSection.List>
                    <HeaderPanel />

                    <MobileSection.Item>
                        <MobileSection.Padding>
                            <CardList />
                        </MobileSection.Padding>
                    </MobileSection.Item>

                    {!cardNumberModal.isShow && (
                        <button
                            onClick={() => cardNumberModal.open()}
                            className="btn btn-lg btn-scordi btn-circle btn-floating"
                        >
                            <BsPlus size={48} />
                        </button>
                    )}
                </MobileSection.List>
            </V3ModalLikeLayoutMobile>
        );
    }
});
