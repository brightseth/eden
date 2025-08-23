import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { WorkViewer } from '@/components/archive/WorkViewer';

interface WorkPageProps {
  params: Promise<{
    agent: string;
    type: string;
    id: string;
  }>;
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { agent: agentId, type, id } = await params;
  const supabase = await createClient();
  
  // Determine archive type from URL
  const archiveType = type === 'generations' ? 'generation' : 
                      type === 'early-works' ? 'early-work' : 
                      type.replace(/s$/, ''); // Remove trailing 's'
  
  // Get the work
  const { data: work, error } = await supabase
    .from('agent_archives')
    .select('*')
    .eq('agent_id', agentId)
    .eq('archive_type', archiveType)
    .eq('archive_number', parseInt(id))
    .single();
  
  if (error || !work) {
    notFound();
  }
  
  // Get trainer info if exists
  let trainer = null;
  if (work.trainer_id) {
    const { data: trainerData } = await supabase
      .from('trainers')
      .select('id, display_name')
      .eq('id', work.trainer_id)
      .single();
    trainer = trainerData;
  }
  
  // Get prev/next navigation
  const { data: prevWork } = await supabase
    .from('agent_archives')
    .select('archive_number')
    .eq('agent_id', agentId)
    .eq('archive_type', archiveType)
    .lt('archive_number', work.archive_number)
    .order('archive_number', { ascending: false })
    .limit(1)
    .single();
  
  const { data: nextWork } = await supabase
    .from('agent_archives')
    .select('archive_number')
    .eq('agent_id', agentId)
    .eq('archive_type', archiveType)
    .gt('archive_number', work.archive_number)
    .order('archive_number', { ascending: true })
    .limit(1)
    .single();
  
  const navigation = {
    prev: prevWork?.archive_number,
    next: nextWork?.archive_number
  };
  
  return (
    <WorkViewer 
      work={work} 
      trainer={trainer}
      navigation={navigation}
    />
  );
}

export async function generateMetadata({ params }: WorkPageProps) {
  const { agent: agentId, type, id } = await params;
  const supabase = await createClient();
  
  const archiveType = type === 'generations' ? 'generation' : 
                      type === 'early-works' ? 'early-work' : 
                      type.replace(/s$/, '');
  
  const { data: work } = await supabase
    .from('agent_archives')
    .select('title, archive_number')
    .eq('agent_id', agentId)
    .eq('archive_type', archiveType)
    .eq('archive_number', parseInt(id))
    .single();
  
  const title = work?.title || `Work #${work?.archive_number || id}`;
  
  return {
    title: `${title} - ${agentId.charAt(0).toUpperCase() + agentId.slice(1)}`,
    description: `View ${title} from ${agentId}'s archive`
  };
}