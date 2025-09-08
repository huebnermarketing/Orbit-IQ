<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\OrganizationRole;

class DefaultOrganizationRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultRoles = [
            [
                'name' => 'Leadership',
                'description' => 'Executive leadership and strategic decision making',
                'color' => '#8B5CF6',
                'sort_order' => 1,
                'is_locked' => true,
                'permissions' => ['manage_all', 'view_reports', 'manage_users', 'manage_projects']
            ],
            [
                'name' => 'AM',
                'description' => 'Account Manager - manages client relationships and accounts',
                'color' => '#06B6D4',
                'sort_order' => 2,
                'is_locked' => true,
                'permissions' => ['manage_accounts', 'view_reports', 'manage_clients']
            ],
            [
                'name' => 'PM',
                'description' => 'Project Manager - manages projects and coordinates team activities',
                'color' => '#0F7173',
                'sort_order' => 3,
                'is_locked' => true,
                'permissions' => ['manage_projects', 'view_reports', 'assign_tasks', 'manage_team']
            ],
            [
                'name' => 'TL',
                'description' => 'Team Lead - leads development teams and technical decisions',
                'color' => '#059669',
                'sort_order' => 4,
                'is_locked' => true,
                'permissions' => ['manage_team', 'view_code', 'technical_review', 'assign_tasks']
            ],
            [
                'name' => 'HR',
                'description' => 'Human Resources - manages employee relations and policies',
                'color' => '#DC2626',
                'sort_order' => 5,
                'is_locked' => true,
                'permissions' => ['manage_employees', 'view_hr_reports', 'manage_policies']
            ],
            [
                'name' => 'Finance',
                'description' => 'Finance team - manages budgets, billing, and financial reporting',
                'color' => '#16A34A',
                'sort_order' => 6,
                'is_locked' => true,
                'permissions' => ['manage_budget', 'view_financial_reports', 'manage_billing']
            ],
            [
                'name' => 'Sales',
                'description' => 'Sales team - handles sales activities and client acquisition',
                'color' => '#EA580C',
                'sort_order' => 7,
                'is_locked' => true,
                'permissions' => ['manage_sales', 'view_sales_reports', 'manage_leads']
            ],
            [
                'name' => 'Marketing',
                'description' => 'Marketing team - handles marketing campaigns and brand management',
                'color' => '#C2410C',
                'sort_order' => 8,
                'is_locked' => true,
                'permissions' => ['manage_campaigns', 'view_marketing_reports', 'manage_content']
            ],
            [
                'name' => 'SEO',
                'description' => 'SEO Specialist - optimizes search engine visibility and rankings',
                'color' => '#7C3AED',
                'sort_order' => 9,
                'is_locked' => true,
                'permissions' => ['manage_seo', 'view_analytics', 'manage_keywords']
            ],
            [
                'name' => 'Developers',
                'description' => 'Software Developers - develops and maintains applications',
                'color' => '#4D6CFA',
                'sort_order' => 10,
                'is_locked' => true,
                'permissions' => ['view_projects', 'update_tasks', 'view_code', 'create_features']
            ],
            [
                'name' => 'QA',
                'description' => 'Quality Assurance - tests software quality and reports bugs',
                'color' => '#FF9800',
                'sort_order' => 11,
                'is_locked' => true,
                'permissions' => ['view_projects', 'test_features', 'report_bugs', 'manage_testing']
            ],
            [
                'name' => 'Administrative',
                'description' => 'Administrative staff - handles office operations and support',
                'color' => '#6B7280',
                'sort_order' => 12,
                'is_locked' => true,
                'permissions' => ['view_basic_reports', 'manage_documents', 'support_users']
            ],
            [
                'name' => 'BA',
                'description' => 'Business Analyst - analyzes business requirements and processes',
                'color' => '#0891B2',
                'sort_order' => 13,
                'is_locked' => true,
                'permissions' => ['analyze_requirements', 'view_reports', 'manage_documentation']
            ],
            [
                'name' => 'Client',
                'description' => 'External client with limited access to their projects',
                'color' => '#9C27B0',
                'sort_order' => 14,
                'is_locked' => true,
                'permissions' => ['view_own_projects', 'view_reports', 'view_documents']
            ]
        ];

        foreach ($defaultRoles as $roleData) {
            OrganizationRole::updateOrCreate(
                ['name' => $roleData['name']],
                $roleData
            );
        }
    }
}
