import React from 'react';
import {WithChildren} from '^types/global.type';

type DefaultButtonProps = {
    text: string;
    color?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit';
    isInline?: boolean;
};

const colorSets: {[index: string]: string} = {
    purple: `text-white bg-[#7963F7] hover:bg-[#6656bf] drop-shadow-[0_10px_15px_rgba(121,99,247,0.2)] drop-shadow-[0_4px_6px_rgba(121,99,247,0.2)]`,
    white: `text-[#7963F7] bg-white hover:bg-[#f5f5f5] drop-shadow-[0_10px_15px_rgba(121,99,247,0.2)] drop-shadow-[0_4px_6px_rgba(121,99,247,0.2)]`,
};

const makeButtonColor = (color: string) => colorSets[color] || color;

export const DefaultButton = (props: DefaultButtonProps) => {
    return (
        <button
            type={`${props.type ? props.type : 'button'}`}
            disabled={props.disabled}
            className={`
                    btn btn-primary ${!props.isInline && `btn-block`} rounded-[14px] border-none
                    disabled:bg-[#D1D6DB] disabled:drop-shadow-none
                    ${makeButtonColor(props.color ? props.color : 'purple')}
                `}
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
};

export const RoundedButton = (props: DefaultButtonProps & WithChildren) => {
    return (
        <button
            type={`${props.type ? props.type : 'button'}`}
            className={`btn btn-primary btn-block rounded-full`}
            onClick={props.onClick}
        >
            {props.text || props.children}
        </button>
    );
};
