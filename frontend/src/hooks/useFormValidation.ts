import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInFormValidation, signUpFormValidation, updateProfileFormValidation } from "@/validations/formValidation";

export const useSignUpFormValidation = () => {
  return useForm({
    resolver: zodResolver(signUpFormValidation),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
    },
  });
};

export const useSignInFormValidation = () => {
  return useForm({
    resolver: zodResolver(signInFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });
};

export const useUpdateProfileFormValidation = () => {
  return useForm({
    resolver: zodResolver(updateProfileFormValidation),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      image: "",
    },
  });
};
