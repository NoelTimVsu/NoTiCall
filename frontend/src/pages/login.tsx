import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function Login() {
  const form = useFormValidation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const navigate = useNavigate();

  const onSubmit = (values: unknown) => {
    console.log(values);
  };

  return (
    <section className="w-full min-h-screen flex justify-center items-center bg-muted px-4">
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
          {/* CTA Buttons */}
          <div className="space-y-2">
            <Button
              onClick={() => navigate("/signup")}
              variant="blueButton"
              className="w-full"
            >
              Get Started
            </Button>
            <Button variant="outline" className="w-full">
              Create Free Account
            </Button>
          </div>

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="email"
                render={() => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                      />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                render={() => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                      />
                    </FormControl>
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Log in
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
