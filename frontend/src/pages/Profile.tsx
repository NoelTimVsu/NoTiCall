import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
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
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore.ts';
import { UpdateProfileData } from '@/validations/formValidation.ts';
import CustomAvatar from '@/components/CustomAvatar.tsx';
import toast from 'react-hot-toast';
import { Controller } from 'react-hook-form';

const Profile = () => {
  const [selectedImage, setSelectedImage] = useState<string>("");

  const form = useUpdateProfileFormValidation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;
  const { authUser } = useAuthStore();
  const { updateProfile, isUpdatingProfile } = useUserStore();

  const handleImageChange = useCallback((
    e: ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void,
  ) => {
    const file = e.target.files?.[0];
    if(!file || !file.type.startsWith('image/')) {
      toast.error('Please select an image');
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const base64Image = reader.result;
      if (typeof base64Image === 'string') {
        setSelectedImage(base64Image as string);
        onChange(base64Image);
      }
    }

    reader.readAsDataURL(file);
  }, []);

  const onSubmit = (values: UpdateProfileData) => {
    updateProfile({
      ...values,
      id: authUser?.id,
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
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                control={control}
                name="profile_pic"
                render={({ field }) => (
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <FormItem>
                        <FormLabel className={`absolute size-8 bottom-[-7px] right-[-7px] 
                                    bg-gray-50 border-2 flex items-center justify-center 
                                    hover:scale-105 p2 rounded-full cursor-pointer 
                                    transition-all duration-200 
                                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`} >
                          <Camera className="size-5 text-black" />
                        </FormLabel>
                        <FormControl>
                          <Input
                            name={field.name}
                            ref={field.ref}
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={(e) => handleImageChange(e, field.onChange)}
                            disabled={isUpdatingProfile}
                          />
                        </FormControl>

                        <CustomAvatar
                          size={76}
                          profile_pic={selectedImage || authUser?.profile_pic}
                          fallback={authUser?.username.toUpperCase().slice(0, 2) || 'ME'}
                        />
                      </FormItem>
                    </div>
                  </div>
                )}
              />

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
