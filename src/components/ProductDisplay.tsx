import React from 'react'
import { useQuery } from '@tanstack/react-query';
import appwriteApi, { appwriteEndpoints } from '@/utils/appwrite/api';
import db from '@/utils/appwrite/databases';
type Product = {
    name: string;
    price: number;
    description: string;
    image: string;
}
type User = {
    name: string;
    email: string;
    LoggedIn: boolean;
}
const ProductDisplay = () => {
    const { data: products, error: productsError, isLoading: productsLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await db.products.list();
            return res.documents as [];
            // const res = await appwriteApi.get(appwriteEndpoints.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '', process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PRODUCTS_ID || ''))
            // return res.data.documents
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity
    })

    const { data: users, error: usersError, isLoading: usersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await appwriteApi.get(appwriteEndpoints.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '', process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS_ID || ''))
            return res.data.documents
        },
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    })

    if (productsLoading || usersLoading) return <div>Loading...</div>
    if (productsError) return <div>Error loading products</div>
    if (usersError) return <div>Error loading users</div>

    return (
        <div className='grid grid-flow-col md:grid-cols-3 gap-4 place-content-center w-full'>
            <div className="container">
                {products?.map((product: Product, index: number) => (
                    <div key={index} className='border border-gray-200 p-4'>
                        <h1 className='text-2xl font-bold'>{product.name}</h1>
                        <p className='text-lg'>{product.description}</p>
                        <p className='text-lg font-bold'>${product.price}</p>
                    </div>
                ))}
            </div>
            <div className="container">
                {
                    users.map((user: User, index: number) => (
                        <div key={index} className='border border-gray-200 p-4'>
                            <h1 className='text-2xl font-bold'>{user.name}</h1>
                            <p className='text-lg'>{user.email}</p>
                            <p className='text-lg font-bold'>{user.LoggedIn ? 'Logged In' : 'Logged Out'}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ProductDisplay