import {memo} from 'react';
import {useTranslation} from 'next-i18next';
import {useRouter} from 'next/router';

export const HomePageHeader = memo(() => {
    const router = useRouter();
    const {t} = useTranslation('publicMain');

    return (
        <section
            className="bg-gray-100 py-[60px] sm:py-[100px] flex items-center justify-center"
            style={{minHeight: 'calc(100vh * 1/3)'}}
        >
            <div className="flex flex-col gap-6 sm:gap-12">
                {/* logo */}
                <div className="flex items-center justify-center">
                    <img
                        src="/home/202308/header-logo-colored.png"
                        alt="scordi service logo"
                        className="h-[12px] sm:h-[1.5rem]"
                        loading="lazy"
                    />
                </div>

                {/* title */}
                <div>
                    <h1 className="text-[32px] sm:text-[5em] leading-[1.2em]">
                        {router.locale == 'en' ? (
                            <>
                                <span className="flex items-center justify-center">Start tracking your</span>
                                <span className="flex items-center gap-2 justify-between">
                                    SaaS
                                    <span className="inline-block animate-[spin_2s_linear_infinite]">
                                        <img
                                            src="/home/202308/header-rotation-cycle.png"
                                            alt="make it easy"
                                            className="h-[1em]"
                                            loading="lazy"
                                        />
                                    </span>
                                    spend
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="flex items-center justify-center">협업툴 구독 관리를</span>
                                <span className="flex items-center gap-2 justify-between">
                                    간편하게
                                    <span className="inline-block animate-[spin_2s_linear_infinite]">
                                        <img
                                            src="/home/202308/header-rotation-cycle.png"
                                            alt="make it easy"
                                            className="h-[1em]"
                                            loading="lazy"
                                        />
                                    </span>
                                    바꾸다
                                </span>
                            </>
                        )}
                    </h1>
                </div>

                {/* cta button */}
                <div className="flex items-center justify-center">
                    <button className="btn btn-scordi sm:btn-lg">100개 고객사 한정 무료</button>
                </div>
            </div>
        </section>
    );
});
