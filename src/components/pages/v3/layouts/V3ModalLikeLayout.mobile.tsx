import React, {memo} from 'react';
import {useRouter} from 'next/router';
import {ReactComponentLike, ReactNodeLike} from 'prop-types';
import {WithChildren} from '^types/global.type';
import styles from '^styles/v3/V3MainLayout.module.scss';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {ModalLikeTopbar} from './V3ModalLikeLayout.mobile/ModalLikeTopbar';
import {ModalLikeBottomBar} from './V3ModalLikeLayout.mobile/ModalLikeBottomBar';
import {ChannelTalkHideStyle} from '^components/ExternalCDNScripts/channel-talk/ChannelTalkHideStyle';

interface V3ModalLikeLayoutMobileProps extends WithChildren {
    // 페이지 상단의 제목
    title?: ReactNodeLike;
    // 페이지 상단 우측 버튼들
    topRightButtons?: ReactComponentLike[];
    // 페이지 하단 고정 버튼들
    buttons?: ReactComponentLike[];
    // 이 페이지에서만 사용되는 모달들을 등록
    modals?: ReactComponentLike[];
}

export const V3ModalLikeLayoutMobile = memo((props: V3ModalLikeLayoutMobileProps) => {
    const {title, topRightButtons, buttons = [], modals = [], children} = props;
    const router = useRouter();

    const onBack = () => router.back();

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `html, body, #__next { min-height: 100vh }`}} />
            <ChannelTalkHideStyle />
            <div className={`${styles.layout} min-h-[100vh]`}>
                <ModalLikeTopbar backBtnOnClick={onBack} title={title} rightButtons={topRightButtons} />
                <div className="bg-white" style={{height: 'calc(100% - 50px)'}}>
                    {children}
                </div>
                {buttons.length ? (
                    <ModalLikeBottomBar>
                        {buttons.map((BottomBarButton, i) => (
                            <BottomBarButton key={i} />
                        ))}
                    </ModalLikeBottomBar>
                ) : (
                    <></>
                )}
            </div>
            {modals.map((ModalComponent, i) => (
                <ModalComponent key={i} />
            ))}
        </>
    );
});
