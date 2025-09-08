<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\OrganizationRole;

class OrganizationRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Project Manager',
                'description' => 'Manages projects and coordinates team activities',
                'color' => '#0F7173',
                'sort_order' => 1,
                'permissions' => ['manage_projects', 'view_reports', 'assign_tasks']
            ],
            [
                'name' => 'Developer',
                'description' => 'Develops and maintains software applications',
                'color' => '#4D6CFA',
                'sort_order' => 2,
                'permissions' => ['view_projects', 'update_tasks', 'view_code']
            ],
            [
                'name' => 'Designer',
                'description' => 'Creates visual designs and user interfaces',
                'color' => '#E91E63',
                'sort_order' => 3,
                'permissions' => ['view_projects', 'create_designs', 'update_designs']
            ],
            [
                'name' => 'QA Tester',
                'description' => 'Tests software quality and reports bugs',
                'color' => '#FF9800',
                'sort_order' => 4,
                'permissions' => ['view_projects', 'test_features', 'report_bugs']
            ],
            [
                'name' => 'Client',
                'description' => 'External client with limited access',
                'color' => '#9C27B0',
                'sort_order' => 5,
                'permissions' => ['view_own_projects', 'view_reports']
            ]
        ];

        foreach ($roles as $roleData) {
            OrganizationRole::updateOrCreate(
                ['name' => $roleData['name']],
                $roleData
            );
        }
    }
}
