<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TaskStatus;

class TaskStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultStatuses = [
            // ToDo Category
            [
                'name' => 'ToDo',
                'category' => 'todo',
                'color' => '#6B7280', // Gray
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Backlog',
                'category' => 'todo',
                'color' => '#9CA3AF', // Light Gray
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            
            // In Progress Category
            [
                'name' => 'In Progress',
                'category' => 'in_progress',
                'color' => '#3B82F6', // Blue
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'In Review',
                'category' => 'in_progress',
                'color' => '#8B5CF6', // Purple
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'QA',
                'category' => 'in_progress',
                'color' => '#F59E0B', // Amber
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
            
            // Done Category
            [
                'name' => 'Completed',
                'category' => 'done',
                'color' => '#10B981', // Green
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Closed',
                'category' => 'done',
                'color' => '#6B7280', // Gray
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Cancelled',
                'category' => 'done',
                'color' => '#EF4444', // Red
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($defaultStatuses as $status) {
            TaskStatus::updateOrCreate(
                [
                    'name' => $status['name'],
                    'category' => $status['category']
                ],
                $status
            );
        }
    }
}