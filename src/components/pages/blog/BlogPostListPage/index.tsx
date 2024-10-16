import React, {memo, useEffect} from 'react';
import {useRouter} from 'next/router';
import {usePosts, useRecentPost} from '^models/Post/hook';
import {BlogPostListHeader} from './BlogPostListHeader';
import {BlogPostListBody} from './BlogPostListBody';
import {BetaServiceFooter} from '^components/pages/LandingPages/components';
import {LandingPageNavBar} from '^components/lab/landing-page-components';
import {PostItemRecentType} from '^components/pages/blog/BlogPostListPage/PostItemRecentType';
import {NewsLetterSection} from '^components/pages/LandingPages/components/NewsLetterSection';

export const BlogPostListPage = memo(() => {
    const router = useRouter();
    const {search} = usePosts();
    const {data: recentPost, load: fetchRecentPost} = useRecentPost();

    useEffect(() => {
        if (!router.isReady) return;

        fetchRecentPost();
        search({order: {id: 'DESC'}});
    }, [router.isReady]);

    return (
        <div className="bg-white">
            <LandingPageNavBar showLoginButton={true} fluid={true} className="sticky top-0 z-10 bg-white" />
            <BlogPostListHeader />
            <div className="hidden sm:block blog-body !py-0">
                <div className="blog-container blog-container--default px-4">
                    {recentPost && <PostItemRecentType post={recentPost} />}
                </div>
            </div>
            <BlogPostListBody />

            <NewsLetterSection />

            <div className="w-full">
                <div className="blog-container blog-container--default">
                    <div className="blog-container--inner" style={{width: 'calc(92% + 2rem)'}}>
                        <BetaServiceFooter />
                    </div>
                </div>
            </div>
        </div>
    );
});
