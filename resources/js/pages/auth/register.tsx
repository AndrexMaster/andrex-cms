import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AuthLayout from '@layouts/auth-layout';
import { TextField } from '@components/Fields';
import { AButton } from '@components/Buttons';
import { Divider } from '@components/common';
import React from 'react';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, get, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <TextField
                    name={'name'}
                    placeholder={'Your name'}
                    title={'Name'} value={data.name}
                    onChange={value => setData('name', value)}
                />
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
                <TextField
                    name={'password_confirmation'}
                    type={"password"}
                    placeholder={'Your password'}
                    title={''} value={data.password_confirmation}
                    onChange={(value) => setData('password_confirmation', value)}
                />
                <div className={'flex gap-6'}>
                    <AButton className={'w-full'} type={'submit'}>Register</AButton>
                    <Divider orientation={'vertical'}/>
                    <AButton
                        variant={'text'}
                        className={'w-full'}
                        onClick={() => get(route('login'))}
                    >Sign in</AButton>
                </div>
            </form>

            <i>Status bar?</i>
        </AuthLayout>
    );
}
