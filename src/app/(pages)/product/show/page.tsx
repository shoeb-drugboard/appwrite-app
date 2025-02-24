"use client";
import db from '@/utils/appwrite/databases';
import React from 'react'
type Product = {
    name: string;
    description: string;
    price: number;
    image: string;
}

const Page = () => {
    const [data, setData] = React.useState<Product[]>([])
    React.useEffect(() => {
        db.products.list().then((res) => {
            setData(res.documents as [])
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    return (
        <div>
            {data.map((product, index) => (
                <div key={index} className='border border-gray-200 p-4'>
                    <h1 className='text-2xl font-bold'>{product.name}</h1>
                    <p className='text-lg'>{product.description}</p>
                    <p className='text-lg font-bold'>${product.price}</p>
                    {/* <img src={product.image} alt={product.name} className='w-full h-64 object-cover' /> */}
                </div>
            ))}
        </div>
    )
}

export default Page