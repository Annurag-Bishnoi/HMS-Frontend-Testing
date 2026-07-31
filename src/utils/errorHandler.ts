export const parseBackendError = (err: any, fallback = "An unexpected error occurred."): string => {
  let msg = fallback;

  // Extract from typical axios response structures
  if (typeof err.response?.data === "string") {
    msg = err.response.data;
  } else if (err.response?.data?.message) {
    msg = err.response.data.message;
  } else if (err.message) {
    msg = err.message;
  }

  // Handle raw SQL/Database duplicate entry exceptions
  if (msg.includes("Duplicate entry") || msg.includes("ConstraintViolationException") || msg.includes("could not execute statement")) {
    if (msg.includes("uk_users_phone") || msg.includes("phone")) {
      return "This phone number is already registered to another user.";
    }
    if (msg.includes("uk_users_email") || msg.includes("email")) {
      return "This email address is already in use.";
    }
    if (msg.includes("uk_users_username") || msg.includes("username")) {
      return "This username is already taken.";
    }
    if (msg.includes("uk_departments_name")) {
      return "A department with this name already exists.";
    }
    return "This record already exists in the system.";
  }

  return msg;
};
