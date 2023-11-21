import {atom} from 'recoil';
import {ReportDto} from '^components/pages/LandingPages/TastingPage/tabs/type';

export enum TastingTabs {
    SyncWorkspace,
    InvoiceTracker,
}

export const navTabIndex = atom<TastingTabs>({
    key: 'tasting/navTabIndex',
    default: TastingTabs.SyncWorkspace,
});

export const reportState = atom<ReportDto | null>({
    key: 'reportState',
    default: null,
});
