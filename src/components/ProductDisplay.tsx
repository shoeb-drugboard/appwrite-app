import React from 'react'
import db from '@/utils/appwrite/databases';
type Product = {
    name: string;
    description: string;
    price: number;
    image: string;
}
type User = {
    name: string;
    email: string;
    LoggedIn: boolean;
}
const ProductDisplay = () => {

    const [data, setData] = React.useState<Product[]>([])
    const [user, setUser] = React.useState<User[]>([])
    React.useEffect(() => {
        db.products.list().then((res) => {
            setData(res.documents as [])
        }).catch((err) => {
            console.log(err)
        })
        db.users.list().then((res) => {
            setUser(res.documents as [])
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    return (
        <div className='grid grid-flow-col md:grid-cols-3 gap-4 place-content-center w-full'>
            <div className="container">
                {data.map((product, index) => (
                    <div key={index} className='border border-gray-200 p-4'>
                        <h1 className='text-2xl font-bold'>{product.name}</h1>
                        <p className='text-lg'>{product.description}</p>
                        <p className='text-lg font-bold'>${product.price}</p>
                        {/* <img src={product.image} alt={product.name} className='w-full h-64 object-cover' /> */}
                    </div>
                ))}
            </div>
            <div className="container">

                {
                    user && user.map((user, index) => (
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