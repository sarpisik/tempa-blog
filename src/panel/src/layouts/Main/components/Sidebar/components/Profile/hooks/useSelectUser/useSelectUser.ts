import { useSelector } from 'react-redux';
import { selectUser } from '@app/slice';

export default function useSelectUser() {
    return useSelector(selectUser);
}
