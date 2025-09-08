<?php

namespace App\Jobs;

use App\Mail\PasswordResetNotificationMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendPasswordResetNotification implements ShouldQueue
{
    use Queueable;

    public $email;
    public $ipAddress;
    public $userAgent;

    /**
     * Create a new job instance.
     */
    public function __construct($email, $ipAddress = null, $userAgent = null)
    {
        $this->email = $email;
        $this->ipAddress = $ipAddress;
        $this->userAgent = $userAgent;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->email)->send(
            new PasswordResetNotificationMail($this->email, $this->ipAddress, $this->userAgent)
        );
    }
}
