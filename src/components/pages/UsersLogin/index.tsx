import React, {memo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {UserLoginRequestDto} from '^types/user.type';
import {Modal} from '^components/Modal';
import {useCurrentUser} from '^hooks/useCurrentUser';

export const UsersLoginPage = memo(() => {
    const {currentUser, login, loginRedirect} = useCurrentUser(null);
    const form = useForm<UserLoginRequestDto>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (currentUser) loginRedirect(currentUser);

    const submit = (data: UserLoginRequestDto) => {
        login(data)
            .then((user) => loginRedirect(user))
            .catch(() => setIsModalOpen(true));
    };

    return (
        <>
            <Modal
                type={'info'}
                isOpen={isModalOpen}
                title={'Login failed'}
                description={'The email or password is not correct.'}
                buttons={[{text: 'Try again', onClick: () => setIsModalOpen(false)}]}
            />
            <div className={'mx-auto py-20 w-full max-w-md space-y-5'} style={{height: '100vh'}}>
                <form onSubmit={form.handleSubmit(submit)} className={'p-4 m-auto'}>
                    <h1 className="text-7xl  mb-8 font-bold">Login</h1>
                    <h5 className="text-4xl  mb-32">You can join us with Google account ! </h5>
                    <div>
                        {/*<button className="w-full text-center py-3 my-3 border-2 flex space-x-2 items-center justify-center border-slate-200 rounded-lg text-slate-700 hover:border-primary focus:bg-blue-50 active:bg-primary-100 transition duration-300 ">*/}
                        {/*    <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-6 h-6" alt="" />*/}
                        {/*    <span>Continue with Google</span>*/}
                        {/*</button>*/}
                        <button className="btn btn-block btn-lg btn-outline shadow font-medium normal-case mb-3 space-x-4 bg-white border-slate-200 text-slate-700 hover:bg-white hover:border-primary hover:text-slate-700 focus:bg-blue-50 active:bg-primary-100">
                            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-6 h-6" alt="" />
                            <span>Continue with Google</span>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
});