const passwordMatchVerification = () => {
  const password = document.querySelector("input[name=password");
  const confirmedPassword = document.querySelector(
    "input[name=confirmedPassword"
  );

  if (confirmedPassword.value === password.value) {
    confirmedPassword.setCustomValidity("");
    return true;
  }

  return false;
};

export { passwordMatchVerification };
