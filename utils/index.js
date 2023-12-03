export const emailValidator = email => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Email cannot be empty.';
  if (!re.test(email)) return 'Ooops! We need a valid email address.';
  return '';
};

export const email_OR_userName = email => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Email cannot be empty.';
  if (!re.test(email)) return 'username';
  return '';
};

export const passwordValidator = password => {
  if (!password || password.length <= 0) return 'Password cannot be empty.';

  return '';
};

export const nameValidator = text => {
  if (!text || text.length <= 0) return 'User name cannot be empty.';

  return '';
};

export const valueValidator = (text, type) => {
  if (!text || text.length <= 0) return `${type} cannot be empty.`;
  return '';
};
