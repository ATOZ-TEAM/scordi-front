import {AnchorHTMLAttributes, HTMLAttributeAnchorTarget, memo, MouseEventHandler, useEffect, useState} from 'react';
import Link from 'next/link';
import {LinkProps} from 'next/dist/client/link';
import {useRouter} from 'next/router';
import {ReactNodeElement, WithChildren} from '^types/global.type';
import {onlyPath} from '^utils/get-query-params';

export interface LinkToProps extends Partial<LinkProps & WithChildren> {
    text?: ReactNodeElement;
    className?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
    target?: HTMLAttributeAnchorTarget;
    displayLoading?: boolean;
    loadingOnBtn?: boolean;
    loadingClassName?: string;
    disabled?: boolean;
    rel?: string;
    noFollow?: boolean;
}

export const LinkTo = memo((props: LinkToProps) => {
    const router = useRouter();
    const [isClicked, setIsClicked] = useState(false);
    const {
        text = '',
        target,
        onClick,
        children,
        className = '',
        href = '#',
        displayLoading = true,
        loadingOnBtn = false,
        loadingClassName = '',
        disabled = false,
        rel = '',
        noFollow = false,
        ...res
    } = props;

    useEffect(() => {
        if (router.isReady) setIsClicked(false);
    }, [router.isReady]);

    if (target === '_blank') {
        return (
            <Link className={className} href={href} onClick={onClick} target={target}>
                {children || text}
            </Link>
        );
    }

    if (onClick) {
        return (
            <a className={className} onClick={onClick} target={target} rel={rel}>
                {children || text}
            </a>
        );
    }

    if (isClicked) {
        if (displayLoading) {
            const loadingClass = loadingClassName || (loadingOnBtn ? 'link_to-loading' : 'link_to-clicked');
            return (
                <a className={`${className} ${loadingClass}`} target={target} rel={rel}>
                    {children || text}
                </a>
            );
        }
    }

    return (
        <Link
            href={disabled ? '' : href}
            target={target}
            className={`${className}`}
            rel={rel}
            {...res}
            onClick={() => {
                if (href == onlyPath(router)) return;
                setIsClicked(true);
            }}
        >
            {children || text}
        </Link>
    );
});
LinkTo.displayName = 'LinkTo';
