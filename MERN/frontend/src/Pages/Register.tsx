import React from 'react';
import {useEffect, useState} from 'react';
import '../Style/register.css';

function RegisterPage(){

    const initialValues = {
        email: "",
        password: "",
        name: "",
    }

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState(initialValues);
    const [user, setUser] = useState();
    
    const handleSubmit = () =>{
        console.log('in handleSubmit');

    }

    const handleChange =(e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = e.target;
        setFormValues({...formValues, [name]:value});
    }


    return(
        <div className='register-page'>
            <div className='register-container'>
                <div className='register-header'>
                    <h1 id='register-header-title'>John Cage Tribute</h1>
                    <h3>Create an account to get started</h3>
                    <hr/>
                </div>

                <div id='register-input'>
                    <form onSubmit={handleSubmit}>
                        <div className='input-group'>
                            <div className='email-group'>
                                <label htmlFor='Email' style={{fontSize: 'calc(5px + 2vmin)'}}>Email</label>
                                <input 
                                    type='text'
                                    name='email'
                                    id='register-email'
                                    value={formValues.email}
                                    onChange={handleChange}
                                    style={{display:'block', padding: '10px', width: '100%',borderRadius:'1em'}}
                                ></input>
                                <p className='error'>{formErrors.email}</p>
                            </div>

                            <div className='password-group'>
                                <label htmlFor='Password' style={{marginRight: '120px', fontSize: 'calc(5px + 2vmin)'}}>Password</label>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;