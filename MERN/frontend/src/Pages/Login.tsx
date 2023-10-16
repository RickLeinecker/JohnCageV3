import React from 'react';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import '../Style/login.css';

//API
import LoggingIn from "../API/LoginAPI";

const LoginPage = ({setUserName}:any) =>{

    const initialValues = {
        email: "",
        password:"",
    };


    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState(initialValues);
    const [user, setUser] = useState("");

    const handleChange =(e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = e.target;
        setFormValues({...formValues, [name]:value});
    }   

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        console.log("in handle submit");
        e.preventDefault();
        setFormErrors(validate(formValues));

        const loggedInUser = localStorage.getItem("Username");
        if (loggedInUser)
        {
            console.log("Switching to concert");
            window.location.href = "/Concerts";
        }
    }

    const sendVerificationEmail = (email:string) =>
    {
        const currentURL:string = "https://localhost:3000/";

        
    }

    const validate = (values: { email: string; password: string; }) =>{
        const errors = regexCheck(values);
        // if(errors.email === '' && errors.password === ''){
        //     takeCredentials(values.email, values.password);
        // }
        LoggingIn(values.email, values.password, setUserName);
            
        
        return errors;
    }   
    
    const regexCheck = (values: {email: string; password:string; }) =>{
        const errors = {
            email: '',
            password: '',
        };
        const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-z]+$/g;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if(values.email === ''){
            errors.email = '*Email is blank';
        }
        // else if(!emailRegex.test(values.email)){
        //     errors.email = "*Invalid email address format. Please try again";
        // }
        if(values.password === ''){
           errors.password = '*Password is blank'
        }
        // if(!passwordRegex.test(values.password)){
        //     errors.password = "*Invalid password format. Please try again";
        // }
        return errors;
    }
    useEffect(() =>{
        const loggedInUser = localStorage.getItem("Username");
        if(loggedInUser){

            setUser(loggedInUser);
            setUserName(loggedInUser);
            console.log("Now setting user to "+loggedInUser)
        }
        else
        {
            setUser("");
            setUserName("");
        }
    },[])

    if(user && user != ""){
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
                            <div className='email-group' style={{width: '100%'}}>
                                <label htmlFor='Email' style={{fontSize: 'calc(5px + 2vmin)'}}>Username</label>
                                <input
                                    type='text'
                                    name='email'
                                    id='login-email'
                                    value={formValues.email}
                                    onChange={handleChange}
                                    style={{padding: '10px', width: '100%',borderRadius: '1em'}}
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