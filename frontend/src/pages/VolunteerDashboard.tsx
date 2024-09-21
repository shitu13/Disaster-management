import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Volunteer {
  name: string;
  email: string;
  phone: string;
  isApproved: boolean;
}

const VolunteerDashboard: React.FC = () => {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/volunteers/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setVolunteer(response.data);
      } catch (error) {
        console.error('Failed to load profile');
      }
    };
    fetchVolunteer();
  }, []);

  if (!volunteer) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h1>Volunteer Profile</h1>
      <p>Name: {volunteer.name}</p>
      <p>Email: {volunteer.email}</p>
      <p>Phone: {volunteer.phone}</p>
      <p>Status: {volunteer.isApproved ? 'Approved' : 'Pending Approval'}</p>
    </div>
  );
};

export default VolunteerDashboard;
