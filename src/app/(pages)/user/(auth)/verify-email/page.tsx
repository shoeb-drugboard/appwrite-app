import React from 'react';
import VerifyEmail from '@/components/VerifyEmail';

const Page = () => {
    return (
        <div className='h-screen w-screen dark bg-background text-foreground grid place-content-center'>
            <VerifyEmail />
        </div>
    );
};

export default Page;