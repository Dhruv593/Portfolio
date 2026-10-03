import React from 'react';
import { ProfileData } from '../types';
import { githubAvatarUrl, profileAvatarUrl } from '../utils/imageUtils';

interface ProfileAvatarProps {
  profile: ProfileData;
  className: string;
  fallbackClassName: string;
  style?: React.CSSProperties;
  loading?: 'eager' | 'lazy';
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profile,
  className,
  fallbackClassName,
  style,
  loading = 'eager',
}) => {
  const primary = profileAvatarUrl(profile.avatarUrl, profile.github);
  const fallback = githubAvatarUrl(profile.github);
  const [failed, setFailed] = React.useState({ primary, fallback, step: 0 });
  const step = failed.primary === primary && failed.fallback === fallback ? failed.step : 0;
  const src = step === 0 ? (primary || fallback) : step === 1 && primary && fallback !== primary ? fallback : '';

  if (!src) {
    return (
      <div className={fallbackClassName} aria-label={profile.name || 'Profile'}>
        {profile.name ? profile.name.charAt(0) : 'A'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={profile.name}
      className={className}
      style={style}
      loading={loading}
      decoding="async"
      onError={() => setFailed({ primary, fallback, step: step + 1 })}
    />
  );
};
