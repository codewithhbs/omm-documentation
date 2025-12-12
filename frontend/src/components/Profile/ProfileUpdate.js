import api from '@/utils/api';
import React from 'react'

const ProfileUpdate = () => {
    const [user, setUser] = useState({

    });
    const fetchUser = async () => {
        try {
            const res = await api.get('/api/au th/me');
        } catch (error) {
            console.log("Internal server error",error)
        }
    }
  return (
    <div>
      
    </div>
  )
}

export default ProfileUpdate
