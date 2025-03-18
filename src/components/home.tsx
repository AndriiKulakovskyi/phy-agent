import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import PatientDashboard from "./dashboard/PatientDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import AccessibilityControls from "./accessibility/AccessibilityControls";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";

// Mock authentication state - in a real app, this would come from a context or state management solution
interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "admin";
  avatar?: string;
}

interface HomeProps {
  initialUser?: User | null;
}

const Home = ({ initialUser = null }: HomeProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAccessibilityControls, setShowAccessibilityControls] =
    useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Authentication function using our API context
  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll keep the mock authentication
      // In a real implementation, this would use the AuthContext
      // const { login } = useAuth();
      // await login(email, password);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock authentication logic
      if (email === "patient@example.com" && password === "password") {
        setUser({
          id: "1",
          name: "Jane Doe",
          email: "patient@example.com",
          role: "patient",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        });
      } else if (email === "admin@example.com" && password === "password") {
        setUser({
          id: "2",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        });
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    // In a real app, you would also clear tokens, cookies, etc.
  };

  const toggleAccessibilityControls = () => {
    setShowAccessibilityControls(!showAccessibilityControls);
  };

  // Handle signup form submission
  const handleSignup = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock signup logic - in a real app, this would call an API
      if (email === "taken@example.com") {
        setError("This email is already registered");
      } else {
        // Create a new user
        setUser({
          id: "3",
          name: name,
          email: email,
          role: "patient",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        });
        setShowSignup(false);
      }
    } catch (err) {
      setError("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between login and signup forms
  const toggleAuthForm = () => {
    setShowSignup(!showSignup);
    setError(null);
  };

  // Render the appropriate component based on authentication state and user role
  const renderContent = () => {
    if (!user) {
      if (showSignup) {
        return (
          <SignupForm
            onSignup={handleSignup}
            isLoading={isLoading}
            error={error}
            onLoginClick={toggleAuthForm}
          />
        );
      }
      return (
        <LoginForm
          onLogin={handleLogin}
          isLoading={isLoading}
          error={error}
          onCreateAccount={toggleAuthForm}
        />
      );
    }

    if (user.role === "admin") {
      return (
        <AdminDashboard
          userName={user.name}
          userAvatar={user.avatar}
          onLogout={handleLogout}
        />
      );
    }

    return (
      <PatientDashboard
        userName={user.name}
        userAvatar={user.avatar}
        onLogout={handleLogout}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {renderContent()}

      {/* Accessibility Controls Toggle Button */}
      {user && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-40 rounded-full h-10 w-10 shadow-md bg-white"
          onClick={toggleAccessibilityControls}
        >
          <Settings className="h-5 w-5" />
        </Button>
      )}

      {/* Accessibility Controls Panel */}
      <AccessibilityControls
        isOpen={showAccessibilityControls}
        onClose={() => setShowAccessibilityControls(false)}
      />
    </div>
  );
};

export default Home;
