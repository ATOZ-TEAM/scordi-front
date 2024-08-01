import React, {memo, useEffect} from 'react';
import {ModalProps} from '^components/modals/_shared/Modal.types';
import {SlideUpModal} from '^components/modals/_shared/SlideUpModal';
import {orgIdParamState, teamIdParamState} from '^atoms/common';
import {useRecoilValue} from 'recoil';
import {useCreditCardListForListPage} from '^models/CreditCard/hook';
import {CreditCardDto} from '^models/CreditCard/type';
import {teamCreditCardApi} from '^models/TeamCreditCard/api';
import {CreditCardProfileOption2} from '^models/CreditCard/hook/components/CreditCardProfile';
import {FiCheckCircle} from 'react-icons/fi';
import {TeamCreditCardDto} from '^models/TeamCreditCard/type';
import {InvoiceAccountProfile} from '^models/InvoiceAccount/components';
import {BsCheckCircle, BsCheckCircleFill} from 'react-icons/bs';
import {toast} from 'react-toastify';

interface AddPaymentModalProps extends ModalProps {
    preItems?: TeamCreditCardDto[];
}

export const AddPaymentModal = memo(function AddPaymentModal(props: AddPaymentModalProps) {
    const {preItems} = props;
    const orgId = useRecoilValue(orgIdParamState);
    const teamId = useRecoilValue(teamIdParamState);
    const {isOpened, onClose} = props;
    const {result, search} = useCreditCardListForListPage();
    const [selected, setSelected] = React.useState<CreditCardDto[]>([]);

    const onSave = () => {
        const requests = selected.map((creditCard) =>
            teamCreditCardApi.create(orgId, {teamId: teamId, creditCardId: creditCard.id}),
        );
        const req = Promise.allSettled(requests);
        req.then(() => {
            toast.success('새로운 결제수단을 연결했어요');
            setSelected([]);
            onClose();
        });
    };

    const onCloseModal = () => {
        setSelected([]);
        onClose();
    };

    const entries = result.items.filter((item) => !preItems?.map((item) => item.creditCard?.id).includes(item.id));

    useEffect(() => {
        !!orgId && !!teamId && search({where: {organizationId: orgId}});
    }, [orgId, teamId]);

    return (
        <div
            data-modal="TeamMemberSelectModal-for-AppShowModal"
            className={`modal modal-bottom ${isOpened ? 'modal-open' : ''}`}
            onClick={onCloseModal}
        >
            <div
                className="modal-box max-w-lg p-0"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
            >
                <div className="p-4 bg-scordi">
                    <h3 className="font-bold text-xl">팀에 등록할 결제수단을 선택해 주세요</h3>
                    <p className={'text-gray-500 mb-3'}>이미 추가된 결제수단은 뺐어요</p>
                </div>
                <div className="px-4 pb-4 flex flex-col h-[50vh] overflow-y-auto no-scrollbar">
                    <div className="flex-1 py-4 px-2 text-sm">
                        <ul>
                            {entries.map((creditCard, i) => (
                                <div
                                    tabIndex={0}
                                    key={i}
                                    className={`px-4 py-2.5 cursor-pointer group hover:bg-gray-100 flex items-center justify-between rounded-box btn-animation ${
                                        selected.includes(creditCard) && 'bg-gray-50'
                                    }`}
                                    onClick={() => {
                                        if (selected.includes(creditCard)) {
                                            setSelected(selected.filter((item) => item !== creditCard));
                                        } else {
                                            setSelected([...selected, creditCard]);
                                        }
                                    }}
                                >
                                    <div className={'flex gap-3 items-center'}>
                                        <CreditCardProfileOption2 item={creditCard} />
                                    </div>
                                    <div>
                                        {selected.includes(creditCard) ? (
                                            <BsCheckCircleFill
                                                size={24}
                                                strokeWidth={0.3}
                                                className="text-indigo-500"
                                            />
                                        ) : (
                                            <BsCheckCircle
                                                size={24}
                                                strokeWidth={0.3}
                                                className="text-indigo-200 group-hover:text-indigo-300"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="p-4 bg-white">
                    <button
                        disabled={selected.length < 1}
                        className="btn btn-lg btn-scordi btn-block rounded-box disabled:border-indigo-100 disabled:bg-indigo-100 disabled:text-indigo-300"
                        onClick={onSave}
                    >
                        {selected.length < 1 ? '선택한 항목이 없습니다' : `${selected.length}개의 선택된 항목`}
                    </button>
                </div>
            </div>
        </div>
    );
});
