<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProjectType;

class ProjectTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projectTypes = [
            [
                'name' => 'Fixed Cost',
                'description' => 'Projects with a predetermined fixed budget and scope',
                'color' => '#3B82F6',
                'sort_order' => 1,
                'is_active' => true,
                'is_system_defined' => true
            ],
            [
                'name' => 'Maintenance',
                'description' => 'Ongoing maintenance and support projects',
                'color' => '#10B981',
                'sort_order' => 2,
                'is_active' => true,
                'is_system_defined' => true
            ],
            [
                'name' => 'Hosting',
                'description' => 'Hosting and infrastructure management projects',
                'color' => '#F59E0B',
                'sort_order' => 3,
                'is_active' => true,
                'is_system_defined' => true
            ],
            [
                'name' => 'Adhoc',
                'description' => 'Ad-hoc and on-demand project work',
                'color' => '#8B5CF6',
                'sort_order' => 4,
                'is_active' => true,
                'is_system_defined' => true
            ],
            [
                'name' => 'SaaS',
                'description' => 'Software as a Service development and management',
                'color' => '#EF4444',
                'sort_order' => 5,
                'is_active' => true,
                'is_system_defined' => true
            ]
        ];

        foreach ($projectTypes as $projectType) {
            ProjectType::create($projectType);
        }
    }
}