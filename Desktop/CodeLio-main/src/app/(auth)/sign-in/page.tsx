'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/sign-up-UI/form'
import { Button } from "@/components/sign-up-UI/button"
import { Input } from "@/components/sign-up-UI/input"
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-t';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      // Here you would typically make an API call to create the user
      // For this example, we'll simulate a successful sign-up
      await new Promise(resolve => setTimeout(resolve, 1000));

      // After successful sign-up, sign in the user
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast({
          title: 'Sign Up Failed',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result?.url) {
        router.replace('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
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
              username="fullName"
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
            >
              Create Account
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

