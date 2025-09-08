<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Orbit IQ - Project Management System</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800&display=swap" rel="stylesheet" />

        <!-- Styles -->
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #0F7173 0%, #4D6CFA 50%, #0B5563 100%);
                background-size: 400% 400%;
                animation: gradientShift 15s ease infinite;
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                position: relative;
            }

            /* Animated Background Elements */
            .bg-elements {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            }

            .floating-shape {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                animation: float 20s infinite linear;
            }

            .shape-1 {
                width: 80px;
                height: 80px;
                top: 20%;
                left: 10%;
                animation-delay: 0s;
            }

            .shape-2 {
                width: 120px;
                height: 120px;
                top: 60%;
                right: 15%;
                animation-delay: -5s;
            }

            .shape-3 {
                width: 60px;
                height: 60px;
                bottom: 30%;
                left: 20%;
                animation-delay: -10s;
            }

            .shape-4 {
                width: 100px;
                height: 100px;
                top: 10%;
                right: 30%;
                animation-delay: -15s;
            }

            /* Particle System */
            .particles {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 2;
            }

            .particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                animation: particleFloat 25s infinite linear;
            }

            .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
            .particle:nth-child(2) { left: 20%; animation-delay: -2s; }
            .particle:nth-child(3) { left: 30%; animation-delay: -4s; }
            .particle:nth-child(4) { left: 40%; animation-delay: -6s; }
            .particle:nth-child(5) { left: 50%; animation-delay: -8s; }
            .particle:nth-child(6) { left: 60%; animation-delay: -10s; }
            .particle:nth-child(7) { left: 70%; animation-delay: -12s; }
            .particle:nth-child(8) { left: 80%; animation-delay: -14s; }
            .particle:nth-child(9) { left: 90%; animation-delay: -16s; }

            .container {
                text-align: center;
                color: white;
                max-width: 900px;
                padding: 2rem;
                position: relative;
                z-index: 10;
                animation: fadeInUp 1s ease-out;
            }

            .logo {
                font-size: 3.5rem;
                font-weight: 800;
                margin-bottom: 0.5rem;
                background: linear-gradient(45deg, #ffffff, #f0fdfa, #ffffff);
                background-size: 200% 200%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: textShimmer 3s ease-in-out infinite;
                text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
            }

            .subtitle {
                font-size: 1.2rem;
                margin-bottom: 2rem;
                opacity: 0.9;
                font-weight: 300;
                letter-spacing: 0.5px;
                animation: fadeInUp 1s ease-out 0.3s both;
            }

            .status {
                background: rgba(255, 255, 255, 0.15);
                padding: 1.8rem;
                border-radius: 16px;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                position: relative;
                overflow: hidden;
                animation: fadeInUp 1s ease-out 0.6s both;
                transition: all 0.3s ease;
            }

            .status:hover {
                transform: translateY(-5px);
                box-shadow: 0 35px 70px rgba(0, 0, 0, 0.3);
                border-color: rgba(255, 255, 255, 0.3);
            }

            .status::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                animation: shimmer 3s infinite;
            }

            .status-title {
                font-size: 1.6rem;
                margin-bottom: 1rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.8rem;
            }

            .rocket {
                font-size: 2rem;
                animation: rocketBounce 2s ease-in-out infinite;
            }

            .status-text {
                font-size: 1rem;
                margin-bottom: 1.5rem;
                opacity: 0.9;
                line-height: 1.5;
            }

            .api-endpoint {
                background: rgba(0, 0, 0, 0.2);
                padding: 0.8rem 1.2rem;
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 0.85rem;
                word-break: break-all;
                position: relative;
                overflow: hidden;
            }

            .api-endpoint::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                animation: codeShimmer 4s infinite;
            }

            .status-indicator {
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                margin-top: 1rem;
                padding: 0.6rem 1.2rem;
                background: rgba(34, 197, 94, 0.2);
                border: 1px solid rgba(34, 197, 94, 0.3);
                border-radius: 50px;
                font-size: 0.85rem;
                font-weight: 500;
            }

            .status-dot {
                width: 8px;
                height: 8px;
                background: #22c55e;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }

            /* Services Status Section */
            .services-section {
                margin-top: 2rem;
                animation: fadeInUp 1s ease-out 0.9s both;
            }

            .services-title {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 1.5rem;
                text-align: center;
                background: linear-gradient(45deg, #ffffff, #f0fdfa);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .services-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }

            .service-card {
                background: rgba(255, 255, 255, 0.1);
                padding: 1.2rem;
                border-radius: 12px;
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .service-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
                border-color: rgba(255, 255, 255, 0.25);
            }

            .service-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
                animation: cardShimmer 4s infinite;
            }

            .service-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 0.8rem;
            }

            .service-info {
                display: flex;
                align-items: center;
                gap: 0.6rem;
            }

            .service-icon {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
            }

            .service-icon.api { background: rgba(79, 172, 254, 0.2); }
            .service-icon.email { background: rgba(34, 197, 94, 0.2); }
            .service-icon.job { background: rgba(251, 146, 60, 0.2); }
            .service-icon.database { background: rgba(168, 85, 247, 0.2); }
            .service-icon.frontend { background: rgba(236, 72, 153, 0.2); }
            .service-icon.cache { background: rgba(59, 130, 246, 0.2); }

            .service-name {
                font-weight: 600;
                font-size: 0.9rem;
            }

            .service-status {
                display: flex;
                align-items: center;
                gap: 0.4rem;
                padding: 0.3rem 0.6rem;
                border-radius: 16px;
                font-size: 0.75rem;
                font-weight: 500;
            }

            .service-status.operational {
                background: rgba(34, 197, 94, 0.2);
                border: 1px solid rgba(34, 197, 94, 0.3);
                color: #22c55e;
            }

            .service-status.degraded {
                background: rgba(251, 146, 60, 0.2);
                border: 1px solid rgba(251, 146, 60, 0.3);
                color: #fb923c;
            }

            .service-status.down {
                background: rgba(239, 68, 68, 0.2);
                border: 1px solid rgba(239, 68, 68, 0.3);
                color: #ef4444;
            }

            .service-status-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                animation: servicePulse 2s infinite;
            }

            .service-status-dot.operational { background: #22c55e; }
            .service-status-dot.degraded { background: #fb923c; }
            .service-status-dot.down { background: #ef4444; }

            .service-details {
                font-size: 0.8rem;
                opacity: 0.8;
                line-height: 1.3;
                margin-bottom: 0.4rem;
            }

            .service-response-time {
                font-size: 0.7rem;
                opacity: 0.7;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            }

            /* Animations */
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                25% { transform: translateY(-20px) rotate(90deg); }
                50% { transform: translateY(-40px) rotate(180deg); }
                75% { transform: translateY(-20px) rotate(270deg); }
            }

            @keyframes particleFloat {
                0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100px) translateX(100px); opacity: 0; }
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes textShimmer {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }

            @keyframes rocketBounce {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }

            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            @keyframes codeShimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
            }

            @keyframes cardShimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            @keyframes servicePulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.2); }
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .container {
                    padding: 2rem 1rem;
                }
                
                .logo {
                    font-size: 3rem;
                }
                
                .subtitle {
                    font-size: 1.2rem;
                }
                
                .status {
                    padding: 2rem 1.5rem;
                }
                
                .status-title {
                    font-size: 1.5rem;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .services-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }

                .service-card {
                    padding: 1.2rem;
                }

                .services-title {
                    font-size: 1.5rem;
                }
            }
        </style>
    </head>
    <body>
        <!-- Animated Background Elements -->
        <div class="bg-elements">
            <div class="floating-shape shape-1"></div>
            <div class="floating-shape shape-2"></div>
            <div class="floating-shape shape-3"></div>
            <div class="floating-shape shape-4"></div>
        </div>

        <!-- Particle System -->
        <div class="particles">
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
        </div>

        <div class="container">
            <h1 class="logo">Orbit IQ</h1>
            <p class="subtitle">Project Management System</p>
            
            <div class="status">
                <h2 class="status-title">
                    <span class="rocket">🚀</span>
                    Backend API is Running!
                </h2>
                <p class="status-text">
                    Laravel backend is successfully configured and ready to serve your project management needs. 
                    The API is fully operational and waiting for your requests.
                </p>
                <div class="api-endpoint">
                    <strong>API Endpoint:</strong> <?php echo e(url('/api')); ?>

                </div>
                <div class="status-indicator">
                    <div class="status-dot"></div>
                    <span>All systems operational</span>
                </div>
            </div>

            <!-- Services Status Section -->
            <div class="services-section">
                <h3 class="services-title">System Services Status</h3>
                <div class="services-grid">
                    <!-- API Layer -->
                    <div class="service-card">
                        <div class="service-header">
                            <div class="service-info">
                                <div class="service-icon api">🔌</div>
                                <div class="service-name">API Layer</div>
                            </div>
                            <div class="service-status operational">
                                <div class="service-status-dot operational"></div>
                                <span>Operational</span>
                            </div>
                        </div>
                        <div class="service-details">
                            Laravel API endpoints are responding normally. All routes are accessible and functioning correctly.
                        </div>
                        <div class="service-response-time">Response time: ~15ms</div>
                    </div>

                    <!-- Database -->
                    <div class="service-card">
                        <div class="service-header">
                            <div class="service-info">
                                <div class="service-icon database">🗄️</div>
                                <div class="service-name">Database</div>
                            </div>
                            <div class="service-status operational">
                                <div class="service-status-dot operational"></div>
                                <span>Operational</span>
                            </div>
                        </div>
                        <div class="service-details">
                            Database connection is stable. All queries are executing within normal parameters.
                        </div>
                        <div class="service-response-time">Connection: Active</div>
                    </div>

                    <!-- Email Service -->
                    <div class="service-card">
                        <div class="service-header">
                            <div class="service-info">
                                <div class="service-icon email">📧</div>
                                <div class="service-name">Email Service</div>
                            </div>
                            <div class="service-status operational">
                                <div class="service-status-dot operational"></div>
                                <span>Operational</span>
                            </div>
                        </div>
                        <div class="service-details">
                            Email delivery system is functioning properly. SMTP configuration is active.
                        </div>
                        <div class="service-response-time">Delivery: Normal</div>
                    </div>

                    <!-- Job Queue -->
                    <div class="service-card">
                        <div class="service-header">
                            <div class="service-info">
                                <div class="service-icon job">⚡</div>
                                <div class="service-name">Job Queue</div>
                            </div>
                            <div class="service-status operational">
                                <div class="service-status-dot operational"></div>
                                <span>Operational</span>
                            </div>
                        </div>
                        <div class="service-details">
                            Background job processing is running smoothly. Queue workers are active.
                        </div>
                        <div class="service-response-time">Queue: Processing</div>
                    </div>

                    <!-- Frontend Application -->
                    <div class="service-card">
                        <div class="service-header">
                            <div class="service-info">
                                <div class="service-icon frontend">🎨</div>
                                <div class="service-name">Frontend App</div>
                            </div>
                            <div class="service-status operational">
                                <div class="service-status-dot operational"></div>
                                <span>Operational</span>
                            </div>
                        </div>
                        <div class="service-details">
                            Vue.js frontend application is deployed and accessible. All components are loading correctly.
                        </div>
                        <div class="service-response-time">Load time: ~2.1s</div>
                    </div>

                    <!-- Cache System -->
                    <div class="service-card">
                        <div class="service-header">
                            <div class="service-info">
                                <div class="service-icon cache">💾</div>
                                <div class="service-name">Cache System</div>
                            </div>
                            <div class="service-status operational">
                                <div class="service-status-dot operational"></div>
                                <span>Operational</span>
                            </div>
                        </div>
                        <div class="service-details">
                            Redis cache is functioning optimally. Cache hit rate is within expected parameters.
                        </div>
                        <div class="service-response-time">Hit rate: 94.2%</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
<?php /**PATH /Users/tarang/Documents/Projects/Orbit IQ/backend/resources/views/welcome.blade.php ENDPATH**/ ?>