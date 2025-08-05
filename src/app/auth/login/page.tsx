"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Import API client dynamically to avoid SSR issues
let apiClient: any = null;

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure component is fully mounted before any dynamic operations
  useEffect(() => {
    // Dynamic import of API client to avoid SSR issues
    import("@/lib/apiClient").then((module) => {
      apiClient = module.default;
      setMounted(true);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mounted || !apiClient) {
      setError("Application is still loading. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.login({
        email: formData.email,
        password: formData.password,
      });
      
      if (response.success) {
        // Success - redirect to dashboard
        router.replace("/dashboard");
      } else {
        setError(response.message || "Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      setError(error.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state until component is fully mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-md">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-foreground">
          Login to Your Account
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Error display */}
          {error && (
            <div 
              className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
              role="alert"
              aria-live="polite"
            >
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
              disabled={loading}
              className="w-full"
              aria-describedby={error ? "error-message" : undefined}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="current-password"
              disabled={loading}
              className="w-full"
              minLength={8}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loading || !mounted} 
            className="w-full"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link 
              href="/auth/signup" 
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Create account
            </Link>
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <Link 
            href="/auth/forgot-password" 
            className="text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
