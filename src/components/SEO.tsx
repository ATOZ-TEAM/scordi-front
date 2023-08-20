import React, {memo} from 'react';
import {WithChildren} from '^types/global.type';
import ExternalCDNScripts from '^components/ExternalCDNScripts';
import Head from 'next/head';

interface SEOProps extends WithChildren {}

export const SEO = memo((props: SEOProps) => {
    const {children} = props;

    const serviceHost = 'https://scordi.io';
    // const thumbnail = `${serviceHost}/home/202305/tasting/thumbnail.png`;
    const thumbnail = `${serviceHost}/images/thumbnails/scordi-og_img-230806.png`;
    const title = '스코디 scordi - 사내 협업툴 구독 관리';
    const description =
        '반복되는 단순 운영 업무, 1분만에 자동화 해 보세요. 스코디로 클릭 한 번에 SaaS를 관리할 수 있습니다.';

    const ld = {
        '@context': 'http://schema.org',
        '@type': 'Organization',
        url: 'https://scordi.io',
        name: 'Team Scordi',
        image: 'https://scordi.io/logo.png',

        // 채널톡 참고
        // "contactPoint" : [
        //   {
        //     "@type": "ContactPoint",
        //     "telephone": "+82-",
        //     "contactType": "Customer Service",
        //     "contactOption": "TollFree",
        //     "areaServed": "KR"
        //   }
        // ],
        // "sameAs": [
        //   "https://www.youtube.com/channel/UCguz-PKTeNZ_v90yOvyKSog",
        //   "https://www.facebook.com/channel.korea/",
        //   "https://play.google.com/store/apps/details?id=com.zoyi.channel.desk.android",
        //   "https://itunes.apple.com/app/channel-desk/id1088828788?mt=8"
        // ]
    };

    return (
        <Head>
            <title>스코디 scordi - 사내 협업툴 구독 관리</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1,IE=EmulateIE7" />

            <link rel="icon" href="/favicon-64x64.png" />
            <link rel="canonical" href="https://scordi.io" />

            <meta name="description" content={description} />
            <meta name="author" content="Team Scordi" />
            <meta
                name="keywords"
                content="scordi, Scordi, 결제, 카드, 인보이스, SaaS, 비용, 인보이스영수증, 영수증, 결제영수증, 영수증청구, 결제청구, 카드청구, 법인카드청구, 법카청구, 카드연동, 카드등록, 계정추가, 카드내역조회, 계정 연동, 패스트클라우드, 메가존클라우드, flex, 회사비용, 비용관리, 비용처리, 영수증관리, 지출관리, 통합계좌관리, 개인사업자비용처리, 비용절감, 비용관리엑셀, 엑셀매출관리, 법인비용처리, 신용카드, 체크카드, 신한법인카드, 롯데법인카드, 현대법인카드, 법카, 고위드, 클라우드, 간편결제, 안전결제, 정기결제, 전자결제, 스코디, 제로원리퍼블릭, 스타트업, SMP, SaaS manager, saas management, SaaS 관리, SaaS 관리 서비스, SaaS 관리 솔루션, 스텝페이, SaaS 결제, 통합관리, 통합비용관리, 통합카드관리, 통합결제관리, SaaS 운영 관리, 온보딩, 오프보딩, 계정연동, 카드연동, 서비스연동, 서비스결제, IT솔루션, 파이브클라우드, 경영지원, HR 플랫폼, HR 서비스, 인사 담당자, 재무 담당자, 런웨이, 스타트업 투자, 파이낸스, 비용결산, 비용정산, 카드정산, 카드결산, 법카정산, 정산관리, 정산내역, 기업용 클라우드, 클라우드 가격, 구독솔루션, 구독형 서비스, 송장, 관리, 소프트웨어, 온라인, 클라우드 기반, 추적, 시스템, 자동화된, 청구서 작성, 처리, 추적, 워크플로우, 디지털, 결제, 조정, 보고, 소기업, 기업용, 플랫폼, 조직, 알림, 문서, 수명 주기, 자동화, 분석, 공급업체, 지급 가능 계정, 주문서, 경비, 경비내역, 경비정산, 경비자동화, 업무자동화, 비용자동화, 법카자동화, 카드자동화, 계정자동화, 법인자동화, 법인카드자동화, 업무효율, 비용효율, 카드효율, 법카효율, 계정효율, 법인효율, 법인카드효율, 클라우드 관리, 서비스 관리, 계정초대, 계정해지, SaaS 해지, 카드해지, 서비스 해지, 입사자, 퇴사자, HR 운영, 운영 업무, 근태, 급여, 계약, 연차, 전자계약, 연말정산, 채용, 결제정보, 계정정보, 카드정보, 지급, 정산, 공제, 급여정산, 소득공제, 임금, 퇴직금, 퇴직소득, 퇴직금정산, 분납, 급여명세서, 명세, 카드명세, 급여명세, HR 솔루션, 비용분석 엑셀, 비용관리 엑셀, 엑셀 비용 양식, 노션 계정 관리, 엑셀 관리대장, 엑셀 관리대장양식"
            />
            <meta property="og:url" content={serviceHost} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={thumbnail} />
            <meta property="og:site_name" content="Scordi" />

            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={thumbnail} />
            <meta name="twitter:card" content="summary_large_image" />
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: `${JSON.stringify(ld, null, 2)}`}} />
            <script src="../components/webPush/index"></script>

            <ExternalCDNScripts />
        </Head>
    );
});

interface PageSEOProps {
    url: string;
    title: string;
    description: string;
    thumbnail: string;
    author?: string;
    keywords?: string;
}

export const PageSEO = (props: PageSEOProps) => {
    const {url, title, description, thumbnail, author = 'Team scordi', keywords = ''} = props;

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="author" content={author} />
            <meta name="keywords" content={keywords} />

            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={thumbnail} />
            <meta property="og:site_name" content="Scordi" />

            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={thumbnail} />
            <meta name="twitter:card" content="summary_large_image" />
        </Head>
    );
};
