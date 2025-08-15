import SignInFormClient from '@/features/auth/components/SignInFormClient';
import Image from 'next/image'
import React from 'react'

const SignInPage = () => {
  return (
    <div className='flex flex-col items-center justify-center space-y-6 h-screen'>
    <Image src="/logo.svg" alt="logo" width={300} height={300} />
    <SignInFormClient/>
    </div>
  )
}

export default SignInPage;