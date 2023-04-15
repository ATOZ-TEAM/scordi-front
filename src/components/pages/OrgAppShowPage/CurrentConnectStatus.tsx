import React, {memo, useCallback, useEffect, useState} from 'react';
import {AiOutlineSync, BsFillCaretDownFill, BsTrash} from '^components/react-icons';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {ConnectStatus} from '^types/application.type';
import {navTabIndex} from './OrgAppShowPage.desktop';
import {useCurrentApplication} from '^hooks/useApplications';
import {createSyncHistory} from '^api/applicationSyncHistories.api';
import {toast} from 'react-toastify';
import {useCurrentUser} from '^hooks/useCurrentUser';
import {useCurrentSyncHistory, useSyncHistoryList} from '^hooks/useApplicationSyncHistories';

export const CurrentConnectStatus = memo(() => {
    const {currentUser} = useCurrentUser();
    const {currentApplication, reload: reloadCurrentApp} = useCurrentApplication();
    const {fetchItems: fetchSyncHistories, pagination} = useSyncHistoryList();
    const {fetchCurrentSyncHistory} = useCurrentSyncHistory();
    const tabIndex = useRecoilValue(navTabIndex);

    const goSync = useCallback(() => {
        if (!currentApplication || !currentUser) return;
        createSyncHistory(currentApplication.id, {
            runnerId: currentUser.id,
            content: `Synchronize manually.`,
        }).then(() => {
            toast.success('New Sync started!');
            if (tabIndex === 3) {
                // if current tab is histories
                fetchSyncHistories(currentApplication.id, pagination.currentPage, true);
                fetchCurrentSyncHistory(currentApplication.id);
            }
            reloadCurrentApp();
        });
    }, [currentApplication, currentUser, tabIndex]);

    const connectStatus = currentApplication ? currentApplication.connectStatus : '';
    const isSyncRunning = currentApplication?.isSyncRunning;

    if (isSyncRunning) {
        return (
            <div className="btn btn-orange-600 loading" title="We're struggling to connecting">
                Sync running ...
            </div>
        );
    }

    return (
        <>
            {connectStatus === ConnectStatus.pending && (
                <div className="btn btn-info btn-outline" title="We're struggling to connecting">
                    {connectStatus}
                </div>
            )}
            {connectStatus === ConnectStatus.success && (
                <div className="dropdown dropdown-end dropdown-hover">
                    <label tabIndex={0} className="btn btn-green-500 btn-outline shadow gap-2">
                        <span className="normal-case">Connected</span>
                        <BsFillCaretDownFill size={11} className="-mr-1" />
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <a onClick={goSync}>
                                <AiOutlineSync /> Sync again
                            </a>
                        </li>
                        <li className="menu-title pt-3">
                            <span>Warning</span>
                        </li>
                        <li>
                            <a className="text-red-600 hover:bg-red-600 hover:text-white">
                                <BsTrash /> Remove
                            </a>
                        </li>
                    </ul>
                </div>
            )}
            {connectStatus === '' && (
                <p className="badge badge-info badge-outline p-5 font-bold" title="We're struggling to connecting">
                    {connectStatus}
                </p>
            )}
        </>
    );
});