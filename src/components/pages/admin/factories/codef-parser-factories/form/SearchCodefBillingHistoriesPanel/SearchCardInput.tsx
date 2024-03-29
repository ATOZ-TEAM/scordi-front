import React, {memo, useRef, useState} from 'react';
import {debounce} from 'lodash';
import {toast} from 'react-hot-toast';
import {useId} from 'react-id-generator';
import {FaSearch} from 'react-icons/fa';
import {FaCheck} from 'react-icons/fa6';
import {IoIosClose} from 'react-icons/io';
import {ApiError} from '^api/api';
import {FindAllQueryDto} from '^types/utils/findAll.query.dto';
import {OrganizationDto} from '^models/Organization/type';
import {CodefCardDto} from '^models/CodefCard/type/CodefCard.dto';
import {Spinner} from '^components/util/loading';
import {codefParserFactoryApi} from './../../CodefParserFactory/api';
import {CodefCardSearchResultDto} from './../../CodefParserFactory/CodefCardSearchResult.dto';
import {CodefCardTagUI} from '../../form/share/CodefCardTagUI';

interface SearchCardInputProps {
    onCardSelect: (codefCard?: CodefCardDto) => any;
}

enum SearchKey {
    ID = 'id',
    Name = 'name',
}

export const SearchCardInput = memo((props: SearchCardInputProps) => {
    const {onCardSelect} = props;
    const [id] = useId(1, 'SearchCardInput');
    const nameInputRef = useRef<HTMLInputElement | null>(null);
    const idInputRef = useRef<HTMLInputElement | null>(null);
    const [searchKey, setSearchKey] = useState<SearchKey>(SearchKey.Name);
    const [searchValue, setSearchValue] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [searchResult, setSearchResult] = useState<CodefCardSearchResultDto>();
    const [isFold, setFold] = useState(false);

    const stopPropagation = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();
            if (!isLoading) {
                if (searchKey === SearchKey.Name) search({name: searchValue});
                if (searchKey === SearchKey.ID) search({id: searchValue});
            }
        }
        return;
    };

    const search = (where: FindAllQueryDto<OrganizationDto>['where']) => {
        setIsLoading(true);
        codefParserFactoryApi
            .searchCodefCards({where})
            .then((res) => setSearchResult(res.data))
            .catch((e: ApiError) => {
                toast.error(e.response?.data.message || e.message);
                setSearchResult(undefined);
            })
            .finally(() => setIsLoading(false));
    };

    const changeName = debounce((value: string) => {
        setSearchValue(value);
        value ? search({name: value}) : setSearchResult(undefined);
    }, 500);

    const changeId = debounce((value: number) => {
        setSearchValue(value);
        value ? search({id: value}) : setSearchResult(undefined);
    }, 500);

    return (
        <div onKeyDown={stopPropagation}>
            <div className="flex items-center justify-between w-full">
                <label htmlFor={id} className="label px-0">
                    <span className="label-text">조직으로 카드 찾기</span>
                </label>

                <div className="flex items-center justify-end gap-2">
                    {isLoading && <Spinner size={15} />}

                    <select
                        className="select select-bordered select-xs"
                        onChange={(e) => {
                            setSearchKey(e.target.value as SearchKey);
                        }}
                        defaultValue={searchKey}
                    >
                        <option value={SearchKey.Name}>조직 이름</option>
                        <option value={SearchKey.ID}>조직 ID</option>
                    </select>

                    <div className="relative">
                        <div className="absolute top-0 bottom-0 w-[25px] flex items-center justify-center">
                            <FaSearch size={12} className="text-gray-500" />
                        </div>
                        {searchKey === SearchKey.Name && (
                            <input
                                ref={nameInputRef}
                                type="text"
                                placeholder="기본값은 전체조직"
                                className="input input-bordered input-xs bg-slate-50 pl-[25px]"
                                defaultValue={typeof searchValue === 'string' ? searchValue : undefined}
                                onChange={(e) => changeName(e.target.value)}
                            />
                        )}
                        {searchKey === SearchKey.ID && (
                            <input
                                ref={idInputRef}
                                type="number"
                                placeholder="기본값은 전체조직"
                                className="input input-bordered input-xs bg-slate-50 pl-[25px]"
                                defaultValue={typeof searchValue === 'number' ? searchValue : undefined}
                                onChange={(e) => changeId(Number(e.target.value))}
                                min={1}
                            />
                        )}
                    </div>
                </div>
            </div>

            {searchResult && (
                <div>
                    <div className="flex items-center justify-between mb-2.5">
                        <div
                            className="flex items-center group cursor-pointer"
                            onClick={() => {
                                onCardSelect(undefined);
                                setSearchResult(undefined);
                                if (searchKey === SearchKey.Name) nameInputRef.current?.focus();
                                if (searchKey === SearchKey.ID) idInputRef.current?.focus();
                            }}
                        >
                            <span className="badge badge-xs mr-2">#{searchResult.organization.id}</span>
                            <span className="text-12 text-gray-500 group-hover:text-gray-800 transition-all">
                                {searchResult.organization.name}
                            </span>
                            <IoIosClose size={20} className="text-gray-400 group-hover:text-gray-800 transition-all" />
                        </div>

                        <div className="text-11 flex items-center justify-end gap-x-2 flex-wrap overflow-scroll no-scrollbar">
                            {(searchResult.organizations || []).map((org, i) => (
                                <div
                                    key={i}
                                    className="text-blue-300 hover:text-blue-500 hover:underline transition-all cursor-pointer"
                                    onClick={() => {
                                        if (searchKey === SearchKey.Name) {
                                            const input = nameInputRef.current;
                                            if (input) {
                                                input.value = org.name;
                                                input.focus();
                                            }
                                            changeName(org.name);
                                        }
                                        if (searchKey === SearchKey.ID) {
                                            const input = idInputRef.current;
                                            if (input) {
                                                input.value = org.id.toString();
                                                input.focus();
                                            }
                                            changeId(org.id);
                                        }
                                    }}
                                >
                                    {org.name},
                                </div>
                            ))}
                        </div>
                    </div>

                    {!isFold && (
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                            {searchResult.codefCards.map((codefCard, i) => (
                                <div key={i}>
                                    <SearchedCardItem codefCard={codefCard} onClick={() => onCardSelect(codefCard)} />
                                    {/*<CodefCardTagUI codefCard={codefCard} withCompany />*/}
                                </div>
                            ))}
                        </div>
                    )}

                    {searchResult.codefCards.length > 30 && (
                        <div className="flex items-center justify-center">
                            {!isFold && (
                                <button className="btn btn-xs" onClick={() => setFold(true)}>
                                    잠시 접어두기
                                </button>
                            )}
                            {isFold && (
                                <button className="btn btn-xs" onClick={() => setFold(false)}>
                                    {searchResult.codefCards.length.toLocaleString()}개의 카드 펼치기
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});
SearchCardInput.displayName = 'SearchCardInput';

const SearchedCardItem = memo((props: {codefCard: CodefCardDto; onClick: () => any}) => {
    const {codefCard, onClick} = props;

    const company = codefCard.account?.company || ' - ';
    const isConnected = !!codefCard.creditCardId;

    return (
        <div className="mb-1">
            <div
                onClick={onClick}
                className={`grid grid-cols-4 items-center mb-0.5 text-12 ${
                    !isConnected ? 'opacity-30' : ''
                } cursor-pointer`}
            >
                <div>
                    <span className="badge badge-xs">#{codefCard.id}</span>
                </div>
                <div className="">
                    <span className="">{company}</span>
                </div>
                <div>
                    <CodefCardTagUI codefCard={codefCard} />
                </div>
                <div>{isConnected ? <FaCheck className="text-green-400" /> : <></>}</div>
            </div>
        </div>
    );
});
