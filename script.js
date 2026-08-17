const userEmail = document.getElementById("userEmail");
const emailError = document.getElementById("emailError");

const userPhone = document.getElementById("userPhone");
const phoneError = document.getElementById("phoneError");

const userPassword = document.getElementById("userPassword");
const passwordError = document.getElementById("passwordError");

const form = document.getElementById("signupForm");

// email validation function
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

userEmail.addEventListener("blur", () => {
  if (userEmail.value.trim() === "") {
    emailError.textContent = "Email is required!";
  } else {
    emailError.textContent = "";
    // emailError.style.color = "red";
  }
});

userEmail.addEventListener("keydown", () => {
  if (!isValidEmail(userEmail.value)) {
    emailError.textContent = "Invalid email format!";
  } else {
    emailError.textContent = "";
  }
});

userPassword.addEventListener("input", () => {
  if (userPassword.value.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters";
  } else if (!/\d/.test(userPassword.value)) {
    passwordError.textContent = "Password must contain a number";
  } else {
    passwordError.textContent = "";
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop reload

  if (
    userEmail.value === "" ||
    userPhone.value === "" ||
    userPassword.value === ""
  ) {
    alert("Please fill all required fields");
    return;
  }

  // form is valid
  alert("Form submitted!");
});
