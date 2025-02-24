"use client";
import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Input } from '@heroui/input';
import { Form } from '@heroui/form';
import { Button } from '@heroui/button';
import db from '../utils/appwrite/databases';
import { useRouter } from 'next/navigation';

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    image: string;
    [key: string]: string | number;
}

const ProductForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: 0,
        image: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await db.products.create(formData);
            setFormData({
                name: '',
                description: '',
                price: 0,
                image: '',
            });
            router.push('/product/show')
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <h2 className="text-2xl font-bold">Create New Product</h2>
            </CardHeader>
            <CardBody>
                <Form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            label="Product Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Input
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Input
                            type="number"
                            label="Price"
                            name="price"
                            value={formData.price.toString()}
                            onChange={handleChange}
                            required
                            min={0}
                            step={0.01}
                        />
                    </div>

                    <div>
                        <Input
                            type="url"
                            label="Image URL"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="Enter image URL"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Creating...' : 'Create Product'}
                    </Button>
                </Form>
            </CardBody>
        </Card>
    );
};

export default ProductForm;