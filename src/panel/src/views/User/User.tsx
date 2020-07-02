import React from 'react';
import { useParams } from 'react-router-dom';

const User: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    // alert(userId);
    return <p>user page</p>;
};

export default User;
