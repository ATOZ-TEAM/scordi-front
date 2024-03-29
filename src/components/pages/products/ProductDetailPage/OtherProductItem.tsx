import {memo} from 'react';
import {dateIsBeforeThen, yyyy_mm_dd} from '^utils/dateTime';
import {ProductDto} from '^models/Product/type';
import {ProductDetailPageRoute} from '^pages/products/[id]';
import {toast} from 'react-toastify';
import {useProductPostContent} from '^models/Product/hook';

interface OtherProductItemProps {
    product?: ProductDto;
}

export const OtherProductItem = memo((props: OtherProductItemProps) => {
    const {product} = props;
    const {makeContent} = useProductPostContent();

    if (!product) return <></>;
    const [post] = product.posts;

    const {thumbnailUrl, title, subTitle, tagNames} = makeContent(product);

    const aTagOption = {
        ...(post ? {href: ProductDetailPageRoute.path(product.id)} : {onClick: () => toast.info('준비 중입니다.')}),
    };

    return (
        <li>
            <a className="card w-full cursor-pointer" {...aTagOption}>
                <figure className="blog-post-item-img-hover-container overflow-hidden rounded-box w-[266.34px] h-[133.17px]">
                    <img
                        src={thumbnailUrl}
                        alt=""
                        loading="lazy"
                        draggable={false}
                        sizes="100vw"
                        decoding="async"
                        data-nimg="fill"
                        className=""
                    />
                </figure>
                <div className="card-body px-0 pt-4">
                    <h2 className="card-title">{title}</h2>
                    <p>{subTitle}</p>

                    <p className="flex items-center gap-1.5">
                        {tagNames &&
                            tagNames.map((tagName, i) => (
                                <span key={i} className="badge mb-2 bg-gray-200">
                                    {tagName}
                                </span>
                            ))}
                    </p>
                </div>

                {/*<div className="card-body p-0 items-start text-left">*/}
                {/*    <h4 className="blog-post-item-title card-title leading-[1.4]">{post.title}</h4>*/}
                {/*    <time className="text-[13px] sm:text-[15px] text-gray-400">*/}
                {/*        {isPublished ? (*/}
                {/*            yyyy_mm_dd(new Date(post.publishAt!))*/}
                {/*        ) : (*/}
                {/*            <span className="btn btn-xs btn-error text-white">아직 발행되지 않은 게시글입니다.</span>*/}
                {/*        )}*/}
                {/*    </time>*/}
                {/*</div>*/}
            </a>
        </li>
    );
});
