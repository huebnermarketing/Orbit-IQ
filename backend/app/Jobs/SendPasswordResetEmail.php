<?php

namespace App\Jobs;

use App\Mail\PasswordResetMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable as BusQueueable;

class SendPasswordResetEmail implements ShouldQueue
{
    use BusQueueable, InteractsWithQueue, Queueable, SerializesModels;

    public $email;
    public $resetToken;

    /**
     * Create a new job instance.
     */
    public function __construct(string $email, string $resetToken)
    {
        $this->email = $email;
        $this->resetToken = $resetToken;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $resetUrl = env('FRONTEND_URL', 'http://localhost:3000') . '/reset-password?token=' . $this->resetToken . '&email=' . urlencode($this->email);

        Mail::to($this->email)->send(new PasswordResetMail($this->email, $resetUrl));
    }
}
