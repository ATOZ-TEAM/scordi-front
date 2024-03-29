import React, {FC, FormEventHandler} from 'react';
import {WithChildren} from '^types/global.type';
import {DefaultButton} from '^components/Button';

interface ContentFormProps {
    onSubmit: FormEventHandler;
    submitBtnHidden?: boolean;
}

export const ContentForm: FC<WithChildren & ContentFormProps> = ({onSubmit, submitBtnHidden = false, children}) => {
    return (
        <div>
            <form
                onSubmit={(e) => {
                    onSubmit(e);
                }}
            >
                {children}

                {!submitBtnHidden && (
                    <div className="w-full mb-10 text-right">
                        <DefaultButton text={'Save'} type={'submit'} isInline={true} />
                    </div>
                )}
            </form>
        </div>
    );
};
