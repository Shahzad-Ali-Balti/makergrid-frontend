import React,{useEffect} from 'react';
import {LoginForm} from "@/components/login-from";
// import background from '@/assets/background.jpg'

const LoginPage: React.FC = () => {
     useEffect(() => {
        // Reset scroll position when filters change
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, []);
    return (
        <div
            className="flex min-h-svh flex-col items-center justify-center  p-6 md:p-10">
            {/* <div className='fixed blur-md opacity-70 w-full h-full'>
                <img loading='lazy' src="" alt="background" className='w-full h-full object-cover'/>
            </div> */}
            <div className="w-full max-w-sm md:max-w-3xl">
                <LoginForm/>
            </div>
        </div>
    );
};

export default LoginPage;
