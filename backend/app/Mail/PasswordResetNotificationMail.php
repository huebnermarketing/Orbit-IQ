<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $email;
    public $resetTime;
    public $ipAddress;
    public $userAgent;
    public $loginUrl;
    public $resetPasswordUrl;

    /**
     * Create a new message instance.
     */
    public function __construct($email, $ipAddress = null, $userAgent = null)
    {
        $this->email = $email;
        $this->resetTime = now()->format('F j, Y \a\t g:i A T');
        $this->ipAddress = $ipAddress;
        $this->userAgent = $userAgent;
        $this->loginUrl = config('app.frontend_url') . '/login';
        $this->resetPasswordUrl = config('app.frontend_url') . '/login';
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🔐 Password Reset Notification - Orbit IQ',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.password-reset-notification',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
