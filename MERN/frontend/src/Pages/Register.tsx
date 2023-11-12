import React from 'react';
import { useEffect, useState } from 'react';
import '../Style/register.css';
import register from '../API/registerAPI';
import { Link } from 'react-router-dom';

function RegisterPage({ setUserName }: any) {

    const initialValues = {
        email: '',
        password: '',
        username: '',
    }

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState(initialValues);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log('in handleSubmit');
        e.preventDefault();
        setFormErrors(validate(formValues));

    }

    function allErrorsClear(errors: { email: string; password: string; username: string; }): boolean {
        return (errors.email === '' && errors.password === '' && errors.username === '');
    }

    const validate = (values: { email: string; password: string; username: string; }) => {
        const errors = regexCheck(values);
        if (allErrorsClear(errors)) {
            //API call goes here;
            //takeCredentials(values.email, values.password);
            register(values.username, values.email, values.password, setUserName);
        }

        return errors;

    }

    const regexCheck = (values: { email: string; password: string; username: string; }) => {
        const errors = initialValues;
        const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-z]+/g;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}/;
        if (values.email === '') {
            errors.email = "Email is empty";
        }
        else if (!emailRegex.test(values.email)) {
            errors.email = "Invalid Email Format, Please try again";
        }

        if (values.password === '') {
            errors.password = "Password is empty";
        }
        else if (!passwordRegex.test(values.password)) {
            errors.password = "You need a capital letter, a number, and minimum of 8 characters";
        }

        if (values.username === '') {
            errors.username = "Cannot be left blank"
        }

        return errors;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    return (
        <div className='register-page'>
            <div className='register-container'>
                <div className='register-header'>
                    <h1 id='register-header-title'>John Cage Tribute</h1>
                    <h3>Create Account</h3>
                    <hr />
                </div>
                <div id='register-input'>
                    <form onSubmit={handleSubmit}>
                        <div className='input-group'>
                            <div className='username-group' style={{ width: '100%' }}>
                                <label htmlFor='username' style={{ fontSize: 'calc(5px + 2vmin' }}>Username</label>
                                <input
                                    type='text'
                                    name='username'
                                    id='register-username'
                                    value={formValues.username}
                                    onChange={handleChange}
                                    style={{ padding: '10px', width: '100%', borderRadius: '1em' }}
                                ></input>
                                <p className='error'>{formErrors.username}</p>
                            </div>
                        </div>
                        <div className='password-group' style={{ width: '100%' }}>
                            <label htmlFor='Password' style={{ fontSize: 'calc(5px + 2vmin)' }}>Password</label>
                            <input
                                type='text'
                                name='password'
                                id='register-password'
                                value={formValues.password}
                                onChange={handleChange}
                                style={{ padding: '10px', width: '100%', borderRadius: '1em' }}
                            ></input>
                            <p className='error'>{formErrors.password}</p>
                        </div>
                        <div className='input-group'>
                            <div className='email-group' style={{ width: '100%' }}>
                                <label htmlFor='Email' style={{ fontSize: 'calc(5px + 2vmin)' }}>Email</label>
                                <input
                                    type='text'
                                    name='email'
                                    id='register-email'
                                    value={formValues.email}
                                    onChange={handleChange}
                                    style={{ padding: '10px', width: '100%', borderRadius: '1em' }}
                                ></input>
                                <p className='error'>{formErrors.email}</p>
                            </div>
                        </div>
                        <div className='submit-btn'>
                            <button type='submit' className='login-button'>
                                Register
                            </button>
                        </div>
                    </form>
                    <Link className='login-register-swap' to='/Login'>
                        Already have an account?
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;