import React from 'react';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import '../Style/login.css';

const LoginPage = () =>{

    const initialValues = {
        email: "",
        password:"",
    };


    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState(initialValues);
    const [user, setUser] = useState();

    const handleChange =(e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = e.target;
        setFormValues({...formValues, [name]:value});
    }   

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        console.log("in handle submit");
        e.preventDefault();
        setFormErrors(validate(formValues));
    }

    const validate = (values: { email: string; password: string; }) =>{
        const errors = {
            email: '',
            password: '',
        };

        if(values.email === ''){
            errors.email = '*Email is blank';
        }
        if(values.password === ''){
           errors.password = '*Password is blank'
        }
        if(values.email !== '' && values.password !== ''){
            //this is where we would connect the API 

        }

        return errors;
    }   
    
    useEffect(() =>{
        const loggedInUser = localStorage.getItem("user");
        if(loggedInUser){
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
        }
    },[])

    if(user){
        return(<div>{user} is logged in</div>);
    }

    return(
        <div className='login-page'>
            <div className='login-container'>
                <div className='login-header'>
                    <h1 id='login-header-title'>John Cage Tribute</h1>
                    <h3>Sign in to get started</h3>
                    <hr/>
                </div>

                <div id='login-input'>
                    <form onSubmit={handleSubmit}>
                        <div className='input-group'>
                            <div className='email-group'>
                                <label htmlFor='Email' style={{fontSize: 'calc(5px + 2vmin)'}}>Email</label>
                                <input
                                    type='text'
                                    name='email'
                                    id='login-email'
                                    value={formValues.email}
                                    onChange={handleChange}
                                    style={{display:'block', padding: '10px', width: '100%',borderRadius: '1em'}}
                                ></input>
                                <p className='error'>{formErrors.email}</p>
                            </div>
                            <div className='password-group'>
                                <label htmlFor='Password' style={{marginRight: '120px',fontSize: 'calc(5px + 2vmin)'}}>Password</label>
                                <Link 
                                    className='forgot-password'
                                    to='/resetpass.tsx'>
                                    Forgot Password?
                                </Link>
                                <input
                                    type='text'
                                    name='password'
                                    id='login-password'
                                    value={formValues.password}
                                    onChange={handleChange}
                                    style={{display:'block', padding: '10px', width: '100%',borderRadius: '1em'}}
                                ></input>
                                <p className='error'>{formErrors.password}</p>
                            </div>
                            <br/>
                            <div className='submit-btn'>
                                <button type='submit' className='login-button'>
                                    Login
                                </button>
                            </div>
                        </div>
                        <Link className= 'login-register-swap' to='/pages/Register.tsx'>
                            Don't have an account yet?
                        </Link>
                    </form>
                </div>
                
            </div>
        </div>
    );
}

export default LoginPage;