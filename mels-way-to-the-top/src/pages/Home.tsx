import Dashboard from '../components/Dashboard/Dashboard';
import { Module } from '../data/modules';

export default function Home({ modules }: { modules: Module[] }) {
  return <Dashboard modules={modules} />;
} 