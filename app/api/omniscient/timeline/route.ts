import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock timeline data for now
    const mockActivities = [
      {
        id: 1,
        project_name: 'Dashboard Omnisciente',
        project_emoji: '🧠',
        activity_type: 'deploy',
        description: 'Dashboard omnisciente desplegado con 173+ proyectos auto-descubiertos',
        timestamp: new Date().toISOString(),
        timeAgo: 'Ahora mismo',
        metadata: { build: 'success', projects_found: 173 }
      },
      {
        id: 2,
        project_name: 'Phone Language Bot',
        project_emoji: '🎓',
        activity_type: 'conversation',
        description: 'Webhook Twilio configurado y funcionando',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        timeAgo: '30m',
        metadata: { webhook_url: 'configured' }
      }
    ];

    const todayStats = [
      { count: 2, activity_type: 'deploy', projects_affected: 1 },
      { count: 1, activity_type: 'conversation', projects_affected: 1 }
    ];

    const projectStats = [
      {
        id: 'dashboard-omnisciente',
        name: 'Dashboard Omnisciente',
        emoji: '🧠',
        activity_count: 25,
        last_activity: new Date().toISOString(),
        lastActivity: 'Ahora mismo',
        activityLevel: 'high'
      }
    ];

    return NextResponse.json({
      recentActivity: mockActivities,
      todayStats: todayStats,
      projectStats: projectStats
    });

  } catch (error) {
    console.error('Error fetching simple timeline:', error);
    return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 });
  }
}