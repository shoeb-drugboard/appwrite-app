"use client";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
} from '@heroui/drawer';
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from '@heroui/dropdown';
import { User } from '@heroui/user';
import { Input } from '@heroui/input';
import useStore from '@/stores/Store';
import React, { useRef } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@heroui/button';
import { UserSlice } from '@/stores/userSlice';
import { useShallow } from 'zustand/react/shallow';
import { useDisclosure } from '@heroui/use-disclosure';
import Link from 'next/link';

const UserProfile = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { name, email, address, setAddress, setName, isLoggedIn } = useStore(
        useShallow((state: UserSlice) => ({
            name: state.name,
            email: state.email,
            address: state.address,
            isLoggedIn: state.isLoggedIn,
            setAddress: state.setAddress,
            setName: state.setName,
        }))
    );

    const nameRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (onClose: () => void) => {
        if (nameRef.current && addressRef.current) {
            setName(nameRef.current.value);
            setAddress(addressRef.current.value);
            onClose();
        }
    };

    React.useEffect(() => {
        if (isOpen && nameRef.current && addressRef.current) {
            nameRef.current.value = name;
            addressRef.current.value = address;
        }
    }, [isOpen, name, address]);

    return (
        <div className="w-screen h-screen absolute">
            {isLoggedIn ? (
                <>
                    <Dropdown placement="bottom-end" className='bg-background text-foreground'>
                        <DropdownTrigger className='absolute top-8 left-10'>
                            <User
                                as="button"
                                avatarProps={{
                                    isBordered: true,
                                    src: './profile.jpg',
                                }}
                                className="transition-transform"
                                description={email}
                                name={name}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat" className=''>
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">{email}</p>
                            </DropdownItem>

                            <DropdownItem
                                key="name_and_address"
                                className="cursor-default"
                            >
                                <p className="font-semibold">Name: {name}</p>
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">Address: {address}</p>
                                    <button
                                        className='h-6 w-6 absolute right-2 top-0 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-800 flex justify-center items-center'
                                        onClick={onOpen}
                                    >
                                        <Pencil size={18} />
                                    </button>
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Drawer
                        isOpen={isOpen}
                        placement="left"
                        size='xs'
                        onOpenChange={onOpenChange}
                        motionProps={{
                            initial: { translateX: "-100%" },
                            animate: { translateX: "0%" },
                            exit: { translateX: "-100%" },
                        }}
                        backdrop="blur"
                    >
                        <DrawerContent className="text-gray-800">
                            {(onClose) => (
                                <>
                                    <DrawerHeader className="flex flex-col gap-1">
                                        Edit Profile
                                    </DrawerHeader>
                                    <DrawerBody>
                                        <div className="flex flex-col gap-4">
                                            <Input
                                                ref={nameRef}
                                                label="Name"
                                                placeholder="Enter your name"
                                                defaultValue={name}
                                                variant="bordered"
                                            />
                                            <Input
                                                ref={addressRef}
                                                label="Address"
                                                placeholder="Enter your address"
                                                defaultValue={address}
                                                variant="bordered"
                                            />
                                        </div>
                                    </DrawerBody>
                                    <DrawerFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Cancel
                                        </Button>
                                        <Button
                                            color="primary"
                                            onPress={() => handleSubmit(onClose)}
                                        >
                                            Save Changes
                                        </Button>
                                    </DrawerFooter>
                                </>
                            )}
                        </DrawerContent>
                    </Drawer>
                </>

            )
                : (
                    <Link href="/user/login" className="text-secondary absolute top-8 left-16 z-10">
                        <Button variant="ghost" color="secondary">
                            Login
                        </Button>
                    </Link>
                )}
        </div>
    );
};

export default UserProfile;
