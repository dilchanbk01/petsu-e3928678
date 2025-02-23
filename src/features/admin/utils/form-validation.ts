
export interface FormData {
  email: string;
  password: string;
}

export const validateAdminForm = (formData: FormData): Partial<FormData> => {
  const errors: Partial<FormData> = {};
  
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    errors.email = "Invalid email address";
  }
  
  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};
