"use client";

import React, { useState, useEffect } from 'react';
import { decode } from '../../../public/utils/jwtUtils';

interface UserData {
    username: string;
    role: string;
  }

const Page = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  const handleLogin = async (id: string, password: string) => {
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          password,
        }),
      });

      const data = await response.json();

      console.log('Login response:', data);

      if (response.ok) {
        //successful login, redirect to the specified route
        localStorage.setItem('token', data.token);
        window.location.href = data.redirect;
        console.log('Login successful');
      } else {
        //login error, display the error message
        setLoginError(data.error);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('An error occurred while logging in');
    }
  };

  const handleLoginClick = () => {
    //get input values
    const idInput = document.getElementById('id') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    //call the handleLogin function with the input values
    handleLogin(idInput.value, passwordInput.value);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token:', token);
      setHasToken(true);
      const decodedUserData = decode(token);
      setUserData(decodedUserData); 
      
      if (decodedUserData && decodedUserData.role) {
        if (decodedUserData.role === 'Admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/line_leader';
        }
      }
    }
  }, []); 

  return (
    <div className='pt-32 h-screen'>
    {hasToken ? (
        console.log('Token:', localStorage.getItem('token')),
            <div></div>
        ) : (
            <div className="container max-w-md mx-auto xl:max-w-3xl bg-white h-fill flex rounded-lg shadow overflow-hidden">
             <div className="relative hidden xl:block xl:w-1/2 h-full">
          <img
            className="absolute h-auto w-full object-cover"
            src="@/../utils/images/Logo_lablelTech.png"
            alt="logo labeltech" />
        </div>
          <div className="w-full xl:w-1/2 p-8">
            <form method="post" action="#">
              <h1 className="text-2xl font-bold">
                Log in {userData && userData.username && ` ${userData.username}`}
              </h1>
              <div className="mb-4 mt-6">
                <label className="loginlabel">ID</label>
                <input
                  className="logininput"
                  id="id"
                  type="text"
                  placeholder="Your ID"
                />
              </div>
              <div className="mb-6 mt-6">
                <label className="loginlabel" htmlFor="password">
                  Password
                </label>
                <input
                  className="logininput"
                  id="password"
                  type="password"
                  placeholder="Your password"
                />
              </div>
              <div className="flex w-full mt-8">
                <button
                  className="w-full bg-gray-800 hover:bg-grey-900 text-white text-sm py-2 px-4 font-semibold rounded focus:outline-none focus:shadow-outline h-10 text-center"
                  onClick={handleLoginClick}
                >
                  Log in
                </button>
                
              </div>
                {/* Error Message */}
      {loginError && (
        <div className="mt-2 text-red-500">{loginError}</div>
      )}
            </form>
          </div>
        </div>
        )}
    
    </div>
  )
}

export default Page