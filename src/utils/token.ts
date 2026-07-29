export const saveUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

export const logout = () => {
  localStorage.removeItem("user");
};
export const getToken = () => {
  const data = localStorage.getItem('user');
  if (data) {
    try {
      const user = JSON.parse(data);
      return user.token || null;
    } catch (e) {
      return null;
    }
  }
  return null;
};
