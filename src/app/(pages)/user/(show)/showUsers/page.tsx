"use client";
import { account } from '@/utils/appwrite/config';
import { useRouter } from 'next/navigation';
import React from 'react';
// import db from '@/utils/appwrite/databases';
type User = {
    $id: string;
    name: string;
    email: string;
    status: boolean;
}

const Page = () => {
    const router = useRouter();
    const [data, setData] = React.useState<User>({} as User);
    const checkSession = async () => {
        try {
            const session = await account.getSession('current');
            if (!session) {
                router.push('/user/login');
            }
        } catch (error) {
            console.error('Session check failed:', error);
            router.push('/user/login');
        }
    };

    const getUser = async () => {
        account.get().then((res) => {
            console.log(res);
            setData(res);
        }).catch((err) => {
            console.log(err);
            router.push('/user/login');
        })
    }

    React.useEffect(() => {
        checkSession();
        getUser();
    }, []);

    return (
        <div className='h-screen w-full flex flex-col justify-center items-center'>
            <div className='w-1/2'>
                <h1 className='text-3xl font-bold'>User</h1>
                <div className="w-full">
                    <table className="w-full border-collapse shadow-lg bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <td className="px-6 py-4 text-left font-semibold">S.no</td>
                                <td className="px-6 py-4 text-left font-semibold">Name</td>
                                <td className="px-6 py-4 text-left font-semibold">Email</td>
                                <td className="px-6 py-4 text-left font-semibold">Status</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={data.$id} className="hover:bg-gray-50 border-b border-gray-200 text-black">
                                <td className="px-6 py-4">{data.$id}</td>
                                <td className="px-6 py-4">{data.name}</td>
                                <td className="px-6 py-4">{data.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-sm ${data.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {data.status ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
// const Page = () => {
//     const [data, setData] = React.useState<User[]>([]);
//     const getDB = async () => {
//         const res = await db.users.list();
//         setData(res.documents as []);
//     }

//     React.useEffect(() => {
//         getDB();
//     }, []);
//     return (
//         <div className='h-screen w-full flex flex-col justify-center items-center'>
//             <div className='w-1/2'>
//                 <h1 className='text-3xl font-bold'>Users</h1>
//                 <div className="w-full">
//                     <table className="w-full">
//                         <thead>
//                             <tr>
//                                 <td>S.no</td>
//                                 <td>Name</td>
//                                 <td>Email</td>
//                                 <td>Is LoggedIn</td>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {data.map((user, index) => (
//                                 <tr key={index}>
//                                     <td>{index + 1}</td>
//                                     <td>{user.name}</td>
//                                     <td>{user.email}</td>
//                                     <td>{user.LoggedIn ? 'Yes' : 'No'}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     )
// }

export default Page