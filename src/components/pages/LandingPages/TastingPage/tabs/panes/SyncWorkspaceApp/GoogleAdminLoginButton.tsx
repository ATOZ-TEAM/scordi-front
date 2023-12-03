import {memo} from 'react';
import {useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState} from 'recoil';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {GoogleLoginBtn} from '^components/pages/UsersLogin/GoogleLoginBtn';
import {useAlert} from '^hooks/useAlert';
import {userSocialGoogleApi} from '^api/social-google.api';
import {filterBlackList} from './features';
import {ReportLoadingStatus, reportLoadingStatus, reportState} from './atom';
import {googleOAuth} from '^config/environments';

export const GoogleAdminLoginButton = memo(function GoogleAdminLoginButton() {
    const googleOauthClientId = googleOAuth.adminClient.id;
    const setLoadingStatus = useSetRecoilState(reportLoadingStatus);
    const setReportData = useSetRecoilState(reportState);
    const {usageReport: googleUsageReportApi} = userSocialGoogleApi.subscriptions;
    const {alert} = useAlert();

    const googleLoginSuccessHandler = (accessToken: string) => {
        setLoadingStatus(ReportLoadingStatus.Loading);
        const req = googleUsageReportApi.draft(accessToken);

        req.then((res) => {
            if (!res.data) return;
            const filteredReport = filterBlackList(res.data);
            filteredReport.setNonameMember();
            setReportData(filteredReport);
            setLoadingStatus(ReportLoadingStatus.Loaded);
        });

        req.catch((e) => {
            setLoadingStatus(ReportLoadingStatus.NotLoaded);

            if ((e.response.data.code = 'Unauthorized')) {
                alert.error('회사 대표 계정으로 시도해주세요', '', {
                    html: `
                    ex) official@scordi.io
                    `,
                });
            } else {
                alert.error('다시 시도해주세요', e.response.data.message);
            }
        });
    };

    return (
        <div
            className="tooltip--TastingGoogleButton tooltip tooltip-open tooltip-bottom sm:tooltip-top tooltip-primary"
            data-tip="구글 워크스페이스 연동이 필요해요!"
        >
            <GoogleOAuthProvider clientId={googleOauthClientId}>
                <GoogleLoginBtn about="admin" googleLoginOnSuccessFn={googleLoginSuccessHandler} />
            </GoogleOAuthProvider>
        </div>
    );
});
