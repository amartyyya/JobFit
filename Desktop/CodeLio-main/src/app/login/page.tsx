'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/sign-up-UI/form";
import { Button } from "@/components/sign-up-UI/button";
import { Input } from "@/components/sign-up-UI/input";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useToast } from 'src/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginUser = async (data: LoginFormData) => {
    try {
      const response = await axios.post('/api/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const mutation = useMutation(loginUser, {
    onSuccess: (data) => {
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      router.push('/generalInfo');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'An error occurred during login',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-[#F5A623] p-3">
              <div className="h-6 w-6 rounded-full border-2 border-white relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 rotate-45 border-r-2 border-t-2 border-white" />
                </div>
              </div>
            </div>
            <span className="text-2xl font-medium text-[#F5A623]">codeLio</span>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Log in to your account</h1>
          <p className="text-gray-500 mt-2">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-[#F5A623] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <Input {...field} placeholder="Enter your email" type="email" className="focus-visible:ring-[#F5A623]" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input {...field} type="password" className="focus-visible:ring-[#F5A623]" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              className="w-full bg-[#F5A623] hover:bg-[#F5A623]/90" 
              size="lg" 
              type="submit"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

