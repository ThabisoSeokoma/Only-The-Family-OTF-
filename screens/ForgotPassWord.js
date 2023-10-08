import { Form } from "formik";
import { sendPasswordResetEmail } from '@firebase/auth';
import 'firebase/database';
import React from "react";
import { useNavigate } from 'react-router-dom';
function ForgotPassWord(){
    const history=useNavigate();
    const handleSubmit= async(e)=>{
        e.preventDefault()
        const emalVal=e.target.email.value;
        sendPasswordResetEmail(database,emalVal).then(data=>{
            alert("check your email")
            history();
            
        }).catch(err=>{
            alert(err.code)
        })

    }
    return (
        <div classname="App">
            <h1>Forgot Password</h1>
            <form onSubmit={(e)=>handleSubmit(e)}>
                <input type="email" name="email" placeholder="Email"/>
                <button type="submit">Reset Password</button>
            </form>
        </div>
    )
}
export default ForgotPassWord;