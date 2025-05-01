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
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Signup() {
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
            Sign up to get started
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Signup Form */}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="fullName"
                render={() => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full Name"
                        {...register("fullName")}
                      />
                    </FormControl>
                    <FormMessage>{errors.fullName?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                name="username"
                render={() => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...register("username")} />
                    </FormControl>
                    <FormMessage>{errors.username?.message}</FormMessage>
                  </FormItem>
                )}
              />

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
                Create Account
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
