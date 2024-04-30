import Link from 'next/link';
import React from 'react';

type NotLoggedInProps = {
    
};

const NotLoggedIn:React.FC<NotLoggedInProps> = () => {
    
    return (
        <main className='w-full h-[100vh] flex justify-center items-center'>
            <div className='flex flex-col justify-center items-center gap-10'>
                <h1 className='text-3xl'>Moraš prvo da se uloguješ.</h1>
                <Link className='btn' href={"/login"}>Login</Link>
            </div>
        </main>
    )
}
export default NotLoggedIn;