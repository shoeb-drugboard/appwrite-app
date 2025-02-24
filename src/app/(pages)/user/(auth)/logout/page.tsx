"use client";
import React from "react";
import Logout from "@/components/Logout";
import { Card, CardBody, CardHeader } from '@heroui/card';

const Page = () => {
    return (
        <div className='h-screen w-screen dark bg-background text-foreground grid place-content-center'>
            <Card className="">
                <CardHeader className="px-4 mb-4">
                    <h1 className="text-2xl font-semibold">Logout</h1>
                </CardHeader>
                <CardBody className="flex flex-col items-center">
                    <p className="mb-4">Are you sure you want to logout?</p>
                    <Logout />
                </CardBody>
            </Card>
        </div>
    )
}

export default Page
