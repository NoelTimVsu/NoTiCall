import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useSignUpFormValidation } from "@/hooks/useFormValidation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from '@/store/useAuthStore.ts';
import { SingUpData } from '@/validations/formValidation.ts';
import { Loader } from 'lucide-react';

function Signup() {
  const form = useSignUpFormValidation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;
  const { signUp, isSigningUp } = useAuthStore();

  const navigate = useNavigate();

  const onSubmit = (values: SingUpData) => {
    signUp(values);
    reset();
  };

  return (
    <section className="w-full min-h-[calc(100vh-70px)] flex justify-center items-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl text-blue-600 font-bold">
            NoTiCall
          </CardTitle>
          <CardDescription className="text-center">
            Sign up to get started
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Signup Form */}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{errors.full_name?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage>{errors.username?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSigningUp}>
                {isSigningUp ? <Loader className="size-6 animate-spin" /> : 'Create Account'}
              </Button>
            </form>
          </Form>

          {/* Login Link */}
          <div className="text-sm text-center">
            <span>Already have an account? </span>
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer"
            >
              Log in
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default Signup;
