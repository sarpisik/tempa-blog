import { useSelector } from 'react-redux';
import { selectUser } from '@app/userSlice';

export default function useSelectUser() {
    return useSelector(selectUser);
}
