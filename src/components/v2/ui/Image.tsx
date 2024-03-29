import {CSSProperties, memo} from 'react';
import {WithChildren} from '^types/global.type';

type ImageV2Props = {
    src: string;
    alt: string;
    width: number;
    rounded?: boolean;
    className?: string | undefined;
} & WithChildren;

export const ImageV2 = memo((props: ImageV2Props) => {
    const {width, src, alt, rounded = false, className = '', children} = props;

    const style: CSSProperties = {};
    style.maxWidth = `${width}px`;

    return (
        <div className={`avatar`}>
            <div className={`${rounded ? 'rounded' : ''} ${className}`} style={style}>
                <img src={src} alt={alt} />
            </div>
        </div>
    );
});
