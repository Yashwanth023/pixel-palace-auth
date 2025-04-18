
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';
import { userStorage, authStorage, User } from '@/utils/storage';
import { validateEmail, validatePassword, validatePhone, validateName } from '@/utils/validation';

const AuthForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>("login");
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: 1, // Default is client
  });
  
  const [errors, setErrors] = useState({
    login: {
      email: "",
      password: "",
      general: "",
    },
    register: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      general: "",
    },
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
    // Clear error when typing
    setErrors({
      ...errors,
      login: {
        ...errors.login,
        [name]: "",
        general: "",
      },
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: name === "role" ? parseInt(value) : value,
    });
    // Clear error when typing
    setErrors({
      ...errors,
      register: {
        ...errors.register,
        [name]: "",
        general: "",
      },
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasErrors = false;
    const newErrors = { ...errors.login };
    
    // Validate email
    if (!loginData.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = "Invalid email format";
      hasErrors = true;
    }
    
    // Validate password
    if (!loginData.password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors({
        ...errors,
        login: newErrors,
      });
      return;
    }
    
    // Check if user exists
    const user = userStorage.getUserByEmail(loginData.email);
    
    if (!user || user.password !== loginData.password) {
      setErrors({
        ...errors,
        login: {
          ...newErrors,
          general: "Invalid email or password",
        },
      });
      return;
    }
    
    // Login successful
    authStorage.setCurrentUser(user);
    toast({
      title: "Login successful!",
      description: `Welcome back, ${user.name}!`,
    });
    
    // Redirect based on role
    if (user.role === 0) { // Admin
      navigate("/admin");
    } else { // Client
      navigate("/client");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasErrors = false;
    const newErrors = { ...errors.register };
    
    // Validate name
    if (!registerData.name) {
      newErrors.name = "Name is required";
      hasErrors = true;
    } else if (!validateName(registerData.name)) {
      newErrors.name = "Name must be at least 2 characters";
      hasErrors = true;
    }
    
    // Validate email
    if (!registerData.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = "Invalid email format";
      hasErrors = true;
    } else if (userStorage.getUserByEmail(registerData.email)) {
      newErrors.email = "Email already in use";
      hasErrors = true;
    }
    
    // Validate phone
    if (!registerData.phone) {
      newErrors.phone = "Phone is required";
      hasErrors = true;
    } else if (!validatePhone(registerData.phone)) {
      newErrors.phone = "Invalid phone number format";
      hasErrors = true;
    }
    
    // Validate password
    if (!registerData.password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else if (!validatePassword(registerData.password)) {
      newErrors.password = "Password must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number";
      hasErrors = true;
    }
    
    // Validate confirm password
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors({
        ...errors,
        register: newErrors,
      });
      return;
    }
    
    // Create new user
    const newUser: User = {
      id: uuidv4(),
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      phone: registerData.phone,
      role: registerData.role as 0 | 1,
    };
    
    userStorage.addUser(newUser);
    
    toast({
      title: "Registration successful!",
      description: "Your account has been created. Please log in.",
    });
    
    // Switch to login tab
    setTab("login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px] glass animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">PixelPalace</CardTitle>
          <CardDescription className="text-center">Your task management solution</CardDescription>
        </CardHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="animated-btn">Login</TabsTrigger>
            <TabsTrigger value="register" className="animated-btn">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email" 
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className={errors.login.email ? "border-red-500" : ""}
                  />
                  {errors.login.email && (
                    <p className="text-sm text-red-500">{errors.login.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    id="login-password" 
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className={errors.login.password ? "border-red-500" : ""}
                  />
                  {errors.login.password && (
                    <p className="text-sm text-red-500">{errors.login.password}</p>
                  )}
                </div>
                
                {errors.login.general && (
                  <p className="text-sm text-red-500 text-center">{errors.login.general}</p>
                )}
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full animated-btn">
                  Login
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Name</Label>
                  <Input 
                    id="register-name" 
                    name="name"
                    placeholder="John Doe"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    className={errors.register.name ? "border-red-500" : ""}
                  />
                  {errors.register.name && (
                    <p className="text-sm text-red-500">{errors.register.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email" 
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className={errors.register.email ? "border-red-500" : ""}
                  />
                  {errors.register.email && (
                    <p className="text-sm text-red-500">{errors.register.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Phone</Label>
                  <Input 
                    id="register-phone" 
                    name="phone"
                    placeholder="123-456-7890"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    className={errors.register.phone ? "border-red-500" : ""}
                  />
                  {errors.register.phone && (
                    <p className="text-sm text-red-500">{errors.register.phone}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input 
                    id="register-password" 
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className={errors.register.password ? "border-red-500" : ""}
                  />
                  {errors.register.password && (
                    <p className="text-sm text-red-500">{errors.register.password}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirm Password</Label>
                  <Input 
                    id="register-confirm-password" 
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className={errors.register.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.register.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.register.confirmPassword}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-role">Role</Label>
                  <select
                    id="register-role" 
                    name="role"
                    value={registerData.role}
                    onChange={handleRegisterChange}
                    className="w-full bg-secondary text-secondary-foreground px-3 py-2 rounded-md border border-white/20"
                  >
                    <option value={1}>Client</option>
                    <option value={0}>Admin</option>
                  </select>
                </div>
                
                {errors.register.general && (
                  <p className="text-sm text-red-500 text-center">{errors.register.general}</p>
                )}
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full animated-btn">
                  Register
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthForm;
