
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { userStorage, authStorage, User } from '@/utils/storage';
import { validateName, validatePhone, validatePassword, validateEmail } from '@/utils/validation';
import { useToast } from '@/components/ui/use-toast';

const ProfileForm: React.FC = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    general: '',
  });
  
  useEffect(() => {
    const currentUser = authStorage.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when typing
    setErrors({
      ...errors,
      [name]: '',
      general: '',
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    let hasErrors = false;
    const newErrors = { ...errors };
    
    // Validate name
    if (!formData.name) {
      newErrors.name = "Name is required";
      hasErrors = true;
    } else if (!validateName(formData.name)) {
      newErrors.name = "Name must be at least 2 characters";
      hasErrors = true;
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
      hasErrors = true;
    } else if (formData.email !== user.email && userStorage.getUserByEmail(formData.email)) {
      newErrors.email = "Email already in use";
      hasErrors = true;
    }
    
    // Validate phone
    if (!formData.phone) {
      newErrors.phone = "Phone is required";
      hasErrors = true;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
      hasErrors = true;
    }
    
    // Validate password if changing
    if (formData.newPassword || formData.confirmNewPassword || formData.currentPassword) {
      // Current password required and must match
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required to change password";
        hasErrors = true;
      } else if (formData.currentPassword !== user.password) {
        newErrors.currentPassword = "Current password is incorrect";
        hasErrors = true;
      }
      
      // Validate new password
      if (formData.newPassword && !validatePassword(formData.newPassword)) {
        newErrors.newPassword = "Password must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number";
        hasErrors = true;
      }
      
      // Confirm password must match
      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = "Passwords do not match";
        hasErrors = true;
      }
    }
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    // Update user
    const updatedUser: User = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.newPassword ? formData.newPassword : user.password,
    };
    
    userStorage.updateUser(updatedUser);
    authStorage.setCurrentUser(updatedUser);
    
    setUser(updatedUser);
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };
  
  if (!user) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  return (
    <Card className="glass animate-fade-in">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
          
          <div className="border-t border-white/10 my-4 pt-4">
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                className={errors.currentPassword ? "border-red-500" : ""}
              />
              {errors.currentPassword && (
                <p className="text-sm text-red-500">{errors.currentPassword}</p>
              )}
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                className={errors.newPassword ? "border-red-500" : ""}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword}</p>
              )}
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className={errors.confirmNewPassword ? "border-red-500" : ""}
              />
              {errors.confirmNewPassword && (
                <p className="text-sm text-red-500">{errors.confirmNewPassword}</p>
              )}
            </div>
          </div>
          
          {errors.general && (
            <p className="text-sm text-red-500 text-center">{errors.general}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full animated-btn">
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileForm;
