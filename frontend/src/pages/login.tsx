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
    <>
      <section className="w-full px-4">
        {/* Shared Container */}
        <div className="max-w-md mx-auto mt-10 space-y-6">
          {/* Logo and CTA Buttons */}
          <div className="text-center space-y-4">
            <div className="text-blue-600 text-3xl font-bold">
              <button className="cursor-pointer">NoTiCall</button>
            </div>
            <Button variant="blueButton" className="w-full">
              Get Started
            </Button>
            <Button variant="outline" className="w-full">
              Create Free Account
            </Button>
          </div>

          {/* Sign up Form */}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
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

              {/* Password */}
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
              <Button type="submit" className="w-full cursor-pointer">
                Log in
              </Button>
            </form>
          </Form>
          {/* other */}
          <div className="text-lg flex justify-center items-center space-x-2">
            <span>Do not have an account?</span>
            <Button
              variant="link"
              className="text-blue cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
export default Login;
