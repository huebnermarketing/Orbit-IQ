<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\Project;
use App\Models\User;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first project and user for seeding
        $project = Project::first();
        $user = User::first();

        if (!$project || !$user) {
            $this->command->info('No projects or users found. Please run project and user seeders first.');
            return;
        }

        $tasks = [
            [
                'name' => 'Project Setup',
                'description' => 'Initialize the project structure and set up the development environment.',
                'status' => 'completed',
                'priority' => 'high',
                'project_id' => $project->id,
                'assigned_to' => $user->id,
                'created_by' => $user->id,
                'due_date' => now()->addDays(7),
                'estimated_hours' => 8,
                'actual_hours' => 6,
                'tags' => ['setup', 'development'],
                'sort_order' => 1,
            ],
            [
                'name' => 'Database Design',
                'description' => 'Design the database schema and create necessary tables and relationships.',
                'status' => 'in_progress',
                'priority' => 'high',
                'project_id' => $project->id,
                'assigned_to' => $user->id,
                'created_by' => $user->id,
                'due_date' => now()->addDays(10),
                'estimated_hours' => 16,
                'actual_hours' => 8,
                'tags' => ['database', 'design'],
                'sort_order' => 2,
            ],
            [
                'name' => 'User Authentication',
                'description' => 'Implement user registration, login, and authentication system.',
                'status' => 'todo',
                'priority' => 'medium',
                'project_id' => $project->id,
                'assigned_to' => $user->id,
                'created_by' => $user->id,
                'due_date' => now()->addDays(14),
                'estimated_hours' => 12,
                'actual_hours' => null,
                'tags' => ['authentication', 'security'],
                'sort_order' => 3,
            ],
            [
                'name' => 'Frontend Components',
                'description' => 'Create reusable UI components for the frontend application.',
                'status' => 'todo',
                'priority' => 'medium',
                'project_id' => $project->id,
                'assigned_to' => $user->id,
                'created_by' => $user->id,
                'due_date' => now()->addDays(21),
                'estimated_hours' => 20,
                'actual_hours' => null,
                'tags' => ['frontend', 'ui', 'components'],
                'sort_order' => 4,
            ],
            [
                'name' => 'API Development',
                'description' => 'Develop RESTful APIs for the application backend.',
                'status' => 'todo',
                'priority' => 'high',
                'project_id' => $project->id,
                'assigned_to' => $user->id,
                'created_by' => $user->id,
                'due_date' => now()->addDays(28),
                'estimated_hours' => 24,
                'actual_hours' => null,
                'tags' => ['api', 'backend'],
                'sort_order' => 5,
            ],
            [
                'name' => 'Testing',
                'description' => 'Write unit tests and integration tests for the application.',
                'status' => 'todo',
                'priority' => 'low',
                'project_id' => $project->id,
                'assigned_to' => $user->id,
                'created_by' => $user->id,
                'due_date' => now()->addDays(35),
                'estimated_hours' => 16,
                'actual_hours' => null,
                'tags' => ['testing', 'quality'],
                'sort_order' => 6,
            ],
        ];

        foreach ($tasks as $taskData) {
            Task::create($taskData);
        }

        $this->command->info('Tasks seeded successfully!');
    }
}