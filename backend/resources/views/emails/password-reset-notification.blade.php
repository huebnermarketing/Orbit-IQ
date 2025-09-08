<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Notification - Orbit IQ</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .alert-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 1px solid #f59e0b;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            text-align: center;
        }
        .alert-icon {
            font-size: 48px;
            color: #f59e0b;
            margin-bottom: 15px;
        }
        .alert-title {
            font-size: 20px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 10px;
        }
        .alert-message {
            font-size: 16px;
            color: #92400e;
            margin: 0;
        }
        .info-section {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
        }
        .info-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        .info-title i {
            margin-right: 10px;
            color: #667eea;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-item:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #374151;
        }
        .info-value {
            color: #6b7280;
            font-family: 'Courier New', monospace;
        }
        .action-buttons {
            display: flex;
            gap: 15px;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        .btn {
            display: inline-block;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            transition: all 0.3s ease;
            flex: 1;
            min-width: 200px;
        }
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        .btn-secondary {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            color: #374151;
            border: 2px solid #d1d5db;
        }
        .btn-secondary:hover {
            background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
            transform: translateY(-2px);
        }
        .security-tips {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 1px solid #10b981;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        .security-tips h3 {
            color: #065f46;
            margin: 0 0 15px 0;
            font-size: 18px;
            display: flex;
            align-items: center;
        }
        .security-tips h3 i {
            margin-right: 10px;
        }
        .security-tips ul {
            margin: 0;
            padding-left: 20px;
            color: #065f46;
        }
        .security-tips li {
            margin-bottom: 8px;
        }
        .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 0 0 10px 0;
            color: #6b7280;
            font-size: 14px;
        }
        .footer .logo {
            font-size: 20px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 15px;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #6b7280;
            font-size: 20px;
            transition: color 0.3s ease;
        }
        .social-links a:hover {
            color: #667eea;
        }
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .action-buttons {
                flex-direction: column;
            }
            .btn {
                min-width: auto;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1><i class="fas fa-shield-alt"></i> Security Alert</h1>
            <p>Password Reset Notification</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Alert Box -->
            <div class="alert-box">
                <div class="alert-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="alert-title">Password Successfully Reset</div>
                <div class="alert-message">
                    Your password has been changed. If this wasn't you, please secure your account immediately.
                </div>
            </div>

            <!-- Account Information -->
            <div class="info-section">
                <div class="info-title">
                    <i class="fas fa-user-circle"></i>
                    Account Information
                </div>
                <div class="info-item">
                    <span class="info-label">Email Address:</span>
                    <span class="info-value">{{ $email }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Reset Time:</span>
                    <span class="info-value">{{ $resetTime }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">IP Address:</span>
                    <span class="info-value">{{ $ipAddress ?? 'Not available' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Device/Browser:</span>
                    <span class="info-value">{{ $userAgent ?? 'Not available' }}</span>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <a href="{{ $loginUrl }}" class="btn btn-primary">
                    <i class="fas fa-sign-in-alt"></i> Login to Account
                </a>
                <a href="{{ $resetPasswordUrl }}" class="btn btn-secondary">
                    <i class="fas fa-key"></i> Go to Login Page
                </a>
            </div>

            <!-- Security Tips -->
            <div class="security-tips">
                <h3>
                    <i class="fas fa-lock"></i>
                    Security Recommendations
                </h3>
                <ul>
                    <li><strong>If this was you:</strong> You can safely ignore this email.</li>
                    <li><strong>If this wasn't you:</strong> Your account may have been compromised. Please reset your password immediately using the "Forgot Password" option on the login page.</li>
                    <li>Use a strong, unique password that you haven't used elsewhere.</li>
                    <li>Enable two-factor authentication for added security.</li>
                    <li>Review your recent account activity for any suspicious behavior.</li>
                    <li>Contact our support team if you have any concerns.</li>
                </ul>
            </div>

            <!-- Additional Information -->
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #dc2626; margin: 0 0 10px 0; display: flex; align-items: center;">
                    <i class="fas fa-info-circle" style="margin-right: 8px;"></i>
                    Important Security Notice
                </h4>
                <p style="color: #dc2626; margin: 0; font-size: 14px;">
                    This email was sent to notify you of a password change on your account. If you did not request this password reset, 
                    please contact our support team immediately at <strong>support@orbitiq.com</strong> or call us at <strong>+1 (555) 123-4567</strong>.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="logo">
                <i class="fas fa-rocket"></i> Orbit IQ
            </div>
            <p>Project Management & Collaboration Platform</p>
            <p>This is an automated security notification. Please do not reply to this email.</p>
            
            <div class="social-links">
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-linkedin"></i></a>
                <a href="#"><i class="fab fa-github"></i></a>
            </div>
            
            <p style="font-size: 12px; color: #9ca3af;">
                © {{ date('Y') }} Orbit IQ. All rights reserved.<br>
                This email was sent to {{ $email }} because a password reset was performed on your account.
            </p>
        </div>
    </div>
</body>
</html>
