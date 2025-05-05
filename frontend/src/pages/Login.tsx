import { useNavigate } from "react-router-dom";
import { Loader } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSignInFormValidation } from "@/hooks/useFormValidation";
import { useAuthStore } from '@/store/useAuthStore.ts';
import { SingInData } from '@/validations/formValidation.ts';

function Login() {
  const form = useSignInFormValidation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;
  const { isLoggingIn, signIn } = useAuthStore();

  const navigate = useNavigate();

  const onSubmit = (values: SingInData) => {
    signIn(values);
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
            Welcome back! Log in to continue.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit, (errors) => console.error("Validation errors", errors))} className="space-y-4">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
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
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoggingIn} >
                {isLoggingIn ? <Loader className="size-6 animate-spin" /> : 'Log in'}
              </Button>
            </form>
          </Form>

          {/* Signup Redirect */}
          <div className="text-sm text-center">
            <span>Don’t have an account? </span>
            <Button
              variant="link"
              onClick={() => navigate("/signup")}
              className="text-blue-600 cursor-pointer"
            >
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default Login;
