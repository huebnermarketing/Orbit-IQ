<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class HealthController extends Controller
{
    /**
     * Basic health check endpoint
     */
    public function health()
    {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toISOString(),
            'service' => 'Orbit IQ API',
            'version' => '1.0.0'
        ]);
    }

    /**
     * Comprehensive health check endpoint
     */
    public function detailed()
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'redis' => $this->checkRedis(),
            'storage' => $this->checkStorage(),
            'queue' => $this->checkQueue(),
        ];

        $allHealthy = collect($checks)->every(fn($check) => $check['status'] === 'ok');

        return response()->json([
            'status' => $allHealthy ? 'healthy' : 'unhealthy',
            'timestamp' => now()->toISOString(),
            'service' => 'Orbit IQ API',
            'version' => '1.0.0',
            'checks' => $checks
        ], $allHealthy ? 200 : 503);
    }

    /**
     * Check database connection
     */
    private function checkDatabase()
    {
        try {
            DB::connection()->getPdo();
            $connectionTime = microtime(true);
            DB::select('SELECT 1');
            $queryTime = microtime(true) - $connectionTime;

            return [
                'status' => 'ok',
                'connection_time_ms' => round($queryTime * 1000, 2),
                'driver' => DB::connection()->getDriverName()
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Check Redis connection
     */
    private function checkRedis()
    {
        try {
            $startTime = microtime(true);
            Redis::ping();
            $responseTime = microtime(true) - $startTime;

            return [
                'status' => 'ok',
                'response_time_ms' => round($responseTime * 1000, 2),
                'memory_usage' => Redis::info('memory')['used_memory_human'] ?? 'unknown'
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Check storage (local/S3)
     */
    private function checkStorage()
    {
        try {
            $testFile = 'health-check-' . time() . '.txt';
            $testContent = 'Health check test at ' . now()->toISOString();
            
            // Test write
            Storage::put($testFile, $testContent);
            
            // Test read
            $readContent = Storage::get($testFile);
            
            // Test delete
            Storage::delete($testFile);

            return [
                'status' => 'ok',
                'disk' => config('filesystems.default'),
                'driver' => config('filesystems.disks.' . config('filesystems.default') . '.driver')
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Check queue system
     */
    private function checkQueue()
    {
        try {
            $queueConnection = config('queue.default');
            $queueSize = 0;

            if ($queueConnection === 'redis') {
                $queueSize = Redis::llen('queues:default');
            } elseif ($queueConnection === 'database') {
                $queueSize = DB::table('jobs')->count();
            }

            return [
                'status' => 'ok',
                'connection' => $queueConnection,
                'pending_jobs' => $queueSize
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }
}
