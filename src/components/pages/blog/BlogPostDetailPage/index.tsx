import React, {memo, useEffect} from 'react';
import {useRouter} from 'next/router';
import {usePost} from '^models/Post/hook';
import {LandingPageNavBar} from '^components/lab/landing-page-components';
import {BetaServiceFooter} from '^components/pages/LandingPages/components';
import {BlogPostDetailHeader} from './BlogPostDetailHeader';
import {BlogPostDetailBody} from './BlogPostDetailBody';
import {OtherPostList} from './OtherPostList';
import {NewsLetterSection} from '^components/pages/LandingPages/components/NewsLetterSection';
import {PostDto} from '^models/Post/type';
import {PageSEO} from '^components/SEO';
import {isPageLoadedAtom, PostDetailPageRoute} from '^pages/posts/[id]';
import {useRecoilValue} from 'recoil';

export const BlogPostDetailPage = memo(({post}: {post: PostDto}) => {
    const router = useRouter();
    const postId = Number(router.query.id);
    const isLoaded = useRecoilValue(isPageLoadedAtom);
    usePost(post);

    // useEffect(() => {
    //     if (!router.isReady) return;
    //     if (!postId || isNaN(postId)) return;
    //     //     getPost(postId);
    //     setPost(post);
    // }, [router.isReady, postId]);

    return (
        <div className="bg-white blog-post-detail">
            <PageSEO
                url={PostDetailPageRoute.path(post.id)}
                title={`${post.title} | scordi blog`}
                description={post.seoDescription}
                author={post.authors[0]?.name}
                keywords={(post.seoKeywords || []).join(', ')}
                thumbnail={post.thumbnailUrl!}
            />

            {isLoaded && (
                <>
                    <LandingPageNavBar showLoginButton={true} fluid={true} className="sticky top-0 z-10 bg-white" />
                    <div className="blog-container blog-container--default">
                        <div className="blog-container--inner">
                            <article>
                                <BlogPostDetailHeader />
                                <BlogPostDetailBody />
                            </article>
                        </div>
                    </div>

                    <div className="bg-white pb-[90px]">
                        <div className="blog-container blog-container--default">
                            <div className="blog-container--inner">
                                <h2 className="text-3xl mb-8">Similar Posts</h2>
                                <div className="other-posts">
                                    <OtherPostList />
                                </div>
                            </div>
                        </div>
                    </div>

                    <NewsLetterSection />

                    <div className="w-full">
                        <div className="blog-container blog-container--default">
                            <div className="blog-container--inner" style={{width: 'calc(92% + 2rem)'}}>
                                <BetaServiceFooter />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
});
