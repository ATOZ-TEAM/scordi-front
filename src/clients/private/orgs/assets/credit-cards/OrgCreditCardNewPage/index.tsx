import React, {memo, useEffect, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {plainToInstance} from 'class-transformer';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {delay} from '^components/util/delay';
import {errorNotify} from '^utils/toast-notify';
import {OrgCreditCardListPageRoute} from '^pages/orgs/[id]/creditCards';
import {orgIdParamState} from '^atoms/common';
import {Breadcrumb} from '^clients/private/_layouts/_shared/Breadcrumb';
import {MainContainer, MainLayout} from '^clients/private/_layouts/MainLayout';
import {CreateCreditCardDto, CreditCardUsingStatus, UnSignedCreditCardFormData} from '^models/CreditCard/type';
import {creditCardApi} from '^models/CreditCard/api';
import {CardContainer, FormContainer} from '^clients/private/_components/containers';
import {FormControl} from '^clients/private/_components/inputs/FormControl';
import {inputTextToCardNumberInShortFormat} from '^utils/input-helper';
import {NumericTextInput} from '^clients/private/_components/inputs/NumericTextInput';
import {UnderlineDropdownSelect} from '^clients/private/_components/inputs/UnderlineDropdownSelect';
import {IsCreditCardTag, IsPersonalTag, UsingStatusTag} from '^models/CreditCard/components';
import {TeamMemberSelectColumn} from '^models/TeamMember/components/TeamMemberSelectColumn';
import {FaCaretDown} from 'react-icons/fa6';
import {rangeToArr} from '^utils/range';
import {padStart} from 'lodash';
import {CardAccountsStaticData} from '^models/CodefAccount/card-accounts-static-data';
import {FadeUp} from '^clients/private/orgs/subscriptions/OrgSubscriptionConnectsPage/ContentFunnels/_common/FadeUp';
import {ConnectMethodCard} from '^v3/V3OrgConnectsPage/ConnectsPageBody/ConnectMethodCard';
import {useRouter} from 'next/router';
import {useCreditCardListForListPage} from '^models/CreditCard/hook';

const CardCompanies = CardAccountsStaticData.all();

export const OrgCreditCardNewPage = memo(function OrgCreditCardNewPage() {
    const router = useRouter();
    const orgId = useRecoilValue(orgIdParamState);
    const form = useForm<CreateCreditCardDto>();
    const [expiryValues, setExpiryValues] = useState<[string, string]>([]);
    const [isLoading, setLoading] = useState(false);
    const {search} = useCreditCardListForListPage();

    useEffect(() => {
        form.setValue('usingStatus', CreditCardUsingStatus.InUse);
        form.setValue('isPersonal', false);
        form.setValue('isCreditCard', true);
    }, []);

    const onSubmit = async (dto: CreateCreditCardDto) => {
        const formData = plainToInstance(UnSignedCreditCardFormData, dto);

        if (!formData.name) {
            toast.error('카드 별칭을 입력해주세요');
            return;
        }

        if (!formData.number1 || !formData.number2 || !formData.number3 || !formData.number4) {
            toast.error('카드 번호를 입력해주세요');
            return;
        }

        if (expiryValues.length) {
            if (expiryValues.length != 2) {
                toast.error('유효기간 입력이 완료되지 않았습니다');
                return;
            }
            if (expiryValues[0].length != 4 || expiryValues[1].length != 2) {
                toast.error('유효기간 입력이 올바르지 않습니다');
                return;
            }
            const [year, month] = expiryValues;
            formData.expiry = `${month}${year.slice(2, 4)}`;
        }

        setLoading(true);
        const req = creditCardApi.create(orgId, formData.toCreateDto());
        await delay(2000);

        req.then(() => {
            toast.success('새 카드를 추가했어요 :)');
            search(
                {
                    where: {organizationId: orgId},
                    order: {id: 'DESC'},
                    page: 1,
                    itemsPerPage: 30,
                },
                false,
                true,
            );
            router.push(OrgCreditCardListPageRoute.path(orgId));
        })
            .catch(errorNotify)
            .finally(() => setLoading(false));
    };

    const cardCompany = form.watch('issuerCompany');
    const setCompany = (cardCompany?: CardAccountsStaticData) => {
        form.setValue('issuerCompany', cardCompany ? cardCompany.displayName : undefined);
    };

    return (
        <MainLayout>
            <MainContainer>
                <Breadcrumb
                    paths={[
                        '자산',
                        {text: '결제수단 (카드)', active: false, href: OrgCreditCardListPageRoute.path(orgId)},
                        {text: '카드 등록', active: true},
                    ]}
                />

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl mb-1">결제수단 추가</h1>
                        <p className="text-14 text-gray-500">
                            결제수단을 스코디에 추가하기 위한 필수/선택 정보를 입력해주세요.
                        </p>
                    </div>
                </div>

                {/* 카드사 선택 단계 */}
                {!cardCompany && (
                    <section className="relative mb-20">
                        <div className="mb-10">
                            <h2 className="leading-none text-xl font-semibold">먼저 카드사를 선택해주세요</h2>
                            <p className="text-16 text-gray-500"></p>
                        </div>

                        <div className="grid grid-cols-2 md2:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {CardCompanies.map((company, i) => (
                                <ConnectMethodCard
                                    key={i}
                                    logo={company.logo}
                                    title={company.displayName}
                                    onClick={() => setCompany(company)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* 정보입력 단계 */}
                <FadeUp show={!!cardCompany} delay="delay-[50ms]" leaveDuration="duration-0" leaveNoEffect>
                    <div className="mb-10 flex items-center justify-between">
                        <h2 className="leading-none text-xl font-semibold">세부 정보를 입력해주세요</h2>

                        <div className="flex items-center gap-4">
                            <p className="text-16 text-gray-500">
                                선택된 카드사: <b>{cardCompany}</b>
                            </p>
                            <button className="btn btn-xs btn-scordi gap-2" onClick={() => setCompany(undefined)}>
                                변경하기
                            </button>
                        </div>
                    </div>

                    <FormContainer onSubmit={form.handleSubmit(onSubmit)} isLoading={isLoading}>
                        <div className="px-4 py-8 border-b">
                            <div className="max-w-md mx-auto flex flex-col gap-8 mb-16">
                                <h2 className="leading-none text-xl font-semibold">필수정보</h2>
                                <FormControl label="카드 이름" required>
                                    <input
                                        className={`input input-underline !bg-slate-100 w-full ${
                                            isLoading ? 'opacity-50 pointer-events-none' : ''
                                        }`}
                                        onChange={(e) => form.setValue('name', e.target.value)}
                                        readOnly={isLoading}
                                        required
                                    />
                                    <span />
                                </FormControl>
                                <FormControl label="카드 번호" required>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        <div>
                                            <CardNumberInput
                                                defaultValue={form.watch('number1')}
                                                onChange={(val) => form.setValue('number1', val)}
                                                className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                                readOnly={isLoading}
                                            />
                                            <span />
                                        </div>
                                        <div>
                                            <CardNumberInput
                                                defaultValue={form.watch('number2')}
                                                onChange={(val) => form.setValue('number2', val)}
                                                className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                                readOnly={isLoading}
                                            />
                                            <span />
                                        </div>
                                        <div>
                                            <CardNumberInput
                                                defaultValue={form.watch('number3')}
                                                onChange={(val) => form.setValue('number3', val)}
                                                className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                                readOnly={isLoading}
                                            />
                                            <span />
                                        </div>
                                        <div>
                                            <CardNumberInput
                                                maxLength={5}
                                                defaultValue={form.watch('number4')}
                                                onChange={(val) => form.setValue('number4', val)}
                                                className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                                readOnly={isLoading}
                                            />
                                            <span />
                                        </div>
                                    </div>
                                </FormControl>
                            </div>

                            <div className="max-w-md mx-auto flex flex-col gap-8">
                                <h2 className="leading-none text-xl font-semibold">선택정보</h2>
                                <FormControl label="사용상태">
                                    <UnderlineDropdownSelect
                                        defaultValue={form.watch('usingStatus')}
                                        options={[
                                            CreditCardUsingStatus.UnDef,
                                            CreditCardUsingStatus.NoUse,
                                            CreditCardUsingStatus.InUse,
                                            CreditCardUsingStatus.Expired,
                                        ]}
                                        toComponent={(usingStatus: CreditCardUsingStatus) => (
                                            <UsingStatusTag value={usingStatus} />
                                        )}
                                        onChange={(usingStatus: CreditCardUsingStatus) => {
                                            form.setValue('usingStatus', usingStatus);
                                        }}
                                        className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                    />
                                </FormControl>
                                <FormControl label="구분">
                                    <UnderlineDropdownSelect
                                        defaultValue={form.watch('isPersonal')}
                                        options={[true, false]}
                                        toComponent={(isPersonal: boolean) => <IsPersonalTag value={isPersonal} />}
                                        onChange={(isPersonal) => form.setValue('isPersonal', isPersonal)}
                                        className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                    />
                                </FormControl>
                                <FormControl label="종류">
                                    <UnderlineDropdownSelect
                                        defaultValue={form.watch('isCreditCard')}
                                        options={[true, false]}
                                        toComponent={(isCreditCard: boolean) => (
                                            <IsCreditCardTag value={isCreditCard} />
                                        )}
                                        onChange={(isCreditCard) => form.setValue('isCreditCard', isCreditCard)}
                                        className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                    />
                                </FormControl>
                                <FormControl label="유효기간">
                                    <div className="flex items-center gap-2">
                                        <div>년도</div>
                                        <div className="flex-1">
                                            <UnderlineDropdownSelect
                                                maxHeight="200px"
                                                options={rangeToArr(2024 - 10, 2024 + 10)}
                                                onChange={(year: number) => {
                                                    setExpiryValues((arr) => {
                                                        const newArr = [...arr];
                                                        newArr[0] = `${year}`;
                                                        return newArr;
                                                    });
                                                }}
                                                className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                            />
                                        </div>
                                        <div className="px-2">/</div>
                                        <div>월</div>
                                        <div className="flex-1">
                                            <UnderlineDropdownSelect
                                                maxHeight="200px"
                                                options={rangeToArr(1, 12)}
                                                onChange={(month: number) => {
                                                    setExpiryValues((arr) => {
                                                        const newArr = [...arr];
                                                        newArr[1] = padStart(`${month}`, 2, '0');
                                                        return newArr;
                                                    });
                                                }}
                                                className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                            />
                                        </div>
                                    </div>
                                </FormControl>
                                <FormControl label="소지자">
                                    <div
                                        className={`input input-underline !bg-slate-100 w-full flex items-center justify-between ${
                                            isLoading ? 'opacity-50 pointer-events-none' : ''
                                        }`}
                                    >
                                        <TeamMemberSelectColumn
                                            onChange={(member) => form.setValue('holdingMemberId', member?.id)}
                                            optionListBoxTitle="소지자를 변경할까요?"
                                            detachableOptionBoxTitle="현재 소지자"
                                            className="flex-auto"
                                        />
                                        <FaCaretDown fontSize={12} className="text-gray-500" />
                                    </div>
                                    <span></span>
                                </FormControl>
                                <FormControl label="비고">
                                    <input
                                        className={`input input-underline !bg-slate-100 w-full ${
                                            isLoading ? 'opacity-50 pointer-events-none' : ''
                                        }`}
                                        onChange={(e) => form.setValue('memo', e.target.value)}
                                        readOnly={isLoading}
                                    />
                                    <span />
                                </FormControl>
                            </div>
                        </div>
                    </FormContainer>
                </FadeUp>
            </MainContainer>
        </MainLayout>
    );
});

interface CardNumberInputProps {
    defaultValue?: string;
    maxLength?: number;
    onChange?: (val: string) => any;
    className?: string;
    readOnly?: boolean;
}

const CardNumberInput = (props: CardNumberInputProps) => {
    const {defaultValue, maxLength = 4, onChange, className = '', readOnly = false} = props;
    return (
        <NumericTextInput
            minLength={4}
            maxLength={maxLength}
            placeholder="●●●●"
            defaultValue={defaultValue}
            invalidMessage="번호가 너무 짧아요"
            className={`input input-underline !bg-slate-100 px-2 w-full ${className}`}
            onChange={(e) => {
                const val = inputTextToCardNumberInShortFormat(e);
                onChange && onChange(val);
            }}
            readOnly={readOnly}
        />
    );
};
