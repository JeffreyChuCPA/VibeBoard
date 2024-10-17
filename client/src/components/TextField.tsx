import React from "react";

type TextFieldProps = {
  error?: { message?: string };
  type?: "text" | "textarea" | "email" | "password";
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
  id?: string;
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;

const TextField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>((props, ref) => {
  const {
    error,
    type = "text",
    size = "md",
    label,
    className,
    ...inputProps
  } = props;

  const classes = {
    base: "block border placeholder-gray-400 z-10 w-full rounded active:z-10 focus:z-10 -mr-px border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-black",
    size: {
      sm: "py-2 leading-5",
      md: "px-4 py-3 leading-6",
      lg: "",
    },
  };

  return (
    <div className={"w-full" + (className ? ` ${className}` : "")}>
      {label && (
        <label className="block mb-1 font-medium" htmlFor={props.id}>
          {label}
        </label>
      )}

      {type === "textarea" && (
        <textarea
          className={`${classes.base} ${classes.size[size]}`}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          {...inputProps}
        />
      )}

      {type !== "textarea" && (
        <input
          className={`${classes.base} ${classes.size[size]}`}
          ref={ref as React.Ref<HTMLInputElement>}
          type={type}
          {...inputProps}
        />
      )}

      {error && (
        <p className="text-sm text-left text-red-600 mt-1">{error.message}</p>
      )}
    </div>
  );
})

TextField.displayName = "TextField"; // Set the display name

export default TextField;
