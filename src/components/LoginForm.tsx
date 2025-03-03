import Link from "next/link";
import { Form } from "@heroui/form";
import { Input } from '@heroui/input';
import { InfoIcon } from "lucide-react";
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { withPublicAuth } from './withAuth';
import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';

const LoginForm = () => {
    const { login, loginIsLoading, error: authError, setError } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (authError) setError(null); // Clear error when user types
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ email: formData.email, password: formData.password });
    };

    return (
        <>
            {authError && (
                <span className="text-sm text-danger mb-4 block">
                    {authError}
                </span>
            )}
            <Form className="gap-4 space-y-4" onSubmit={handleSubmit}>
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
                    disabled={loginIsLoading}
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
                        disabled={loginIsLoading}
                    />
                </div>
                <Button
                    type="submit"
                    variant="ghost"
                    className="w-full mt-4"
                    color="secondary"
                    disabled={loginIsLoading}
                >
                    {loginIsLoading ? 'Logging in...' : 'Login'}
                </Button>
                <p className="text-center text-small">
                    Don&apos;t have an account? <Link href="/user/register" className="text-secondary">Register</Link>
                </p>
            </Form>
        </>
    )
}

// Export with auth protection
export default withPublicAuth(LoginForm);