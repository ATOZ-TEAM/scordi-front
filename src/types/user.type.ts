import {CreateOrganizationRequestDto, OrganizationDto} from '^types/organization.type';
import {MembershipDto} from '^types/membership.type';

export type UserSignUpRequestDto = {
    name: string;
    phone: string;
    orgName: string;
    email: string;
    code: string;
    password: string;
    passwordConfirmation: string;
    isAgreeForServiceUsageTerm: boolean;
    isAgreeForPrivacyPolicyTerm: boolean;
};

export type UserSocialSignUpRequestDto = {
    provider: string; // 소셜로그인공급자
    uid: string; // 소셜로그인 ID
    profileImageUrl?: string | null; // 프로필이미지 URL
    name: string; // 이름
    phone: string; // 전화번호
    email: string; // 이메일
    isAgreeForServiceUsageTerm: boolean; // 서비스 이용약관 동의 여부
    isAgreeForPrivacyPolicyTerm: boolean; // 개인정보 활용 동의 여부
    isAgreeForMarketingTerm: boolean; // 마케팅 수신 동의 여부
};

export type UserDto = {
    id: number;
    name: string;
    phone: string;
    orgId: number;
    orgName: string;
    email: string;
    isAdmin: boolean;
    serviceUsageTermAgreedAt: string;
    privacyPolicyTermAgreedAt: string;
    marketingTermAgreedAt: Date | null; // 마케팅 수신 동의 여부
    createdAt: string;
    updatedAt: string;
};

export type UserLoginRequestDto = {
    email: string;
    password: string;
};

export type UserSocialLoginRequestDto = {
    provider: string; // 소셜로그인공급자
    uid: string; // 소셜로그인 ID
};

export type JwtContainer = {
    token: string;
};

export type UserEditProfileRequestDto = {
    name?: string;
    phone?: string;
    email?: string;
    orgName?: string;
    password?: string;
    passwordConfirmation?: string;
    isAgreeForMarketingTerm?: boolean; // 마케팅 수신 동의 여부
};

export type SendPhoneAuthMessageDto = {
    phoneNumber: string;
    code?: string;
};

export type UsersWebpushRegisterDto = {
    subscription: PushSubscription;
};

export type UsersWebpushTestDto = {
    status: number;
    code: string;
    message: string;
};

export type UserDeviceDto = {
    id: number; // 아이디
    userId: number; // 회원 ID
    isMobile: boolean; // 모바일여부
    fcmToken: string; // FCM 토큰
    createdAt: Date; // 생성일시
    updatedAt: Date; // 수정일시
    user?: UserDto; // 회원
};

export type CreateUserDeviceRequestDto = {
    isMobile: boolean; // 모바일여부
    fcmToken: string; // FCM 토큰
};
