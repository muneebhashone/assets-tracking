import React from "react";

const LoginButton = ({
  title,
  classname,
  onclick,
}: {
  title: string;
  classname: string;
  onclick?: () => void;
}) => {
  return (
    <button onClick={onclick} className={`px-7 py-3  ${classname}`}>
      {title}
    </button>
  );
};

export default LoginButton;
