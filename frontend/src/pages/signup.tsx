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
            {/* Full Name */}
            <FormField
              name="fullName"
              render={() => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...register("fullName")} />
                  </FormControl>
                  <FormMessage>{errors.fullName?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Username */}
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
              Create Account
            </Button>
          </form>
        </Form>

        {/* Other Links */}
        <div className="text-lg flex justify-center items-center space-x-2">
          <span>Already have an account?</span>
          <Button
            variant="link"
            className="text-blue cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Signup;
