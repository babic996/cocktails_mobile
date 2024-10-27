import * as yup from "yup";

export const loginValidationSchema = () => {
  return yup.object().shape({
    email: yup
      .string()
      .email("Email must be a valid email")
      .required("This field is required"),
  });
};
