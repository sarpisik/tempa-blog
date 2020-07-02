import * as yup from 'yup';

export default yup.object({
    email: yup.string().email('Invalid email.').required('required'),
    name: yup
        .string()
        .max(20, 'Must be 20 characters or less.')
        .required('Required'),
    bio: yup
        .string()
        .max(200, 'Must be 200 characters or less.')
        .required('Required'),
});
