import * as yup from 'yup';
import { PreAuthor } from '@common/entitites';

export const initialValues: PreAuthor = { email: '', name: '', bio: '' };

export type Values = PreAuthor;

export const validationSchema = yup.object({
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
