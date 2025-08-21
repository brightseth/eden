'use client';

import Image from 'next/image';
import { Mail, Globe, Twitter, Instagram, Linkedin, Github, ExternalLink } from 'lucide-react';

export interface TrainerProfile {
  name: string;
  role: string;
  bio: string;
  profileImage?: string;
  email?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  farcaster?: string;
}

interface TrainerCardProps {
  trainer: TrainerProfile;
  isOpen: boolean;
  onToggle: () => void;
}

export function TrainerCard({ trainer, isOpen, onToggle }: TrainerCardProps) {
  const socialLinks = [
    { icon: Mail, href: trainer.email ? `mailto:${trainer.email}` : null, label: 'Email' },
    { icon: Globe, href: trainer.website, label: 'Website' },
    { icon: Twitter, href: trainer.twitter ? `https://twitter.com/${trainer.twitter}` : null, label: 'Twitter' },
    { icon: Instagram, href: trainer.instagram ? `https://instagram.com/${trainer.instagram}` : null, label: 'Instagram' },
    { icon: Linkedin, href: trainer.linkedin ? `https://linkedin.com/in/${trainer.linkedin}` : null, label: 'LinkedIn' },
    { icon: Github, href: trainer.github ? `https://github.com/${trainer.github}` : null, label: 'GitHub' },
  ].filter(link => link.href);

  return (
    <div className="border border-gray-700 bg-gray-950">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
      >
        <div className="flex items-center gap-3">
          {trainer.profileImage ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-800">
              <Image
                src={trainer.profileImage}
                alt={trainer.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
              {trainer.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
          <div className="text-left">
            <p className="text-sm font-bold text-white">{trainer.name}</p>
            <p className="text-xs text-gray-400">{trainer.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">VIEW PROFILE</span>
          <ExternalLink className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-gray-700 p-4 space-y-4 animate-in slide-in-from-top-2">
          {/* Bio */}
          <div>
            <p className="text-sm text-gray-300 leading-relaxed">{trainer.bio}</p>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <a
                    key={idx}
                    href={link.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 hover:text-white transition-all"
                    aria-label={link.label}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
              {trainer.farcaster && (
                <a
                  href={`https://warpcast.com/${trainer.farcaster}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 hover:text-white transition-all"
                  aria-label="Farcaster"
                >
                  <span className="w-3 h-3">🟪</span>
                  <span>Farcaster</span>
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}