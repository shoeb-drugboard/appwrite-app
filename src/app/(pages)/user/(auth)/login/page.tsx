"use client";
import React from "react";
import LoginForm from "@/components/LoginForm";
import { Card, CardBody, CardHeader } from '@heroui/card';

const Page = () => {
    return (
        <div className='h-screen w-screen dark bg-background text-foreground grid place-content-center'>
            <Card className="min-w-[280px] shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="px-4 mb-4">
                    <h1 className="text-2xl font-semibold">Login</h1>
                </CardHeader>
                <CardBody className="w-full">
                    <LoginForm />
                </CardBody>
            </Card>
        </div>
    )
}

export default Page;

