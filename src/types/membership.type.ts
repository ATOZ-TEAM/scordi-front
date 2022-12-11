import {UserDto} from '^types/user.type';
import {OrganizationDto} from '^types/organization.type';
import {FindAllQueryDto} from '^types/utils/findAll.query.dto';

export enum MembershipLevel {
    MEMBER = 'MEMBER',
    OWNER = 'OWNER',
}

export type CreateMembershipRequestDto = {
    organizationId: number;
    userId: number;
    level?: MembershipLevel;
};

export type UpdateMembershipRequestDto = Partial<CreateMembershipRequestDto>;

export type MembershipDto = {
    id: number;
    organizationId: number;
    userId: number;
    level: MembershipLevel;
    createdAt: Date;
    updatedAt: Date;
    organization: OrganizationDto;
    user: UserDto;
};

export type FindAllMembershipQuery = FindAllQueryDto<MembershipDto>;
