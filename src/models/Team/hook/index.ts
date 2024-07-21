import {PagedResourceAtoms, usePagedResource} from '^hooks/usePagedResource';
import {teamApi} from '^models/Team/api';
import {teamListForSelectOptionsAtom, teamsListAtom, teamsListForTeamListPageAtom} from '^models/Team/atom';
import {FindAllTeamQueryDto, TeamDto} from '^models/Team/type';

export const useTeamsV2 = () => useTeams(teamsListAtom);

// 팀 목록 페이지 > 팀 목록 테이블
export const useTeamsForListPage = () => useTeams(teamsListForTeamListPageAtom);

// 팀 Select Input (mono-select) 에서 사용
export const useTeamsForSelectOptions = () => useTeams(teamListForSelectOptionsAtom);

const useTeams = (atoms: PagedResourceAtoms<TeamDto, FindAllTeamQueryDto>, mergeMode = false) => {
    return usePagedResource(atoms, {
        useOrgId: true,
        endpoint: (params, orgId) => teamApi.index(orgId, params),
        getId: 'id',
    });
};
