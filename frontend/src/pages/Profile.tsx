import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useUpdateProfileFormValidation } from "@/hooks/useFormValidation";
import { useAuthStore } from '@/store/useAuthStore.ts';
import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore.ts';
import { UpdateProfileData } from '@/validations/formValidation.ts';

const Profile = () => {
  const form = useUpdateProfileFormValidation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;
  const { authUser } = useAuthStore();
  const { updateProfile } = useUserStore();

  const onSubmit = (values: UpdateProfileData) => {
    updateProfile({
      ...values,
      id: authUser?.id || ''
    });
    reset();
  };

  useEffect(() => {
    if(authUser) {
      reset({
        ...authUser,
      });
    }
  }, [authUser, reset]);

  return (
    <section className="flex justify-center py-12">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full border-2 bg-white flex items-center justify-center text-lg font-bold">
              { authUser ? authUser.username.toUpperCase().slice(0, 2) : "ME" }
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={authUser?.full_name}
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
                      <Input placeholder={authUser?.username} {...field} />
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
                        placeholder={authUser?.email}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full cursor-pointer">
                Update Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default Profile;
