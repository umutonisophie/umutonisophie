'use client';

import React, { useEffect, useState } from "react";

// No API token is used. The public /users endpoint is unauthenticated and
// allows 60 requests an hour unauthenticated, which is ample for a profile
// card. A token was previously hardcoded here and committed to the working
// tree; it has been removed. Revoke it at
// https://github.com/settings/tokens if it is still active - anything that
// reaches a public repository must be treated as compromised.

type GithubProfileData = {
  login: string;
  name: string;
  location: string | null;
  bio: string | null;
  avatar_url: string;
};

type Props = {
  username: string;
};

function GithubProfileCard({ username }: Props) {
  const [data, setData] = useState<GithubProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchProfileData() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const result: GithubProfileData = await response.json();
      setData(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfileData();
  }, [username]);

  if (loading) {
    return <p className="text-center py-4">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 py-4">{error}</p>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="shadow-2xl flex flex-row justify-center items-center gap-4 p-4 max-w-2xl w-full mx-auto rounded-lg bg-white">
      <img
        className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
        src={data.avatar_url}
        alt={`${data.name || data.login} avatar`}
      />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{data.name || data.login}</h1>
        <h5 className="text-gray-700">{data.location || 'Location not available'}</h5>
        <p className="text-gray-800">{data.bio || 'Bio not available'}</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <GithubProfileCard username="umutonisophie" />
    </div>
  );
}