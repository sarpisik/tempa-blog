import { useSelector } from 'react-redux';
import { selectAuth } from '@app/authSlice';

export default function useSelectAuth() {
    return useSelector(selectAuth);
}
