import {InvoiceAppDto} from '^models/InvoiceApp/type';
import {GmailQueryOptions} from '^api/tasting.api';
import {FindAllQueryDto} from '^types/utils/findAll.query.dto';
import {TypeCast} from '^types/utils/class-transformer';
import {SubscriptionDto} from '^models/Subscription/types';
import {OrganizationDto} from '^models/Organization/type';
import {d_day, dayAfter, firstDayOfMonth, firstDayOfYear, monthBefore, yearBefore} from '^utils/dateTime';

export type GmailAgentTokenData = {
    accessToken: string; //Gmail Access Token
    refreshToken: string; // Gmail Refresh Token
    expireAt: Date; // When Gmail Token expire at
};

export class InvoiceAccountDto {
    id: number;
    organizationId: number;
    image: string | null;
    email: string;
    isActive: boolean; // 활성화 여부
    isSyncRunning: boolean; // 싱크 실행중 여부
    @TypeCast(() => Date) createdAt: Date;
    @TypeCast(() => Date) updatedAt: Date;

    // relations
    @TypeCast(() => OrganizationDto) organization?: OrganizationDto[];
    @TypeCast(() => InvoiceAppDto) invoiceApps?: InvoiceAppDto[];
    @TypeCast(() => SubscriptionDto) subscriptions?: SubscriptionDto[];

    get provider() {
        return 'Google';
    }

    get providerImg() {
        return 'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png';
    }

    // [토큰] 토큰 만료일시
    get tokenExpireAt() {
        const tokenCreated = this.createdAt;
        const DURATION = 7; // 7 days (테스트모드에서는 유효기간이 1주일로 알려져 있음.)
        return dayAfter(DURATION, tokenCreated);
    }

    // [토큰] 토큰 만료여부
    get isTokenExpiredAssume() {
        return new Date().getTime() < this.tokenExpireAt.getTime();
    }

    // [토큰] 토큰 만료 D-Day
    get tokenExpireLeft() {
        return d_day(this.tokenExpireAt);
    }
}

export type CreateInvoiceAccountRequestDto = {
    email: string; // 이메일
    image?: string | null; // 프로필 이미지
    // provider?: MailProvider = MailProvider.Google;
    tokenData: GmailAgentTokenData; // 인증 토큰
    gmailQueryOptions: GmailQueryOptions; // 지메일 쿼리
};

export type SyncInvoiceAccountRequestDto = {
    tokenData: GmailAgentTokenData; // 인증 토큰
};

export const getDraftInvoiceAccountFromTo = () => ({
    from: monthBefore(2, firstDayOfMonth(new Date())), // 두 달 전 1일 부터
    to: new Date(), // 오늘까지
});

export const getCreateInvoiceAccountFromTo = () => ({
    from: yearBefore(1, firstDayOfYear()), // 작년 1월 1일 부터
    to: new Date(), // 오늘까지
});

export type FindAllInvoiceAccountQueryDto = FindAllQueryDto<InvoiceAccountDto>;
