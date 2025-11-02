import { Metadata } from 'next';
import StudioClient from './StudioClient';

export const metadata: Metadata = {
  title: 'Claude Plugin Studio - Visual Plugin Development Tool',
  description: 'Create Claude Code plugins with an intuitive visual interface, templates, and built-in debugging',
};

export default function StudioPage() {
  return <StudioClient />;
}
