import React, { useEffect } from 'react';
import { RegisterForm } from "@/components/register-form";
import background from "@/assets/MakerGrid_Blue_Background.jpg";

const RegisterPage: React.FC = () => {
    useEffect(() => {
        // Reset scroll position when filters change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    return (
        <div
            className="flex min-h-dvh flex-col items-center justify-center  p-6 md:p-10">
            {/* <div className='fixed blur-md opacity-70 w-full h-full'>
                <img loading='lazy' src="" alt="background" className='w-full h-full object-cover' />
            </div> */}
            <div className="w-full max-w-lg md:max-w-3xl">
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;
