import {Link} from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage(){
    //We need to add some state for our input
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [userType,SetUserType] = useState('');
    const [password,setPassword] = useState('');

    // {/* The Register button will submit register form. This function will define on submit*/}
    async function registerUser(ev){ // On the submit of form we need to grap an event(ev) and 
        // This function will be called on submit of form
        //For the register user we will send a request to our API,
        ev.preventDefault();//it will not reload the page
        //axios.get("http://localhost:4000/test");
        //axios.get("/test");
        try{
            await axios.post("/register",{ //About this endpoint(post) we need to define inside index.js //await-> we will wait for user
                //The data we want to sent are -->
                name,
                email,
                userType: "Customer",  //Sending userType For all
                password,
            }); //We wand to post to register
            alert('Registration Successful.Now you can login')
        }
        catch(e){
            alert('Registration failed. Please try again later')
        }
    }
    return(
        <div className="mt-4 grow flex items-center justify-around">
            {/*mt-4->mergin top-4 */}
            <div className="mb-64">
                {/*mb-64->Margin botton of 64*/}
                <h1 className="text-4xl text-center mb-4">Register</h1>
                {/* mb-4->Margin Button of 4 */}
                {/* <form className="max-w-md mx-auto broder"> */}
                <form className="max-w-md mx-auto broder" onSubmit={registerUser}>
                    {/*max-w-md->Maximum-Width-Medium 
                       mx-auto->Margin*/}
                       <input type="text"
                            placeholder="Jhone Doe"
                            // add state to our input
                            value={name}
                            onChange={ev => setName(ev.target.value)}/>{/* onChange we get a event, here set name with event Target value*/}
                       <input type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={ev => setEmail(ev.target.value)}/>
                        {/* <input type="text"
                              placeholder="Admin/Customer"
                              value={userType}
                              onChange={ev => SetUserType(ev.target.value)}/> */}
                        <input type="password"
                               placeholder="password"
                               value={password}
                               onChange={ev => setPassword(ev.target.value)}/>

                        {/* The Register button will submit this form*/}
                        <button className="primary">Register</button>
                        {/* If Don't have an account yet, We have Create a link to open Register Form*/}
                        <div className="text-center py-2 text-gray-500">
                            Already a memeber? 
                            <Link className="" to={'/login'}>
                                Login
                            </Link>
                        </div>
                    </form>
            </div>
        </div>
    )
}
