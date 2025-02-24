"use client";
import React, { useEffect } from 'react'
import UserCart from './UserCart'
import UserProfile from './UserProfile'
// import ProductCards from './ProductCards'
import { Button } from '@heroui/button';
import useStore from '@/stores/Store'
import handleRequest from '@/main';

const Main = () => {
    const store = useStore();
    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const { email, username } = JSON.parse(userData)
            store.setName(username)
            store.setEmail(email)
            store.setLoggedIn(true)
        }
    }, [])
    return (
        <div className='w-screen h-screen relative m-auto grid justify-center items-center overflow-x-hidden'>
            <h1 className='text-4xl font-bold text-center my-4 mb-10'>Ecommerce</h1>
            <UserCart />
            <UserProfile />
            <Button className='z-10 bg-danger-200' onPress={() => handleRequest} >Call function</Button>
            {/* <ProductCards /> */}
        </div>
    )
}

export default Main