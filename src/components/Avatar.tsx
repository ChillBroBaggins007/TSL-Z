import { useState } from 'react';

interface AvatarProps {
  name: string;
  avatarUrl?: string;
  size?: number;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function colorFromName(name: string): string {
  const colors = [
    'bg-primary-soft text-primary',
    'bg-accent-soft text-accent',
    'bg-emerald-100 text-emerald-700',
    'bg-sky-100 text-sky-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-teal-100 text-teal-700',
    'bg-indigo-100 text-indigo-700',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({ name, avatarUrl, size = 40, className = '' }: AvatarProps) {
  const [error, setError] = useState(false);

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${Math.max(10, size * 0.35)}px`,
  };

  if (avatarUrl && !error) {
    return (
      <img
        src={`/${avatarUrl}`}
        alt={name}
        style={style}
        onError={() => setError(true)}
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      style={style}
      className={`rounded-full flex items-center justify-center font-semibold shrink-0 ${colorFromName(name)} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
