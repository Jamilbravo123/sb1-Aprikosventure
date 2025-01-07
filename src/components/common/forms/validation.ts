export const validateEmail = (email: string) => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address';
  }
};

export const validateRequired = (value: string) => {
  if (!value || value.trim() === '') {
    return 'This field is required';
  }
};

export const validateName = (name: string) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (!/^[a-zA-Z\s-]+$/.test(name)) {
    return 'Name can only contain letters, spaces, and hyphens';
  }
};