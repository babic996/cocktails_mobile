import * as yup from "yup";

export const verifyCodeValidationSchema = () => {
  return yup.object().shape({
    email: yup
      .string()
      .email("Email must be a valid email")
      .required("This field is required"),
    verificationCode: yup
      .string()
      .length(6, "The verification code must have 6 characters")
      .required("This field is required"),
  });
};
