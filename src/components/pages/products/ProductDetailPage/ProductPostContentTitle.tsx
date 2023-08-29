import {memo} from 'react';
import {GrShare} from 'react-icons/gr';
import {ProductDto} from '^types/product.type';
import {useProductPostContent} from '^hooks/useProducts';

export const ProductPostContentTitle = memo((props: {product: ProductDto}) => {
    const {product} = props;
    const [post] = product.posts;
    if (!post) return <></>;
    const {makeContent} = useProductPostContent();

    const {thumbnailUrl, logoImgUrl, homePageUrl, title, subTitle, tagNames} = makeContent(product);

    return (
        <div>
            <div className="pb-5 border-none">
                <img src={thumbnailUrl} alt="thumbnail of this post" loading="lazy" draggable={false} />
            </div>
            <div className="flex justify-between">
                <div className="flex gap-6 items-center">
                    <div className="avatar hidden sm:inline-block">
                        <div className="w-16 rounded-full">
                            <img src={logoImgUrl} alt="logo image of this product" loading="lazy" draggable={false} />
                        </div>
                    </div>
                    <h2 className="text-center font-semibold text-gray-800 leading-[1.4] text-[28px] sm:text-[52px]">
                        {title}
                    </h2>
                </div>

                <div>
                    {homePageUrl && (
                        <a role="button" className="btn sm:btn-lg" href={homePageUrl} target="_blank">
                            <GrShare />
                        </a>
                    )}
                </div>
            </div>

            <div className="py-5 text-[16px]">
                <span>{subTitle}</span>
            </div>
            <div className="flex flex-row gap-2">
                {tagNames.map((tagName, i) => (
                    <div className="badge badge-sm sm:badge-md badge-ghost" key={i}>
                        {tagName}
                    </div>
                ))}
            </div>
        </div>
    );
});
