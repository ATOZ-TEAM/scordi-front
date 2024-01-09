import Tippy from '@tippyjs/react/headless';
import {Modifier} from '@popperjs/core/lib/types';

interface DropdownBackdropProps {
    visible: boolean;
    allowScroll?: boolean; // default: false
}

const clientRect = {
    width: 0,
    height: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
};

const applyStyles: Partial<Modifier<any, any>> = {
    name: 'applyStylesCustom',
    enabled: true,
    phase: 'write',
    fn({state}) {
        state.elements.popper.style.pointerEvents = '';
        state.elements.popper.style.width = '100vw';
        state.elements.popper.style.height = '100vh';
        state.elements.popper.style.maxWidth = '100vw';
        state.elements.popper.style.position = 'fixed';
        state.elements.popper.style.transform = '';
        state.elements.popper.style.top = '0';
        state.elements.popper.style.left = '0';
    },
};

export const DropdownBackdrop = (props: DropdownBackdropProps) => {
    const {visible, allowScroll = false} = props;

    const scrollLock = () => {
        if (allowScroll) return;
        const backdrop2 = document.querySelector('.dropdown-backdrop2');
        if (!backdrop2) document.body.classList.add('modal-opened');
    };

    const scrollUnlock = () => {
        if (allowScroll) return;
        const [curr, backdrop2] = Array.from(document.querySelectorAll('.dropdown-backdrop2'));
        if (!backdrop2) document.body.classList.remove('modal-opened');
        curr?.closest('[data-tippy-root]')?.remove();
    };

    return (
        <Tippy
            visible={visible}
            reference={document.body}
            appendTo={() => document.getElementById('dropdown-portal')!}
            placement="bottom-start"
            getReferenceClientRect={() => clientRect as ClientRect}
            popperOptions={{
                modifiers: [applyStyles],
                strategy: 'fixed',
            }}
            onShow={scrollLock}
            onHide={scrollUnlock}
            render={(attrs, content, instance) => (
                <div {...attrs}>
                    <div
                        className="dropdown-backdrop2"
                        style={{width: '100vw', height: '100vh'}}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    />
                </div>
            )}
        />
    );
};
DropdownBackdrop.displayName = 'DropdownBackdrop';
