import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const tasksPath = path.join(process.cwd(), '..', '..', 'tasks.json');
    const tasksData = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));
    
    const tasks = tasksData.tasks.map((task: any) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      agent: task.agent,
      dueAt: task.dueAt,
      subtasks: task.notes ? (task.notes.match(/##/g) || []).length : undefined
    }));

    return NextResponse.json({
      success: true,
      data: tasks,
      counts: {
        total: tasks.length,
        todo: tasks.filter((t: any) => t.status === 'todo').length,
        'in-progress': tasks.filter((t: any) => t.status === 'in-progress').length,
        blocked: tasks.filter((t: any) => t.status === 'blocked').length,
        done: tasks.filter((t: any) => t.status === 'done').length
      }
    });
  } catch (error: any) {
    console.error('Error reading tasks:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
