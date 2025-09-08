<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FaviconService
{
    /**
     * Fetch favicon from a website URL and store it in S3
     */
    public function fetchAndStoreFavicon(string $websiteUrl): ?string
    {
        try {
            // Normalize the URL
            $websiteUrl = $this->normalizeUrl($websiteUrl);
            
            // Try multiple favicon sources
            $faviconUrls = $this->getFaviconUrls($websiteUrl);
            
            foreach ($faviconUrls as $faviconUrl) {
                if ($faviconUrl) { // Skip null URLs from HTML parsing
                    $logoUrl = $this->downloadAndStoreFavicon($faviconUrl, $websiteUrl);
                    if ($logoUrl) {
                        return $logoUrl;
                    }
                }
            }
            
            // If no favicon found, generate a placeholder
            return $this->generatePlaceholderLogo($websiteUrl);
            
        } catch (\Exception $e) {
            \Log::error('Failed to fetch favicon for ' . $websiteUrl . ': ' . $e->getMessage());
            return $this->generatePlaceholderLogo($websiteUrl);
        }
    }
    
    /**
     * Normalize URL to ensure it has proper protocol
     */
    private function normalizeUrl(string $url): string
    {
        if (!preg_match('/^https?:\/\//', $url)) {
            $url = 'https://' . $url;
        }
        return $url;
    }
    
    /**
     * Get possible favicon URLs to try
     */
    private function getFaviconUrls(string $websiteUrl): array
    {
        $parsedUrl = parse_url($websiteUrl);
        $domain = $parsedUrl['host'] ?? '';
        
        return [
            // Try to get favicon from HTML meta tags first (most reliable)
            $this->getFaviconFromHtml($websiteUrl),
            
            // High-quality favicon locations (PNG/SVG preferred)
            $websiteUrl . '/favicon.png',
            $websiteUrl . '/favicon.svg',
            $websiteUrl . '/apple-touch-icon.png',
            $websiteUrl . '/apple-touch-icon-precomposed.png',
            
            // Standard favicon.ico (lower priority)
            $websiteUrl . '/favicon.ico',
            
            // Google's favicon service as fallback
            'https://www.google.com/s2/favicons?domain=' . $domain . '&sz=64',
        ];
    }
    
    /**
     * Try to extract favicon URL from HTML meta tags
     */
    private function getFaviconFromHtml(string $websiteUrl): ?string
    {
        try {
            $response = Http::timeout(10)->get($websiteUrl);
            $html = $response->body();
            
            // Look for favicon in meta tags (multiple patterns)
            $patterns = [
                '/<link[^>]+rel=["\'](?:icon|shortcut icon|apple-touch-icon)["\'][^>]+href=["\']([^"\']+)["\'][^>]*>/i',
                '/<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\'](?:icon|shortcut icon|apple-touch-icon)["\'][^>]*>/i',
                '/<link[^>]+rel=["\']apple-touch-icon-precomposed["\'][^>]+href=["\']([^"\']+)["\'][^>]*>/i'
            ];
            
            foreach ($patterns as $pattern) {
                if (preg_match($pattern, $html, $matches)) {
                    $faviconUrl = $matches[1];
                    
                    // Convert relative URLs to absolute
                    if (strpos($faviconUrl, 'http') !== 0) {
                        $faviconUrl = $websiteUrl . '/' . ltrim($faviconUrl, '/');
                    }
                    
                    return $faviconUrl;
                }
            }
        } catch (\Exception $e) {
            \Log::warning('Failed to parse HTML for favicon: ' . $e->getMessage());
        }
        
        return null;
    }
    
    /**
     * Download favicon and store it in S3
     */
    private function downloadAndStoreFavicon(string $faviconUrl, string $websiteUrl): ?string
    {
        try {
            $response = Http::timeout(10)->get($faviconUrl);
            
            if ($response->successful() && $response->header('content-type')) {
                $contentType = $response->header('content-type');
                
                // Check if it's a valid image and not empty
                if (strpos($contentType, 'image/') === 0) {
                    $imageData = $response->body();
                    
                    // Skip empty files
                    if (strlen($imageData) === 0) {
                        return null;
                    }
                    
                    // Generate filename
                    $domain = parse_url($websiteUrl, PHP_URL_HOST);
                    $extension = $this->getExtensionFromContentType($contentType);
                    $filename = 'client-logos/' . Str::slug($domain) . '-' . time() . '.' . $extension;
                    
                    // Store in S3
                    Storage::disk('s3')->put($filename, $imageData, 'public');
                    
                    return Storage::disk('s3')->url($filename);
                }
            }
        } catch (\Exception $e) {
            \Log::warning('Failed to download favicon from ' . $faviconUrl . ': ' . $e->getMessage());
        }
        
        return null;
    }
    
    /**
     * Get file extension from content type
     */
    private function getExtensionFromContentType(string $contentType): string
    {
        $mimeToExt = [
            'image/png' => 'png',
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/gif' => 'gif',
            'image/svg+xml' => 'svg',
            'image/webp' => 'webp',
            'image/x-icon' => 'ico',
            'image/vnd.microsoft.icon' => 'ico',
            'image/ico' => 'ico',
            'image/x-ico' => 'ico',
            'application/octet-stream' => 'ico', // Some servers serve ICO as this
        ];
        
        return $mimeToExt[$contentType] ?? 'png';
    }
    
    /**
     * Generate a placeholder logo for companies without favicons
     */
    private function generatePlaceholderLogo(string $websiteUrl): string
    {
        $domain = parse_url($websiteUrl, PHP_URL_HOST);
        $firstLetter = strtoupper(substr($domain, 0, 1));
        
        // Create a simple SVG placeholder
        $svg = '<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" fill="#3B82F6" rx="8"/>
            <text x="32" y="40" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
                  text-anchor="middle" fill="white">' . $firstLetter . '</text>
        </svg>';
        
        // Generate filename
        $filename = 'client-logos/placeholder-' . Str::slug($domain) . '-' . time() . '.svg';
        
        // Store in S3
        Storage::disk('s3')->put($filename, $svg, 'public');
        
        return Storage::disk('s3')->url($filename);
    }
}
