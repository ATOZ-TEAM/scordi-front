import {GetServerSideProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {publicPageRequires} from '^types/utils/18n.type';
import {pathReplace, pathRoute} from '^types/pageRoute.type';
import {LandingHomePage3} from '^clients/public/home/LandingPages/HomePage3';
import {useRouter} from 'next/router';

export const MainPageRoute = pathRoute({
    pathname: '/',
    path: () => pathReplace(MainPageRoute.pathname),
});

export const getStaticProps = async ({locale}: any) => ({
    props: {
        ...(await serverSideTranslations(locale, [...publicPageRequires, 'publicMain'])),
        // Will be passed to the page component as props
    },
});

export default function MainPage() {
    const router = useRouter();
    router.replace('https://www.scordi.io');
    return null;
}

/**
 * 다음 주소에서 확인
 * - 개발환경: http://localhost:3000/home
 * - 스테이징: https://scordi.io:8080/home
 * - 실서비스: https://scordi.io/home
 */
// export default function MainPage() {
//     return <LandingHomePage3 />;
// }
