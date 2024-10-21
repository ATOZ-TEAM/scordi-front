import {TypeCast} from '^types/utils/class-transformer';
import {TeamMemberDto} from '^models/TeamMember';
import {SubscriptionDto} from '^models/Subscription/types';
import {FindAllQueryDto} from '^types/utils/findAll.query.dto';
import {TeamDto} from '^models/Team/type';
import {PaginationDto} from '^types/utils/pagination.dto';

export class TeamMemberSubscriptionDto {
    teamMemberId: number; // 팀 멤버 ID
    @TypeCast(() => TeamMemberDto) teamMember: TeamMemberDto; // 팀 멤버

    subscriptionId: number; // 구독 ID
    @TypeCast(() => SubscriptionDto) subscription: SubscriptionDto; // 구독
}

export class TeamMemberSubscriptionOriginData {
    items: TeamMemberSubscriptionDto[];
    pagination: {
        currentItemCount: number;
        currentPage: number;
        itemsPerPage: number;
        totalItemCount: number;
        totalPage: number;
    };
}

export class FindAllTeamMemberSubscriptionQueryDto extends FindAllQueryDto<TeamMemberSubscriptionDto> {
    keyword?: string; // 키워드
}
