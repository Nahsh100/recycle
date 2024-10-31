import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useRecoilState } from 'recoil'
import { userState } from '../atom'
import image from "../assets/recycle.jpeg"
import logo1 from '../assets/rlogo.jpeg'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [user, setUser] = useRecoilState(userState)
    const navigate = useNavigate()


    const handleSignIn = async () => {
        if(email && password){
            setIsLoading(true)
            setError('')
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
            
                // Fetch user document from Firestore
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
            
                if (userDoc.exists()) {
                  console.log('User signed in successfully:', user);
                  setUser(user)
                  navigate('/')
                 
                } else {
                  console.error('User not found in Firestore');
                  setError('User does not exist')
                }
              } catch (error) {
                console.error('Error signing in:', error);
                //@ts-ignore
                setError(error.message)
              }
              finally {
                setIsLoading(false)
              }
        }else{
            setError('Please fill in both username and Password')
        }
       
      };

  return (
    <div className='flex  jusify-center items-center' style={{
      backgroundImage: `url(${image})`,
      height: "100vh",
      width: "100%",
      objectFit: "contain",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",}}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the rgba values for desired color and opacity
        zIndex: 1 // Ensure overlay is above the background but below content
    }} />
    <div style={{ zIndex: 2, position: 'relative' }} className='mx-auto flex flex-col items-center'>
      <img src={logo1} alt="Logo" className='w-20 h-20 rounded-full mb-5'/>
    <h1 className='text-3xl text-white mb-10'>E-WASTE MANAGEMENT SYSTEM</h1>

    <div  className='w-[320px] bg-white p-5   items-center flex flex-col space-y-5 ' >
        <h1 className='w-full text-center text-2xl font-semibold'>Login</h1>
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

        <button onClick={handleSignIn} className='w-full bg-slate-800 text-white p-2'>{isLoading ? 'Logging in...': 'Login'}</button>
        <div className='flex space-x-2'>
        <h2>Don't have an account? </h2>
        <Link to='/signup'>
        <span className='text-blue-500'>Sign up</span>
        </Link>
        </div>
    </div>
    </div>

    </div>
    
  )
}

export default Login