import {memo} from 'react';
import {JwtContainer} from '^models/User/types';
import {api, setToken} from '^api/api';
import {useCurrentUser} from '^models/User/hook';
import {useForm} from 'react-hook-form';
import {userSessionApi} from '^models/User/api/session';

interface TesterLoginDto {
    credential: string;
}
export const TesterLoginForm = memo(() => {
    const {setCurrentUser, loginRedirect} = useCurrentUser(null);
    const form = useForm<TesterLoginDto>();

    const onSubmit = (data: TesterLoginDto) => {
        const url = '/users/session/tester';
        const body = {...data};

        api.post<JwtContainer>(url, body).then((res) => {
            const {token} = res.data;
            setToken(token);
            userSessionApi.index().then((res) => {
                const user = res.data;
                setCurrentUser(user);
                loginRedirect(user);
            });
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="form-control mb-4">
                <label className="label">
                    <span className="label-text font-bold text-2xl">Enter Credential Key</span>
                </label>
                <input
                    type="text"
                    className="input input-bordered w-full max-w-ws"
                    onChange={(e) => {
                        form.setValue('credential', e.target.value);
                        console.log(form.getValues());
                    }}
                />
                <button className="btn btn-sm">Login</button>
            </div>
        </form>
    );
});
