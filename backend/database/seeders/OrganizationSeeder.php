<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Organization;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Organization::create([
            'name' => 'Orbit IQ Company',
            'description' => 'A modern project management platform for teams',
            'email' => 'contact@orbitiq.com',
            'phone' => '+1 (555) 123-4567',
            'address' => "123 Business St, Suite 100\nSan Francisco, CA 94105",
            'website' => 'https://www.orbitiq.com',
            'timezone' => 'UTC',
            'logo' => null
        ]);
    }
}
