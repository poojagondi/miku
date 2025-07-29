"use client";

import { useState } from "react";
import { MikuLoader } from "@/components/ui/miku-loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoaderDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 p-8">
      <div className="space-y-8 max-w-2xl w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎵 Miku Loader Demo 🎵
          </h1>
          <p className="text-gray-600">
            Featuring the spinning Hatsune Miku head loader!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default Loader */}
          <Card>
            <CardHeader>
              <CardTitle>Default Size</CardTitle>
              <CardDescription>Standard 48px loader</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <MikuLoader text="Loading..." />
            </CardContent>
          </Card>

          {/* Large Loader */}
          <Card>
            <CardHeader>
              <CardTitle>Large Size</CardTitle>
              <CardDescription>
                96px loader for main loading states
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <MikuLoader size={96} text="Please wait..." />
            </CardContent>
          </Card>

          {/* Small Loader */}
          <Card>
            <CardHeader>
              <CardTitle>Small Size</CardTitle>
              <CardDescription>24px loader for buttons</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <MikuLoader size={24} text="Processing..." />
            </CardContent>
          </Card>

          {/* No Text Loader */}
          <Card>
            <CardHeader>
              <CardTitle>No Text</CardTitle>
              <CardDescription>Loader without text</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <MikuLoader size={64} text="" />
            </CardContent>
          </Card>
        </div>

        {/* Interactive Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Demo</CardTitle>
            <CardDescription>
              Click the button to see the loader in action
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {isLoading ? (
              <div className="py-8">
                <MikuLoader size={80} text="Loading your notes..." />
              </div>
            ) : (
              <div className="py-8">
                <p className="text-green-600 font-semibold">
                  ✅ Loading complete!
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Click below to see the loader again
                </p>
              </div>
            )}
            <Button
              onClick={simulateLoading}
              disabled={isLoading}
              className="min-w-[150px]"
            >
              {isLoading ? <MikuLoader size={20} text="" /> : "Start Loading"}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>The Miku head spins continuously using CSS animations!</p>
          <p>
            Perfect for any loading state in your Miku-themed application. 🎤
          </p>
        </div>
      </div>
    </div>
  );
}
