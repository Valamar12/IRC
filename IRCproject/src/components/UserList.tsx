import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UsersCommand } from './Commands';

const UserList = () => {
    const [userList, setUserList] = useState([]);
    const { channelId } = useParams();
    const [showUserList, setShowUserList] = useState(false); // Initially hide the user list

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersString = await UsersCommand(channelId);
                const usersArray = usersString.split(',');
                setUserList(usersArray);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [channelId]);

    const handleButtonClick = () => {
        setShowUserList(!showUserList);
    };

    return (
        <div className={`user-list-container ${showUserList ? 'active' : ''}`}>
            <h2>Users in Channel</h2>
            <button onClick={handleButtonClick}>Toggle User List</button>
            <ul>
                {userList.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;






