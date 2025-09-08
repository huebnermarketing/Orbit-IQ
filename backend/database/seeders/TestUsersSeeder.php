<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\OrganizationRole;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get organization roles
        $leadershipRole = OrganizationRole::where('name', 'Leadership')->first();
        $pmRole = OrganizationRole::where('name', 'PM')->first();
        $amRole = OrganizationRole::where('name', 'AM')->first();
        $tlRole = OrganizationRole::where('name', 'TL')->first();
        $hrRole = OrganizationRole::where('name', 'HR')->first();
        $financeRole = OrganizationRole::where('name', 'Finance')->first();
        $salesRole = OrganizationRole::where('name', 'Sales')->first();
        $marketingRole = OrganizationRole::where('name', 'Marketing')->first();
        $seoRole = OrganizationRole::where('name', 'SEO')->first();
        $devRole = OrganizationRole::where('name', 'Developers')->first();
        $qaRole = OrganizationRole::where('name', 'QA')->first();
        $adminRole = OrganizationRole::where('name', 'Administrative')->first();
        $baRole = OrganizationRole::where('name', 'BA')->first();
        $clientRole = OrganizationRole::where('name', 'Client')->first();

        // Test users with different organization roles
        $testUsers = [
            [
                'name' => 'John Smith',
                'email' => 'john.smith@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$leadershipRole, $pmRole],
                'timezone' => 'America/New_York',
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$amRole, $salesRole],
                'timezone' => 'America/Chicago',
            ],
            [
                'name' => 'Mike Chen',
                'email' => 'mike.chen@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$tlRole, $devRole],
                'timezone' => 'America/Los_Angeles',
            ],
            [
                'name' => 'Emily Davis',
                'email' => 'emily.davis@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$hrRole, $adminRole],
                'timezone' => 'America/New_York',
            ],
            [
                'name' => 'David Wilson',
                'email' => 'david.wilson@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$financeRole, $baRole],
                'timezone' => 'America/Denver',
            ],
            [
                'name' => 'Lisa Brown',
                'email' => 'lisa.brown@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$marketingRole, $seoRole],
                'timezone' => 'America/Chicago',
            ],
            [
                'name' => 'Alex Rodriguez',
                'email' => 'alex.rodriguez@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$qaRole, $devRole],
                'timezone' => 'America/Los_Angeles',
            ],
            [
                'name' => 'Jessica Taylor',
                'email' => 'jessica.taylor@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$pmRole, $tlRole],
                'timezone' => 'America/New_York',
            ],
            [
                'name' => 'Robert Kim',
                'email' => 'robert.kim@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$amRole, $marketingRole],
                'timezone' => 'America/Chicago',
            ],
            [
                'name' => 'Amanda White',
                'email' => 'amanda.white@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$clientRole, $baRole],
                'timezone' => 'America/Denver',
            ],
            [
                'name' => 'Kevin Lee',
                'email' => 'kevin.lee@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$leadershipRole, $financeRole],
                'timezone' => 'America/Los_Angeles',
            ],
            [
                'name' => 'Maria Garcia',
                'email' => 'maria.garcia@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$hrRole, $salesRole],
                'timezone' => 'America/New_York',
            ],
            [
                'name' => 'Tom Anderson',
                'email' => 'tom.anderson@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$devRole, $qaRole],
                'timezone' => 'America/Chicago',
            ],
            [
                'name' => 'Rachel Green',
                'email' => 'rachel.green@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$seoRole, $marketingRole],
                'timezone' => 'America/Los_Angeles',
            ],
            [
                'name' => 'James Miller',
                'email' => 'james.miller@orbitiq.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'organization_roles' => [$pmRole, $amRole],
                'timezone' => 'America/Denver',
            ]
        ];

        foreach ($testUsers as $userData) {
            // Create the user
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => $userData['password'],
                'role' => $userData['role'],
                'timezone' => $userData['timezone'],
                'email_verified_at' => now(),
            ]);

            // Attach organization roles
            if (!empty($userData['organization_roles'])) {
                $roleIds = collect($userData['organization_roles'])
                    ->filter() // Remove null values
                    ->pluck('id')
                    ->toArray();
                
                if (!empty($roleIds)) {
                    $user->organizationRoles()->attach($roleIds);
                }
            }
        }

        $this->command->info('Test users created successfully!');
        $this->command->info('All users have password: password123');
    }
}