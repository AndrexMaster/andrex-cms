import { Head, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

import AuthLayout from '@layouts/auth-layout';
import { TextField } from '@components/Fields';
import { AButton } from '@components/Buttons';
import { Divider } from '@components/common';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, get, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <TextField
                    name={'email'}
                    placeholder={'example@email.com'}
                    title={'Email'} value={data.email}
                    onChange={value => setData('email', value)}
                />
                <TextField
                    name={'password'}
                    type={"password"}
                    placeholder={'Your password'}
                    title={''} value={data.password}
                    onChange={(value) => setData('password', value)}
                />
                <div className={'flex gap-6'}>
                    <AButton className={'w-full'} type={'submit'}>Sign in</AButton>
                    <Divider orientation={'vertical'}/>
                    <AButton
                        variant={'text'}
                        className={'w-full'}
                        onClick={() => get(route('register'))}
                    >Register</AButton>
                </div>
            </form>

            <i>Status bar</i>
        </AuthLayout>
    );
}
