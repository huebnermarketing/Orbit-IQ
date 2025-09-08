<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProjectStatus;

class ProjectStatusSeeder extends Seeder
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
                'name' => 'Hold',
                'category' => 'todo',
                'color' => '#9CA3AF', // Light Gray
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],

            // In Progress Category
            [
                'name' => 'Active',
                'category' => 'in_progress',
                'color' => '#F59E0B', // Amber
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Client Round',
                'category' => 'in_progress',
                'color' => '#8B5CF6', // Purple
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Post Launch',
                'category' => 'in_progress',
                'color' => '#EC4899', // Pink
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],

            // Completed Category
            [
                'name' => 'Closed',
                'category' => 'closed',
                'color' => '#059669', // Green
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Archived',
                'category' => 'closed',
                'color' => '#10B981', // Emerald
                'is_system_defined' => true,
                'is_locked' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($defaultStatuses as $status) {
            ProjectStatus::updateOrCreate(
                [
                    'name' => $status['name'],
                    'category' => $status['category'],
                ],
                $status
            );
        }
    }
}