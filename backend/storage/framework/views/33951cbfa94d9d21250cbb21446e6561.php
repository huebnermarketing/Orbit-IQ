<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Orbit IQ</title>
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .tagline {
            font-size: 16px;
            opacity: 0.9;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 24px;
            color: #2d3748;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            transition: transform 0.2s ease;
        }
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
        }
        .reset-link {
            word-break: break-all;
            background-color: #f7fafc;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #2d3748;
            margin: 20px 0;
        }
        .security-note {
            background-color: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 6px;
            padding: 20px;
            margin: 30px 0;
        }
        .security-note h3 {
            color: #c53030;
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        .security-note p {
            color: #742a2a;
            margin: 0;
            font-size: 14px;
        }
        .footer {
            background-color: #2d3748;
            color: #a0aec0;
            padding: 30px;
            text-align: center;
        }
        .footer-logo {
            font-size: 20px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        .footer-text {
            font-size: 14px;
            margin: 5px 0;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            color: #a0aec0;
            text-decoration: none;
            margin: 0 10px;
            font-size: 14px;
        }
        .social-links a:hover {
            color: #667eea;
        }
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
            margin: 30px 0;
        }
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                box-shadow: none;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .logo {
                font-size: 24px;
            }
            .greeting {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo"><i class="fas fa-rocket"></i> Orbit IQ</div>
            <p class="tagline">Intelligent Project Management Platform</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <h1 class="greeting">Hello!</h1>
            
            <p class="message">
                We received a request to reset the password for your Orbit IQ account. 
                If you made this request, click the button below to reset your password.
            </p>

            <div style="text-align: center;">
                <a href="<?php echo e($resetUrl); ?>" class="reset-button">
                    <i class="fas fa-lock"></i> Reset My Password
                </a>
            </div>

            <div class="divider"></div>

            <p class="message">
                If the button doesn't work, you can copy and paste this link into your browser:
            </p>

            <div class="reset-link">
                <?php echo e($resetUrl); ?>

            </div>

            <div class="security-note">
                <h3><i class="fas fa-shield-alt"></i> Security Notice</h3>
                <p>
                    This password reset link will expire in <strong>1 hour</strong> for your security. 
                    If you didn't request this password reset, please ignore this email and your password will remain unchanged.
                </p>
            </div>

            <p class="message">
                If you continue to have problems, please contact our support team.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-logo">Orbit IQ</div>
            <p class="footer-text">Intelligent Project Management Platform</p>
            <p class="footer-text">© <?php echo e(date('Y')); ?> Orbit IQ. All rights reserved.</p>
            
            <div class="social-links">
                <a href="#">Support</a>
                <a href="#">Documentation</a>
                <a href="#">Privacy Policy</a>
            </div>
        </div>
    </div>
</body>
</html>
<?php /**PATH /Users/tarang/Documents/Projects/Orbit IQ/backend/resources/views/emails/password-reset.blade.php ENDPATH**/ ?>