import {atom} from 'recoil';
import {Paginated} from '^types/utils/paginated.dto';
import {FindAllPostQueryDto, PostDto} from '^types/post.type';

export const getPostListQueryAtom = atom<FindAllPostQueryDto>({
    key: 'postListQueryAtom',
    default: {},
});

export const getPostListResultAtom = atom<Paginated<PostDto>>({
    key: 'postListResultAtom',
    default: {
        items: [],
        pagination: {
            totalItemCount: 0,
            currentItemCount: 0,
            totalPage: 1,
            currentPage: 1,
            itemsPerPage: 30,
        },
    },
});
