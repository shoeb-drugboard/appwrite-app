import React from 'react';
import axios from 'axios';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import useStore from '@/stores/Store';
import { Button } from '@heroui/button';
import { Product } from '@/stores/cartSlice';
import { Card, CardBody } from '@heroui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useInfiniteQuery } from '@tanstack/react-query';

const containerVariants = {
    show: {
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.3 // Increased delay between children
        }
    }
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    show: (index: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: index * 0.2,
            duration: 0.5,
            ease: "easeOut"
        }
    }),
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.2 }
    }
};

const ProductCards = (
    { className }: { className?: string }
) => {
    const PATH = process.env.NEXT_PUBLIC_API_URL;
    const store = useStore(state => state);
    const observerTarget = React.useRef(null);
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ['ecommerce', 'products'],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await axios.get(`${PATH}/ecommerce/products?limit=8&page=${pageParam}`);
            return res.data;
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.data.hasNextPage) return undefined;
            if (allPages.length < 5) return lastPage.data.nextPage;
            else return undefined;
        },
        initialPageParam: 1,
    });

    React.useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        }, {
            threshold: 0.1,
            rootMargin: '100px'
        });

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            observer.disconnect();
        }
    }, [observerTarget, hasNextPage, fetchNextPage]);

    if (status === 'pending') return <div className=''>Loading...</div>
    if (status === 'error') return <div>Error: {status}</div>

    return (
        <AnimatePresence mode="wait">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={cn('h-full w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-4 gap-6 z-10', className)}
            >
                {data?.pages.map((page) => (
                    page.data.products.map((product: Product, index: number) => (
                        <motion.div
                            key={product._id}
                            variants={cardVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            custom={index} // Pass index for custom timing
                            className="card-container"
                        >
                            <Card
                                className='h-max w-full hover:shadow-xl hover:scale-105 transition-all duration-300'
                            >
                                <Image
                                    src={product.mainImage["url"]}
                                    width={400}
                                    height={300}
                                    className='w-full h-[200px] object-cover'
                                    alt={product.name}
                                />
                                <CardBody className='flex flex-col gap-2 p-4'>
                                    <h3 className='font-semibold text-lg '>{product.name}</h3>
                                    <div className='mt-auto'>
                                        <p className='text-xl font-bold text-primary mb-3 overflow-visible'>
                                            &#8377; {product.price}
                                        </p>
                                        {store.getProduct(product._id) ? (
                                            <div className="btns flex gap-4 items-center justify-center w-full">
                                                <Button
                                                    variant='flat'
                                                    onPress={() => store.decQuantity(product._id)}
                                                    className='bg-warning text-xl text-white w-1/4 hover:bg-primary-dark transition-colors duration-300'>
                                                    -
                                                </Button>
                                                <p className='text-center text-lg font-semibold'>
                                                    {store.getProduct(product._id)?.quantity}
                                                </p>
                                                <Button
                                                    variant='flat'
                                                    onPress={() => store.incQuantity(product._id)}
                                                    className='bg-success text-white text-xl w-1/4 hover:bg-primary-dark transition-colors duration-300'>
                                                    +
                                                </Button>
                                            </div>
                                        ) :
                                            <Button
                                                variant='solid'
                                                onPress={() => {
                                                    store.addProduct(product)
                                                }}
                                                className='bg-primary text-white w-full hover:bg-primary-dark transition-colors duration-300'
                                            >
                                                Add to Cart
                                            </Button>
                                        }
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))
                ))}
                {
                    isFetchingNextPage && (
                        <div className="col-span-full text-center py-4">Loading more...</div>
                    )
                }

                <div ref={observerTarget} className='h-20 w-full col-span-full'></div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ProductCards