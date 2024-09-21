import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Volunteer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isApproved: boolean;
}

const AdminDashboard: React.FC = () => {
  const [pendingVolunteers, setPendingVolunteers] = useState<Volunteer[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch pending volunteers
  useEffect(() => {
    const fetchPendingVolunteers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/volunteers/pending', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPendingVolunteers(response.data);
      } catch (error) {
        setMessage('Failed to load pending volunteers');
      }
    };
    fetchPendingVolunteers();
  }, []);

  // Approve volunteer
  const handleApprove = async (volunteerId: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/volunteers/approve/${volunteerId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPendingVolunteers(pendingVolunteers.filter(v => v._id !== volunteerId)); // Remove the approved volunteer from the list
    } catch (error) {
      setMessage('Failed to approve volunteer');
    }
  };

  // Delete volunteer
  const handleDelete = async (volunteerId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/volunteers/${volunteerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPendingVolunteers(pendingVolunteers.filter(v => v._id !== volunteerId)); // Remove the deleted volunteer from the list
    } catch (error) {
      setMessage('Failed to delete volunteer');
    }
  };

  return (
    <div>
      <h1>Pending Volunteers</h1>
      {message && <p>{message}</p>}
      <ul>
        {pendingVolunteers.map(volunteer => (
          <li key={volunteer._id}>
            <h2>{volunteer.name}</h2>
            <p>Email: {volunteer.email}</p>
            <p>Phone: {volunteer.phone}</p>
            <button onClick={() => handleApprove(volunteer._id)}>Approve</button>
            <button onClick={() => handleDelete(volunteer._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
