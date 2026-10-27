<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ProxyController extends Controller
{
    public function execute(Request $request)
    {
        $validated = $request->validate([
            'method' => 'required|string|in:get,post,put,delete,patch,GET,POST,PUT,DELETE,PATCH',
            'url' => 'required|string',
            'headers' => 'array',
            'body' => 'nullable',
            'type' => 'nullable|string|in:json,text',
        ]);

        $method = strtolower($validated['method']);
        $url = $validated['url'];
        $type = $validated['type'] ?? 'text';
        $body = $validated['body'] ?? '';
        if (is_array($body)) {
            $body = json_encode($body);
        }
        if (!is_string($body)) {
            $body = (string) $body;
        }

        if (!$this->isAllowedUrl($url)) {
            return response()->json([
                'statusCode' => 403,
                'body' => json_encode(['error' => 'Blocked URL: internal/private addresses are not allowed.']),
            ], 403);
        }

        $headers = [];
        foreach ($validated['headers'] ?? [] as $header) {
            if (is_array($header) && count($header) >= 2) {
                $key = trim((string) $header[0]);
                $value = (string) $header[1];
                if ($key !== '') {
                    $headers[$key] = $value;
                }
            }
        }

        $contentType = $type === 'json' ? 'application/json' : 'text/plain';
        if (isset($headers['Content-Type'])) {
            $contentType = $headers['Content-Type'];
        } elseif (isset($headers['content-type'])) {
            $contentType = $headers['content-type'];
        }

        if (!isset($headers['Accept']) && !isset($headers['accept'])) {
            $headers['Accept'] = 'application/json';
        }

        try {
            $http = Http::withHeaders($headers)
                ->withBody($body, $contentType)
                ->withoutRedirecting()
                ->timeout(30);

            if (app()->environment('local')) {
                $http = $http->withoutVerifying();
            }

            $response = $http->send(strtoupper($method), $url);
        } catch (\Throwable $e) {
            return response()->json([
                'statusCode' => 0,
                'body' => json_encode(['error' => $e->getMessage()]),
            ], 502);
        }

        $responseBody = $response->body();

        return response()->json([
            'statusCode' => $response->status(),
            'body' => $responseBody,
        ]);
    }

    private function isAllowedUrl(string $url): bool
    {
        $parts = parse_url($url);
        if (!is_array($parts)) {
            return false;
        }

        $scheme = strtolower($parts['scheme'] ?? '');
        if (!in_array($scheme, ['http', 'https'], true)) {
            return false;
        }

        $host = $parts['host'] ?? '';
        if ($host === '') {
            return false;
        }

        $hostLower = strtolower($host);

        // Block obvious local hostnames.
        $blockedHosts = ['localhost', '127.0.0.1', '::1', '0.0.0.0', 'host.docker.internal'];
        if (in_array($hostLower, $blockedHosts, true)) {
            return false;
        }
        if (str_ends_with($hostLower, '.localhost') || str_ends_with($hostLower, '.local') || str_ends_with($hostLower, '.internal')) {
            return false;
        }

        // Block if host is an IP in private/reserved ranges.
        $ips = [];
        if (filter_var($host, FILTER_VALIDATE_IP)) {
            $ips[] = $host;
        } else {
            $resolved = @gethostbynamel($host);
            if (is_array($resolved)) {
                $ips = array_merge($ips, $resolved);
            }
            // IPv6 resolution
            $records = @dns_get_record($host, DNS_AAAA);
            if (is_array($records)) {
                foreach ($records as $record) {
                    if (isset($record['ipv6'])) {
                        $ips[] = $record['ipv6'];
                    }
                }
            }
            if (empty($ips)) {
                // Could not resolve; attempt gethostbyname
                $single = @gethostbyname($host);
                if ($single !== $host) {
                    $ips[] = $single;
                }
            }
        }

        if (empty($ips)) {
            // Fail closed: unable to resolve host.
            return false;
        }

        foreach ($ips as $ip) {
            if (!$this->isPublicIp($ip)) {
                return false;
            }
        }

        return true;
    }

    private function isPublicIp(string $ip): bool
    {
        if (!filter_var($ip, FILTER_VALIDATE_IP)) {
            return false;
        }

        // FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE returns the IP if public.
        $public = filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);

        return $public !== false;
    }
}
