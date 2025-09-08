<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Team;
use App\Models\User;

class TestTeamsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user as owner
        $owner = User::first();
        
        // Create test teams
        $teams = [
            [
                'name' => 'HTML Team',
                'description' => 'Frontend developers specializing in HTML, CSS, and JavaScript',
                'color' => '#E34F26', // HTML orange
                'is_active' => true,
                'sort_order' => 1,
                'owner_id' => $owner->id
            ],
            [
                'name' => 'PHP Team',
                'description' => 'Backend developers working with PHP and Laravel',
                'color' => '#777BB4', // PHP purple
                'is_active' => true,
                'sort_order' => 2,
                'owner_id' => $owner->id
            ],
            [
                'name' => 'Design Team',
                'description' => 'UI/UX designers and graphic designers',
                'color' => '#FF6B6B', // Design red
                'is_active' => true,
                'sort_order' => 3,
                'owner_id' => $owner->id
            ],
            [
                'name' => 'QA Team',
                'description' => 'Quality assurance and testing specialists',
                'color' => '#4ECDC4', // QA teal
                'is_active' => true,
                'sort_order' => 4,
                'owner_id' => $owner->id
            ],
            [
                'name' => 'DevOps Team',
                'description' => 'Infrastructure and deployment specialists',
                'color' => '#45B7D1', // DevOps blue
                'is_active' => true,
                'sort_order' => 5,
                'owner_id' => $owner->id
            ]
        ];

        foreach ($teams as $teamData) {
            $team = Team::create($teamData);
            
            // Assign some users to each team (randomly select 2-4 users)
            $users = User::where('id', '>', 1)->inRandomOrder()->limit(rand(2, 4))->get();
            
            foreach ($users as $index => $user) {
                $role = $index === 0 ? 'admin' : 'member'; // First user is admin
                $team->members()->attach($user->id, ['role' => $role]);
            }
        }

        $this->command->info('Test teams created successfully!');
    }
}