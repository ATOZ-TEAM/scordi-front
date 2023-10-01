import React, {memo} from 'react';
import {useSetRecoilState} from 'recoil';
import {AttachmentModal, attachmentModalState} from '^components/pages/LandingPages/TastingPage/AttachmentModal';
import {ModalTopbar} from '^v3/share/modals/ModalTopbar';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {PrototypeAvatar} from '^components/pages/LandingPages/TastingPage/TastingItemDetailModal/PrototypeAvatar';
import {HeadingPrice} from '^v3/V3OrgBillingHistoryShowPage/HeadingPrice';
import {MobileInfoList} from '^v3/share/MobileInfoList';
import {MobileInfoListItem} from '^v3/share/MobileInfoList/Item';
import {yyyy_mm_dd_hh_mm} from '^utils/dateTime';
import {OutLink} from '^components/OutLink';
import {BillingHistoryContentPanel} from './BillingHistoryContentPanel';
import {useBillingHistoriesInModal, useBillingHistoryInModal, useBillingHistoryModal} from './hook';

export const BillingHistoryDetailModal = memo(() => {
    const {close, Modal} = useBillingHistoryModal();
    const setAttachmentModal = useSetRecoilState(attachmentModalState);
    const {billingHistory, isLoading: isSubjectLoading} = useBillingHistoryInModal();
    const {pagedHistories, isLoading: isSiblingsLoading} = useBillingHistoriesInModal();

    const onBack = () => close();
    const attachments = billingHistory ? billingHistory.getAttachments() : [];

    return (
        <>
            <Modal wrapperClassName="modal-right" className="p-0 max-w-none sm:max-w-[32rem]">
                <ModalTopbar
                    backBtnOnClick={onBack}
                    title={billingHistory ? billingHistory.pageSubject : '결제 세부사항'}
                    topbarPosition="sticky"
                />
                <MobileSection.List>
                    <MobileSection.Item>
                        <MobileSection.Padding>
                            <div className="w-full h-[40px]" />
                            {!billingHistory ? (
                                isSubjectLoading ? (
                                    <p>is loading ...</p>
                                ) : (
                                    <p>done</p>
                                )
                            ) : (
                                <div>
                                    <PrototypeAvatar proto={billingHistory.subscription.product} />
                                    <HeadingPrice price={billingHistory.payAmount} />

                                    <MobileInfoList>
                                        <MobileInfoListItem label="제목" className="!items-start">
                                            <div className="font-light mb-4 keep-all">{billingHistory.title}</div>
                                        </MobileInfoListItem>
                                        <MobileInfoListItem label="발신" className="!items-start">
                                            <div className="font-light mb-4 keep-all">{billingHistory.from()}</div>
                                        </MobileInfoListItem>
                                        <MobileInfoListItem
                                            label="발신일시"
                                            className="!items-start"
                                            value={yyyy_mm_dd_hh_mm(billingHistory.issuedAt)}
                                        />
                                        {billingHistory.paymentMethod && (
                                            <MobileInfoListItem
                                                label="결제수단"
                                                className="!items-start"
                                                value={billingHistory.paymentMethod}
                                            />
                                        )}
                                        {attachments.length > 0 && (
                                            <MobileInfoListItem label="인보이스" className="!items-start">
                                                <div className="w-full overflow-auto">
                                                    {attachments.map((attachment, i) => (
                                                        <div
                                                            key={i}
                                                            className="font-light text-xs badge overflow-hidden justify-start whitespace-nowrap mb-4"
                                                            onClick={() => setAttachmentModal(attachment)}
                                                        >
                                                            <OutLink
                                                                href={attachment.url!}
                                                                text={attachment.fileName}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </MobileInfoListItem>
                                        )}
                                    </MobileInfoList>
                                </div>
                            )}
                        </MobileSection.Padding>
                    </MobileSection.Item>

                    <BillingHistoryContentPanel billingHistories={pagedHistories.items} />
                </MobileSection.List>
            </Modal>
            <AttachmentModal />
        </>
    );
});