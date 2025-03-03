"use client";
import React from "react";
import { Button } from "@heroui/button";
import { useAuth } from "@/context/AuthContext";
import { Card, CardBody, CardHeader } from '@heroui/card';

const Page = () => {
    const { logout, isLoading } = useAuth();
    return (
        <div className='h-screen w-screen dark bg-background text-foreground grid place-content-center'>
            <Card className="">
                <CardHeader className="px-4 mb-4">
                    <h1 className="text-2xl font-semibold">Logout</h1>
                </CardHeader>
                <CardBody className="flex flex-col items-center">
                    <p className="mb-4">Are you sure you want to logout?</p>

                    {isLoading ? (
                        <p>Logging out...</p>
                    ) : (
                        <Button onPress={() => logout()} className="btn" variant="ghost" color="secondary">Confirm Logout</Button>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}

export default Page
