<?php

namespace App\Jobs;

use App\Models\ClientPerson;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendClientInvitationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $clientPerson;
    protected $token;

    /**
     * Create a new job instance.
     */
    public function __construct(ClientPerson $clientPerson, string $token)
    {
        $this->clientPerson = $clientPerson;
        $this->token = $token;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Load the client relationship
            $this->clientPerson->load('client');
            
            // Generate the setup URL
            $setupUrl = config('app.frontend_url') . '/client/setup-password?token=' . $this->token . '&email=' . urlencode($this->clientPerson->email);
            
            // Send the email
            Mail::send('emails.client-invitation', [
                'clientPerson' => $this->clientPerson,
                'setupUrl' => $setupUrl,
            ], function ($message) {
                $message->to($this->clientPerson->email, $this->clientPerson->name)
                        ->subject('Welcome to ' . $this->clientPerson->client->company_name . ' - Set Up Your Orbit IQ Account');
            });

            Log::info('Client invitation email sent successfully', [
                'client_person_id' => $this->clientPerson->id,
                'email' => $this->clientPerson->email,
                'client_company' => $this->clientPerson->client->company_name
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send client invitation email', [
                'client_person_id' => $this->clientPerson->id,
                'email' => $this->clientPerson->email,
                'error' => $e->getMessage()
            ]);
            
            // Re-throw the exception to mark the job as failed
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('SendClientInvitationJob failed', [
            'client_person_id' => $this->clientPerson->id,
            'email' => $this->clientPerson->email,
            'error' => $exception->getMessage()
        ]);
    }
}