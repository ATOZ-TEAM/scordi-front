export class WorkspaceProfileDto {
    slug!: string; // 목록에서 조직을 선택하기 위한 식별자
    displayName!: string; // 서비스 내에서 사용중인 조직 이름
    profileImageUrl!: string; // 조직 프로필 이미지 주소
    description!: string; // 설명
    publicEmail!: string; // 공개 이메일
    billingEmail!: string; // 결제 이메일
}
