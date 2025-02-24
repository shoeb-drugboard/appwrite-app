import React from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { Link } from '@heroui/link';
import useStore from '@/stores/Store';
import { Button } from '@heroui/button';
import { DoorOpen, ShoppingCart } from 'lucide-react';
import { useDisclosure } from '@heroui/use-disclosure';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@heroui/drawer';

const UserCart = ({ className }: { className?: string }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const store = useStore(state => state);
    const [cart, setCart] = React.useState(store.products);
    React.useEffect(() => {
        setCart(store.products)
    }, [store.products]);
    return (
        <div className={cn('absolute h-screen w-screen z-10', className)}>
            <Button className={cn("capitalize absolute top-8 right-32 bg-primary text-white w-24 hover:bg-primary-dark transition-colors duration-300 overflow-auto", store.isLoggedIn ? 'right-32' : 'right-8')} onPress={onOpen}>
                Cart <ShoppingCart size={16} className="font-semibold" />
                {cart.length > 0 &&
                    <span className='absolute h-6 w-6 -top-2 -right-1 border-2 border-blue-600 rounded-full flex justify-center items-center p-1 bg-blue-600 text-white'>{cart.length}</span>}
            </Button>
            {store.isLoggedIn && <Button className="capitalize absolute top-8 right-16 p-2" isIconOnly variant='ghost' color='secondary' title='Logout' href='/user/logout' as={Link} >
                <DoorOpen size={36} className="font-semibold" />
            </Button>}
            <Drawer isOpen={isOpen} placement={"right"} onOpenChange={onOpenChange} motionProps={
                {
                    initial: { translateX: "100%" },
                    animate: { translateX: "0%" },
                    exit: { translateX: "100%" },
                }
            } backdrop='blur'>
                <DrawerContent className="text-gray-800">
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">Shopping Cart</DrawerHeader>
                            <DrawerBody>
                                <AnimatePresence>
                                    {cart.map((product) => (
                                        <motion.div
                                            key={product._id}
                                            layout
                                            initial={{ x: 100, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ y: 20, opacity: 0 }}
                                            transition={{
                                                layout: { duration: 0.3 },
                                                opacity: { duration: 0.2 }
                                            }}
                                            className="flex justify-between items-center p-2 border-b border-gray-200"
                                        >
                                            <div className="flex gap-2 items-center">
                                                <Image src={product.mainImage.url} alt={product.name} className="w-16 h-16" height={64} width={64} />
                                                <div>
                                                    <h1 className="text-lg font-semibold">{product.name}</h1>
                                                    <p className="text-sm text-gray-500">₹{product.price}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Button size="sm" className='text-lg' onPress={() => store.decQuantity(product._id)}>-</Button>
                                                        <span>{product.quantity}</span>
                                                        <Button size="sm" className='text-lg' onPress={() => store.incQuantity(product._id)}>+</Button>
                                                    </div>
                                                    <p className="text-sm font-semibold mt-1">
                                                        Total: ₹{(product.price * (product.quantity || 0)).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button color="danger" variant="light" onPress={() => {
                                                store.removeProduct(product._id)
                                            }}>
                                                Remove
                                            </Button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </DrawerBody>
                            <DrawerFooter className="flex flex-col gap-4">
                                <div className="w-full flex justify-between items-center border-t pt-4">
                                    <span className="text-lg font-bold">Cart Total:</span>
                                    <span className="text-lg">₹{store.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button color="warning" variant="light" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color="danger" variant="light" onPress={() => {
                                        store.resetCart()
                                    }}>
                                        Clear Cart
                                    </Button>
                                </div>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

        </div>
    )
}

export default UserCart