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
} from "@/components/sign-up-UI/form"; // Updated path
import { Button } from "@/components/sign-up-UI/button"; // Updated path
import { Input } from "@/components/sign-up-UI/input"; // Updated path
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For redirection
import { signUpSchema } from '@/schemas/signUpSchema'; // Updated path
import { useMutation } from 'react-query';
import axios from 'axios';
import { useToast } from 'src/hooks/use-toast';

export default function SignUpForm() {
  const router = useRouter(); // <-- Initialize router to handle redirection
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const registerUser = async (data: { username: string, email: string, password: string }) => {
    try {
      console.log("Request received: ", data);

      const response = await axios.post('/api/signup', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Response received: ", response);
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error; // Rethrow error to trigger onError in mutation
    }
  };

  const mutation = useMutation(registerUser, {
    onSuccess: (data) => {
      toast({
        title: 'Account created successfully',
        description: 'You can now sign in with your new account.',
      });
      router.push('/login'); // <-- Redirect to the portfolio form page
    },
    onError: (error) => {
      const errorMessage = 'Something went wrong!';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    console.log(data);
    mutation.mutate(data); // Trigger the mutation on form submit
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
          <h1 className="text-3xl font-bold tracking-tight">Sign up to create account</h1>
          <p className="text-gray-500 mt-2">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-[#F5A623] hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <Input {...field} placeholder="Enter your full name" className="focus-visible:ring-[#F5A623]" />
                  <FormMessage />
                </FormItem>
              )}
            />
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
              disabled={mutation.isLoading} // Disable button during loading
            >
              {mutation.isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
