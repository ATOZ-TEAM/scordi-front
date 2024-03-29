import Image from 'next/image';
import {UserLoginPageRoute} from '^pages/users/login';
import {WithChildren} from '^types/global.type';
import {useRouter} from 'next/router';
import {MainPageRoute} from '^pages/index';
import {TastingPageRoute} from '^pages/tasting';
import {FiMenu} from '@react-icons/all-files/fi/FiMenu';
import {PostListPageRoute} from '^pages/posts';
import {ProductListPageRoute} from '^pages/products';
import {useModal} from '^v3/share/modals/useModal';
import {inquiryModalAtom} from '^components/pages/LandingPages/HomePage2/InquiryModal';
import {useCurrentUser} from '^models/User/hook';
import {LinkTo} from '^components/util/LinkTo';

interface LandingPageNavBarProps extends WithChildren {
    fluid?: boolean;
    sticky?: boolean;
    bgBlur?: boolean;
    showLoginButton?: boolean;
    className?: string;
}

export const LandingPageNavBar = (props: LandingPageNavBarProps) => {
    const {fluid = false, sticky = false, bgBlur = false, showLoginButton = true, className = '', children} = props;
    const router = useRouter();
    const {currentUser, getLoginRedirectPath} = useCurrentUser(null);
    const {open} = useModal(inquiryModalAtom);

    const introducePath = '/#product-section';
    const saasPath = ProductListPageRoute.path();
    const blogPath = PostListPageRoute.path();

    return (
        <div
            className={`${bgBlur ? 'backdrop-blur-xl' : 'bg-white'} ${sticky ? 'sticky top-0' : ''} z-10`}
            style={{
                ...(bgBlur
                    ? {
                          backgroundColor: 'rgba(255, 255, 255, .8)',
                      }
                    : {}),
            }}
        >
            <div className={`p-4 ${fluid ? '' : 'container sm:px-0'} navbar ${className}`}>
                <div className="navbar-start">
                    <LinkTo
                        href={MainPageRoute.path()}
                        className={`btn btn-ghost btn-hover-init normal-case text-2xl md:text-3xl ${
                            fluid ? '' : 'px-0'
                        }`}
                    >
                        {/*<Image*/}
                        {/*    src="/logo-transparent.png"*/}
                        {/*    alt="Scordi logo"*/}
                        {/*    width={36}*/}
                        {/*    height={36}*/}
                        {/*    className="relative top-1 mr-1"*/}
                        {/*/>*/}
                        {/*<span>scordi</span>*/}
                        <img
                            src="/images/logo/scordi/logo-black-transparent-2.png"
                            alt="Scordi logo"
                            className="relative mr-1 w-[140px]"
                        />
                    </LinkTo>

                    <div className="hidden sm:flex gap-2 items-center justify-between px-4">
                        <LinkTo
                            href={introducePath}
                            text="제품소개"
                            className="hidden md:inline-flex btn btn-ghost normal-case btn-hover-init"
                        />
                        <LinkTo
                            href={TastingPageRoute.path()}
                            className="btn btn-ghost normal-case btn-hover-init"
                            text="SaaS 스캐너"
                        />
                        <LinkTo href={saasPath} className="btn btn-ghost normal-case btn-hover-init" text="컬렉션" />
                        <LinkTo
                            href={blogPath}
                            className="hidden md:inline-flex btn btn-ghost normal-case btn-hover-init"
                            text="블로그"
                        />
                    </div>
                </div>
                <div className="navbar-center lg:flex" />

                <div className="navbar-end gap-2">
                    {children}

                    {showLoginButton && (
                        <div className="flex gap-2 items-center justify-between">
                            {currentUser ? (
                                <LinkTo
                                    text="시작하기"
                                    href={getLoginRedirectPath(currentUser)}
                                    className="btn btn-ghost"
                                />
                            ) : (
                                <LinkTo text="로그인" href={UserLoginPageRoute.path()} className="btn btn-ghost" />
                            )}

                            <LinkTo
                                text="도입 문의하기"
                                onClick={open}
                                className="btn hidden sm:inline-flex btn-scordi"
                            />
                        </div>
                    )}

                    <div className="dropdown dropdown-end sm:hidden">
                        <label
                            tabIndex={0}
                            className="btn sm:btn-outline !bg-white !border-none sm:border-gray-400 text-gray-500 sm:hidden"
                        >
                            <FiMenu size={20} />
                        </label>
                        <ul
                            tabIndex={0}
                            className="menu dropdown-content p-2 shadow-lg bg-base-100 !fixed left-0 w-full"
                        >
                            <li>
                                <LinkTo href={introducePath} text="제품소개" />
                            </li>
                            <li>
                                <LinkTo href={TastingPageRoute.path()} text="SaaS 스캐너" />
                            </li>
                            <li>
                                <LinkTo href={saasPath} text="컬렉션" />
                            </li>
                            <li>
                                <LinkTo href={blogPath} text="블로그" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
