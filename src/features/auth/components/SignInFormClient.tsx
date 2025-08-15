import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Chrome, Github } from 'lucide-react';
import Link from 'next/link';
import { signIn } from '@/auth';

async function handleGoogleSignIn(){
    'use server';
    await signIn('google');
}
async function handleGithubSignIn(){
    'use server';
    await signIn('github');
}

const SignInFormClient = () => {
    return (
        <Card className='w-full max-w-md'>
            <CardHeader className='space-y-1'>
                <CardTitle className='text-2xl font-bold text-center'>Sign in to your account</CardTitle>
                <CardDescription className='text-center'>Enter your email and password to sign in</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardContent className='grid gap-4'>
                <form action={handleGoogleSignIn} className="">
                    <Button type="submit" variant="outline" className='w-full'>
                        <Chrome className='mr-2 h-4 w-4' />
                        <span className="text-sm">Continue with Google</span>
                    </Button>
                </form>
                <form action={handleGithubSignIn} className="">
                    <Button type="submit" variant="outline" className='w-full'>
                        <Github className='mr-2 h-4 w-4' />
                        <span className="text-sm">Continue with Github</span>
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 w-full">
                    By signing in, you agree to our <Link href="#" className='text-black font-bold underline'>Terms of Service</Link> and <Link href="#" className='text-black font-bold underline'>Privacy Policy</Link>
                </p>
            </CardFooter>
        </Card>
    )
}

export default SignInFormClient