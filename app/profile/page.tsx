"use client";
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ArrowLeft } from "lucide-react";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "Rahul Kumar",
    email: "rahul@example.com",
    phone: "+91 9876543210",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/student"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Information */}
        <Card className="mb-6">
          <h2 className="text-xl mb-6 text-gray-900">Personal Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              type="tel"
              label="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <Button type="submit">Update Profile</Button>
          </form>
        </Card>

        {/* Change Password */}
        <Card>
          <h2 className="text-xl mb-6 text-gray-900">Change Password</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
            />
            <Input
              type="password"
              label="New Password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
            />
            <Input
              type="password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <Button type="submit">Change Password</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
