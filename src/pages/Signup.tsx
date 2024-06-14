import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useRecoilState } from 'recoil'
import { userState } from '../atom'

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()
    const [user, setUser] = useRecoilState(userState)


    const handleSignUp = async () => {
        if (!email || !password ) {
            setError('Please ensure all fields are filled in')
        }else{
            
                setSuccess(false)
                setError('')
                setIsLoading(true)
                try {
                  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                  const user = userCredential.user;
                    // setUser(user)
                  
                     // Specify a custom ID for the user document
                    const userDocRef = doc(db, 'users', user.uid);
            
                  // Add user document to Firestore
                  await setDoc(userDocRef, {
                    id: user.uid,
                    email,
                    createdAt: new Date(),
                    Role: 'user'
                  });
                  setSuccess(true)
                  console.log('User signed up successfully:', user);
                  setTimeout(() => {
                    navigate('/') 
                  }, 1000)
                } catch (error) {
                  console.error('Error signing up:', error);
                  //@ts-expect-error
                  setError(error.message);
                } finally {
                    setIsLoading(false)
                    setEmail('')
                    setPassword('')
                }
            
        }
       
      };


  return (
    <div className='w-[320px] mx-auto mt-[10%] items-center flex flex-col space-y-5'>
        <h1 className='w-full text-center text-2xl font-semibold'>Sign Up</h1>
        {error && <h2 className='bg-red-300 text-center text-red-600 p-2'>{error}</h2>}

        <input
         className='w-full outline-none
          bg-slate-200 p-3'
           placeholder='Enter email'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

        <input 
        className='w-full outline-none bg-slate-200 p-3'
         placeholder='Enter Password'
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
        <button onClick={handleSignUp} className='w-full bg-slate-800 text-white p-2'>{isLoading ? 'Signing Up...': 'Sign Up'}</button>
        <div className='flex space-x-2'>
        <h2>Already have an account? </h2>
        <Link to='/login'>
        <span className='text-blue-500'>Login</span>
        </Link>
        </div>
    </div>
  )
}

export default Signup