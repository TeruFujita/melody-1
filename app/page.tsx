import { Login } from "@/components/login";
import { Navbar } from "@/components/navbar";
import React from "react";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Login />
      </main>
    </div>
  );
}

export default Home;
