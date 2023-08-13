import {useRouter} from 'next/router';
import {
    ContentPanel,
    ContentPanelItem,
    ContentPanelItemText,
    ContentPanelItemTitle,
    ContentPanelList,
} from '^layouts/ContentLayout';
import {applicationPrototypeApi} from '^api/applicationPrototype.api';
import React from 'react';
import {ApplicationPrototypeDto} from '^types/applicationPrototype.type';
import {AdminPrototypesPageRoute} from '^pages/admin/prototypes';

interface PrototypeDeletePanelProps {
    prototype: ApplicationPrototypeDto;
}
export const PrototypeDeletePanel = (props: PrototypeDeletePanelProps) => {
    const router = useRouter();
    const {prototype} = props;
    const onclick = () => {
        applicationPrototypeApi.destroy(prototype.id).then(() => router.replace(AdminPrototypesPageRoute.path()));
    };

    return (
        <ContentPanel title="위험 구역!">
            <ContentPanelList>
                <ContentPanelItem>
                    <div className="flex-1">
                        <ContentPanelItemTitle text="이 앱을 스코디 전체에서 제거합니다." />
                        <ContentPanelItemText
                            text={`
                            <ul>
                              <li>앱을 삭제하면 스코디를 사용하는 <b>모든 조직의 구독이 삭제됩니다.</b></li>
                              <li><b>이 작업은 돌이킬 수 없습니다.</b> 신중하게 검토 후 삭제하세요!</li>
                            </ul>
                            `}
                        />
                    </div>
                    <div className="flex-1 text-end">
                        <button type="button" className="btn btn-error text-white" onClick={onclick}>
                            관리자 권한으로 이 앱 삭제하기
                        </button>
                    </div>
                </ContentPanelItem>
            </ContentPanelList>
        </ContentPanel>
    );
};
