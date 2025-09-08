<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Core system seeders
            SuperAdminSeeder::class,
            OrganizationSeeder::class,
            DefaultOrganizationRoleSeeder::class,
            OrganizationRoleSeeder::class,
            
            // Project and task management seeders
            ProjectStatusSeeder::class,
            ProjectTypeSeeder::class,
            TaskStatusSeeder::class,
            
            // Test data seeders (only for development)
            TestUsersSeeder::class,
            TestTeamsSeeder::class,
        ]);
    }
}
