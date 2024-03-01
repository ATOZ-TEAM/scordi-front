// 업무 구분 (parameter: 'businessType')
export enum CodefRequestBusinessType {
    Bank = 'BK', // 은행,저축은행
    Card = 'CD', // 카드
    Stock = 'ST', // 증권
    Insurance = 'IS', // 보험
}

// 기관코드 (codef 에서 organization 파라미터의 값으로 취급)
export enum CodefCardCompanyCode {
    KB국민카드 = '0301',
    현대카드 = '0302',
    삼성카드 = '0303',
    NH카드 = '0304',
    BC카드 = '0305',
    신한카드 = '0306',
    씨티카드 = '0307',
    우리카드 = '0309',
    롯데카드 = '0311',
    하나카드 = '0313',
    전북카드 = '0315',
    광주카드 = '0316', // cert only
    수협카드 = '0320', // cert only
    제주카드 = '0321', // cert only
    산업은행카드 = '0002', // cert only
}

// 고객구분 (parameter: 'clientType')
export enum CodefCustomerType {
    Personal = 'P', // 개인
    Business = 'B', // 기업,법인
    All = 'A', // 통합
}

// 로그인 방식 (parameter: 'loginType')
export enum CodefLoginType {
    Certificate = '0', // 인증서
    IdAccount = '1', // 아이디/패스워드
}

// 인증서 구분 (parameter: 'certType')
export enum CodefCertificateType {
    Default = '1', // 기본인증서(der/key)타입 (default)
    PFX = 'pfx', // 인증서 pfx 타입
}

// 로그인구분 (parameter: 'loginTypeLevel')
// - *신한/롯데 법인카드의 경우
export enum CodefLoginTypeLevel {
    USER = '0', // 이용자
    BRANCH = '1', // 사업장/부서관리자
    ADMIN = '2', // 총괄관리자 (default)
}

// 의뢰인구분(회원구분) (parameter: 'clientTypeLevel')
// - *신한 법인카드의 경우
export enum CodefClientTypeLevel {
    CREDIT_CARD = '0', // 신용카드회원
    CHECK_CARD = '1', // 체크카드회원
    RnD_CREDIT_CARD = '2', // 연구비신용카드회원
    PRE_PLUS = '3', // 프리플러스회원
}
