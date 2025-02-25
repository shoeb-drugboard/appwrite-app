import React, { useState } from 'react'
import { Tooltip } from '@heroui/tooltip';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { InfoIcon } from "lucide-react";
import { Form } from "@heroui/form";
import Link from "next/link";
import { account } from "@/utils/appwrite/config";
import { useRouter } from 'next/navigation';
import { AppwriteException } from 'appwrite';

const LoginForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error when user types
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await account.createEmailPasswordSession(formData.email, formData.password);
            const user = await account.get();
            localStorage.setItem('user', JSON.stringify(user));
            router.push('/');
        } catch (error) {
            if (error instanceof AppwriteException) {
                switch (error.type) {
                    case 'general_argument_invalid':
                        setError('Invalid email or password');
                        break;
                    case 'user_not_found':
                        setError('User not found');
                        break;
                    default:
                        setError(error.message);
                }
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {error && (
                <span className="text-sm text-danger mb-4 block">
                    {error}
                </span>
            )}
            <Form className="w-full max-w-lg gap-4 space-y-4" onSubmit={handleLogin}>
                <Input
                    isRequired
                    label="Email"
                    labelPlacement="inside"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    classNames={{
                        errorMessage: "text-[12px] my-1 ml-1"
                    }}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                />
                <div className="relative w-full">
                    <div className="absolute top-0 right-0 mt-2 mr-2 z-50">
                        <Tooltip color="secondary" content="Enter your password" className="text-xs" placement="right-end">
                            <InfoIcon />
                        </Tooltip>
                    </div>
                    <Input
                        isRequired
                        label="Password"
                        labelPlacement="inside"
                        name="password"
                        placeholder="Enter your password"
                        type="password"
                        classNames={{
                            errorMessage: "text-[12px] my-1 ml-1"
                        }}
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>
                <Button
                    type="submit"
                    variant="ghost"
                    className="w-full mt-4"
                    color="secondary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                <p className="text-center text-small">
                    Don&apos;t have an account? <Link href="/user/register" className="text-secondary">Register</Link>
                </p>
            </Form>
        </>
    )
}

export default LoginForm