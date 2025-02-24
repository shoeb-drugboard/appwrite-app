"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { account } from "@/utils/appwrite/config";
import { AppwriteException } from 'appwrite';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';

const VerifyEmail = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const userId = searchParams.get('userId');
        const secret = searchParams.get('secret');

        if (!userId || !secret) {
            setStatus('error');
            setError('Invalid verification link');
            return;
        }

        const verifyEmail = async () => {
            try {
                await account.updateVerification(userId, secret);
                setStatus('success');
            } catch (error) {
                setStatus('error');
                if (error instanceof AppwriteException) {
                    setError(error.message);
                } else {
                    setError('An unexpected error occurred during verification');
                }
            }
        };

        verifyEmail();
    }, [searchParams]);

    const handleRedirect = () => {
        router.push('/user/login');
    };

    return (
        <Card className="w-full max-w-md">
            <CardBody className="flex flex-col items-center gap-4 p-6">
                {status === 'verifying' && (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Verifying your email...</h2>
                        <p className="text-gray-500">Please wait while we verify your email address.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2 text-success">Email Verified!</h2>
                        <p className="text-gray-500 mb-4">Your email has been successfully verified.</p>
                        <Button
                            color="secondary"
                            variant="ghost"
                            onPress={handleRedirect}
                        >
                            Proceed to Login
                        </Button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2 text-danger">Verification Failed</h2>
                        <p className="text-danger mb-4">{error}</p>
                        <Button
                            color="secondary"
                            variant="ghost"
                            onPress={handleRedirect}
                        >
                            Return to Login
                        </Button>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

export default VerifyEmail;
