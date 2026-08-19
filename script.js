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

form.addEventListener("submit", onFormSubmit);

// WARNING: All these functions are named the same, so only the last one will be used. The previous ones will be overwritten. Choose the function you want to use and comment out the others.
// just prints an instance of the object, not the actual key:value pairs
function onFormSubmit(event) {
  event.preventDefault(); // stop immediate reload

  // so you can make your own logic to handle the form data, like sending it to a server or displaying it on the page
  const data = new FormData(event.target);
  const dataObject = Object.fromEntries(data.entries());

  console.log(dataObject);
}

// traverse FormData with forEach()
function onFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  data.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
}

// // Accessing Form Data by Name
function onFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const name = data.get("name");
  const email = data.get("email");
  console.log(`Name: ${name}, Email: ${email}`);

  const payload = Object.fromEntries(data.entries());

  fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
