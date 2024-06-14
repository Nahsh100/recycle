import React from 'react'
import { userState } from '../atom'
import { useRecoilValue } from 'recoil'

function Home() {
    const user = useRecoilValue(userState)

  return (
    <div>
        <h1>Welcome {user?.email}</h1>
    </div>
  )
}

export default Home