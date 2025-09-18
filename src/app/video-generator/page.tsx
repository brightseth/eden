/**
 * Universal Video Generator Page
 * Main interface for generating video prompts across all Eden agents
 */

import UniversalVideoPromptGenerator from '@/components/video/universal-video-prompt-generator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eden Universal Video Generator',
  description: 'Generate customized video prompts for Eden AI agents',
};

export default function VideoGeneratorPage() {
  return <UniversalVideoPromptGenerator />;
}