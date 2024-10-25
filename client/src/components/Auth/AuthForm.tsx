import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import TextField from "../TextField.tsx";
import Button from "../Button.tsx";
import LoadingIcon from "../LoadingIcon.tsx";
import { useAuth } from "../../util/auth.jsx";
import { getErrorMessage } from "../../util/error.ts";

interface AuthFormValues {
  email: string;
  pass?: string; // Optional because it might not be needed in some forms
  confirmPass?: string; // Optional
}

function AuthForm(props) {
  const auth = useAuth();

  const [pending, setPending] = useState(false);
  const { handleSubmit, register, formState: { errors }, getValues } = useForm<AuthFormValues>();

  const submitHandlersByType = {
    signin: ({ email, pass }) => {
      return auth.signin(email, pass).then((user) => {
        // Call auth complete handler
        props.onAuth(user);
      });
    },
    signup: ({ email, pass }) => {
      return auth.signup(email, pass).then((user) => {
        // Call auth complete handler
        props.onAuth(user);
      });
    },
    forgotpass: ({ email }) => {
      return auth.sendPasswordResetEmailFunction(email).then(() => {
        setPending(false);
        // Show success alert message
        props.onFormAlert({
          type: "success",
          message: "Password reset email sent",
        });
      });
    },
    //TODO !need to pass oobCode param
    changepass: ({ pass }) => {
      return auth.confirmPasswordResetFunction(pass).then(() => {
        setPending(false);
        // Show success alert message
        props.onFormAlert({
          type: "success",
          message: "Your password has been changed",
        });
      });
    },
  };

  // Handle form submission
  const onSubmit: SubmitHandler<AuthFormValues> = ({ email, pass }) => {
    
    // Show pending indicator
    setPending(true);

    // Call submit handler for auth type
    submitHandlersByType[props.type]({
      email,
      pass,
    }).catch((error) => {

      setPending(false);
      // Show error alert message
      props.onFormAlert({
        type: "error",
        message: getErrorMessage(error.code),
      });
    });
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      {["signup", "signin", "forgotpass"].includes(props.type) && (
        <TextField
          type="email"
          id="email"
          placeholder="Email"
          error={errors.email}
          {...register("email", { required: "Please enter your email" })} 
        />
      )}

      {["signup", "signin", "changepass"].includes(props.type) && (
        <TextField
          type="password"
          id="pass"
          placeholder="Password"
          error={errors.pass}
          {...register("pass", {
            required: "Please enter a password",
          })}
        />
      )}

      {["signup", "changepass"].includes(props.type) && (
        <TextField
          type="password"
          id="confirmPass"
          placeholder="Confirm Password"
          error={errors.confirmPass}
          {...register( "confirmPass", {
            required: "Please enter your password again",
            validate: (value) => {
              if (value === getValues().pass) {
                return true;
              } else {
                return "This doesn't match your password";
              }
            },
          })}
        />
      )}

      <Button type="submit" size="lg" disabled={pending} isBlock={true}>
        {pending && <LoadingIcon className="w-6" />}

        {!pending && <>{props.buttonAction}</>}
      </Button>
    </form>
  );
}

export default AuthForm;
