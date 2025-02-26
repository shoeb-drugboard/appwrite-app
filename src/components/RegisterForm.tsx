import React, { useState } from 'react'
import { Form } from "@heroui/form";
import { Tooltip } from '@heroui/tooltip';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { account, ID } from "@/utils/appwrite/config";
import { AppwriteException } from 'appwrite';

const RegisterForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await account.create(
                ID.unique(),
                formData.email,
                formData.password,
                formData.username
            );
            // await account.updatePrefs({
            //     role: formData.role
            // });
            // await account.createVerification(formData.email);
            // router.push('/user/verify-email');
            // Optional: Automatically log in after registration
            await account.createEmailPasswordSession(formData.email, formData.password);
            const user = await account.get();
            localStorage.setItem('user', JSON.stringify(user
            ));
            router.push('/');
            // Store role preference or other metadata if needed
        } catch (error) {
            if (error instanceof AppwriteException) {
                switch (error.type) {
                    case 'user_already_exists':
                        setError('An account with this email already exists');
                        break;
                    case 'general_argument_invalid':
                        setError('Please check your input values');
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
            <Form className="w-full max-w-lg gap-4 space-y-4" onSubmit={handleRegister}>
                <Input
                    isRequired
                    label="Username"
                    labelPlacement="inside"
                    name="username"
                    placeholder="Enter your username"
                    classNames={{
                        errorMessage: "text-[12px] my-1 ml-1"
                    }}
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                />
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
                        <Tooltip color="secondary" content="Enter a secure password" className="text-xs" placement="right-end">
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
                <Select
                    isRequired
                    label="Role"
                    placeholder="Select your role"
                    name="role"
                    className="w-full"
                    classNames={{
                        base: "bg-background text-foreground",
                    }}
                    value={formData.role}
                    onChange={handleChange}
                    disabled={isLoading}
                >
                    <SelectItem key="admin">Admin</SelectItem>
                    <SelectItem key="mvp">User</SelectItem>
                </Select>
                <Button
                    type="submit"
                    variant="ghost"
                    className="w-full mt-4"
                    color="secondary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </Button>
                <p className="text-center text-small">
                    Already have an account? <Link href="/user/login" className="text-secondary">Login</Link>
                </p>
            </Form>
        </>
    )
}

export default RegisterForm
