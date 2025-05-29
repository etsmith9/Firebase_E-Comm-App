import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import type { UserProfile } from '../services/userService';

export default function Profile() {
  const { currentUser, logout, deleteAccount } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', currentUser?.uid],
    queryFn: () => userService.getUserProfile(currentUser!.uid),
    enabled: !!currentUser
  });

  const updateProfileMutation = useMutation({
    mutationFn: (profile: Partial<UserProfile>) =>
      userService.updateUserProfile(currentUser!.uid, profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', currentUser?.uid] });
      setIsEditing(false);
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      // First delete Firestore data
      await userService.deleteUserProfile(currentUser!.uid);
      // Then delete the authentication account
      await deleteAccount();
    },
    onSuccess: () => {
      logout();
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedProfile = {
      name: formData.get('name') as string,
      address: formData.get('address') as string
    };
    updateProfileMutation.mutate(updatedProfile);
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={currentUser?.email || ''}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={profile?.name}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              defaultValue={profile?.address}
            />
          </div>
          <div className="form-actions">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <p><strong>Email:</strong> {currentUser?.email}</p>
          <p><strong>Name:</strong> {profile?.name || 'Not set'}</p>
          <p><strong>Address:</strong> {profile?.address || 'Not set'}</p>
          <div className="profile-actions">
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  deleteAccountMutation.mutate();
                }
              }}
              className="delete"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 