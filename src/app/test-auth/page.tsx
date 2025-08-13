'use client';

import { useState, useEffect } from 'react';

export default function TestAuth() {
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check debug endpoint
      const debugRes = await fetch('/api/debug/auth');
      const debugData = await debugRes.json();
      
      // Check me endpoint
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      
      setAuthStatus({
        debug: debugData,
        me: meData,
        meStatus: meRes.status
      });
    } catch (error: any) {
      setAuthStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Debug Info:</h2>
        <pre className="text-sm">{JSON.stringify(authStatus?.debug, null, 2)}</pre>
      </div>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">User Info (from /api/auth/me):</h2>
        <p>Status: {authStatus?.meStatus}</p>
        <pre className="text-sm">{JSON.stringify(authStatus?.me, null, 2)}</pre>
      </div>
      
      <div className="mt-4 space-y-2">
        <a href="/admin/login" className="text-blue-600 underline block">Go to Login</a>
        <a href="/admin/banners" className="text-blue-600 underline block">Try Banner Page</a>
        <a href="/admin/dashboard" className="text-blue-600 underline block">Try Dashboard</a>
      </div>
    </div>
  );
}