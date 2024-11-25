import React, {memo} from 'react';
import {FaChevronLeft} from 'react-icons/fa6';
import {CardAccountsStaticData, cardAccountsStaticData} from '^models/CodefAccount/card-accounts-static-data';
import {CardCompanyItem} from '^models/CodefAccount/components';

interface CodefCardCompanySelectStepProps {
    onBack: () => any;
    setCompany: (cardCompanyData: CardAccountsStaticData) => any;
}

const CardCompanies = cardAccountsStaticData;

export const CodefCardCompanySelectStep = memo((props: CodefCardCompanySelectStepProps) => {
    const {onBack, setCompany} = props;

    return (
        <div className="h-full">
            <div>
                <div className="mb-4">
                    <FaChevronLeft className="text-gray-400 cursor-pointer" onClick={onBack} />
                </div>
                <p className="font-medium text-12 text-scordi mb-1">새로운 카드 등록하기</p>
                <h3 className="font-bold text-xl leading-tight">
                    어느 카드사의 <br /> 카드를 등록할까요?
                </h3>
            </div>

            <div className="py-4 flex flex-col">
                {CardCompanies.map((cardCompanyData, i) => (
                    <CardCompanyItem
                        key={i}
                        cardCompanyData={cardCompanyData}
                        onClick={() => setCompany(cardCompanyData)}
                    />
                ))}
            </div>
        </div>
    );
});
CodefCardCompanySelectStep.displayName = 'CodefCardCompanySelectStep';
