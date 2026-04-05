import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Ticket from './models/Ticket.js';
import Message from './models/Message.js';
import KnowledgeBase from './models/KnowledgeBase.js';
import connectDB from './config/db.js';

dotenv.config();

const seedUsers = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Ticket.deleteMany({});
        await Message.deleteMany({});
        await KnowledgeBase.deleteMany({});

        const usersData = [
            {
                name: 'Admin User',
                email: 'admin@deskora.com',
                password: 'password123',
                role: 'Admin',
                gender: 'Other',
                location: 'Remote',
                bio: 'Account Administrator'
            },
            {
                name: 'Billing Agent',
                email: 'billing@deskora.com',
                password: 'password123',
                role: 'Agent',
                assignedCategory: 'billing',
                gender: 'Female',
                location: 'New York',
                bio: 'Specialist in billing and payments'
            },
            {
                name: 'Tech Agent',
                email: 'tech@deskora.com',
                password: 'password123',
                role: 'Agent',
                assignedCategory: 'technical',
                gender: 'Male',
                location: 'San Francisco',
                bio: 'Technical support specialist'
            },
            {
                name: 'General Agent',
                email: 'general@deskora.com',
                password: 'password123',
                role: 'Agent',
                assignedCategory: 'general',
                gender: 'Non-binary',
                location: 'Austin',
                bio: 'General inquiries specialist'
            },
            {
                name: 'Test Customer',
                email: 'user@example.com',
                password: 'password123',
                role: 'User',
                gender: 'Male',
                location: 'London',
                bio: 'Regular customer'
            },
            {
                name: 'Sarah Miller',
                email: 'sarah@example.com',
                password: 'password123',
                role: 'User',
                gender: 'Female',
                location: 'Berlin',
                bio: 'Power user and developer'
            },
            {
                name: 'David Chen',
                email: 'david@example.com',
                password: 'password123',
                role: 'User',
                gender: 'Male',
                location: 'Tokyo',
                bio: 'Small business owner'
            },
            {
                name: 'Deskora Bot',
                email: 'bot@deskora.com',
                password: 'password123',
                role: 'Agent',
                assignedCategory: 'general',
                gender: 'Robot',
                location: 'Cloud',
                bio: 'Official Deskora Platform Assistant'
            }
        ];

        const createdUsers = await User.create(usersData);
        console.log('Users Seeded Successfully!');

        const customer = createdUsers.find(u => u.email === 'user@example.com');
        const sarah = createdUsers.find(u => u.email === 'sarah@example.com');
        const david = createdUsers.find(u => u.email === 'david@example.com');
        const admin = createdUsers.find(u => u.role === 'Admin');
        const billingAgent = createdUsers.find(u => u.assignedCategory === 'billing');
        const techAgent = createdUsers.find(u => u.assignedCategory === 'technical');
        const generalAgent = createdUsers.find(u => u.assignedCategory === 'general');

        // Sample Tickets for Customer
        const ticketsData = [
            { title: "Double charge on my last invoice", category: "billing", priority: "high", status: "open", assignedTo: billingAgent._id, user: customer._id },
            { title: "Cannot log in with Google OAuth", category: "technical", priority: "medium", status: "in-progress", assignedTo: techAgent._id, user: customer._id },
            { title: "How to export usage reports?", category: "general", priority: "low", status: "resolved", assignedTo: generalAgent._id, user: customer._id },
            { title: "Requesting refund for unused days", category: "billing", priority: "medium", status: "open", assignedTo: billingAgent._id, user: customer._id },
            { title: "API returns 500 error on /users", category: "technical", priority: "high", status: "open", assignedTo: techAgent._id, user: customer._id },
            // Sarah's tickets
            { title: "React SDK keeps crashing on init", category: "technical", priority: "high", status: "open", assignedTo: techAgent._id, user: sarah._id },
            { title: "Bulk discount query for 50+ seats", category: "billing", priority: "medium", status: "in-progress", assignedTo: billingAgent._id, user: sarah._id },
            { title: "Dashboard theme customization help", category: "general", priority: "low", status: "open", assignedTo: generalAgent._id, user: sarah._id },
            // David's tickets
            { title: "Missing payment confirmation email", category: "billing", priority: "high", status: "resolved", assignedTo: billingAgent._id, user: david._id },
            { title: "Cannot see agent workload in mobile", category: "technical", priority: "medium", status: "open", assignedTo: techAgent._id, user: david._id },
            { title: "Feature request: Discord integration", category: "general", priority: "low", status: "open", assignedTo: generalAgent._id, user: david._id },
        ];

        await Ticket.insertMany(ticketsData);
        
        // Create 10 tickets for the Admin too
        const adminTickets = [
            { title: "Admin: Database cleanup request", category: "technical", priority: "high", status: "open", assignedTo: techAgent._id },
            { title: "Admin: Monthly stats report", category: "general", priority: "medium", status: "resolved", assignedTo: generalAgent._id },
            { title: "Admin: Billing system audit", category: "billing", priority: "medium", status: "in-progress", assignedTo: billingAgent._id },
            { title: "Admin: Server latency in AWS", category: "technical", priority: "high", status: "open", assignedTo: techAgent._id },
            { title: "Admin: New agent onboarding", category: "general", priority: "low", status: "open", assignedTo: generalAgent._id },
        ];
        
        await Ticket.insertMany(adminTickets.map(t => ({ ...t, user: admin._id })));

        const allTickets = await Ticket.find({});
        const messages = [];

        for (const ticket of allTickets) {
            // Initial message from user
            messages.push({
                ticket: ticket._id,
                sender: ticket.user,
                content: `Hi, I have a ${ticket.priority} priority issue regarding: ${ticket.title}. Is there any update?`,
                isAI: false
            });

            if (ticket.status === 'in-progress' || ticket.status === 'resolved') {
                // Agent response
                messages.push({
                    ticket: ticket._id,
                    sender: ticket.assignedTo,
                    content: `Hello! I am your assigned ${ticket.category} specialist. I have received your request for "${ticket.title}" and I am investigating.`,
                    isAI: false
                });

                // User follow up
                messages.push({
                    ticket: ticket._id,
                    sender: ticket.user,
                    content: `Thanks for the quick response! Looking forward to the fix.`,
                    isAI: false
                });
            }

            if (ticket.status === 'resolved') {
                // Resolution message
                messages.push({
                    ticket: ticket._id,
                    sender: ticket.assignedTo,
                    content: `The issue has been successfully resolved. We have updated our records for: ${ticket.title}. Is there anything else I can assist with?`,
                    isAI: false
                });
            }
        }

        await Message.insertMany(messages);
        console.log('Sample conversation messages added to all tickets!');

        const kbArticles = [
            {
                title: "How to create your first ticket",
                content: "To create a ticket, navigate to your dashboard and look for the 'New Ticket' button. Fill in the title, select a priority, and our AI will automatically classify it for the right agent.",
                category: "Getting Started",
                tags: ["tutorial", "basic"],
                viewCount: 150
            },
            {
                title: "Understanding Ticket Statuses",
                content: "Open: The ticket has been created. In-Progress: An agent is currently working on it. Resolved: The issue has been fixed. Closed: No further action needed.",
                category: "General",
                tags: ["status", "workflow"],
                viewCount: 85
            },
            {
                title: "How to reset your password",
                content: "Go to the profile page, click on 'Security Settings', and follow the prompts to change your password. Ensure your new password is at least 8 characters long.",
                category: "Technical",
                tags: ["security", "password"],
                viewCount: 42
            },
            {
                title: "Billing Cycles and Invoices",
                content: "Our platform bills monthly on the 1st of every month. You can download your invoices from the 'Billing' tab in your Profile settings.",
                category: "Billing",
                tags: ["payment", "invoice"],
                viewCount: 65
            },
            {
                title: "Using the AI Chatbot Assistant",
                content: "The Deskora Bot is available 24/7. It can help you with platform-related queries using our built-in knowledge base. For specific technical issues, we recommend creating a ticket.",
                category: "Getting Started",
                tags: ["ai", "bot"],
                viewCount: 210
            },
            {
                title: "Setting up Email Notifications",
                content: "To stay updated on your tickets, ensure 'Email Notifications' are enabled in your settings. You can choose to receive alerts for new message responses, status changes, and assigned tickets.",
                category: "Technical",
                tags: ["email", "notifications"],
                viewCount: 45
            },
            {
                title: "Managing Agent Workload",
                content: "Admins can monitor agent workload from the Dashboard. We use AI to track active vs. resolved tickets to ensure balanced ticket assignment across the support team.",
                category: "General",
                tags: ["management", "dashboard"],
                viewCount: 32
            },
            {
                title: "Refund Policy and Processing",
                content: "Refunds for Deskora subscriptions are processed within 5-7 business days of approval. To request a refund, please create a ticket in the 'Billing' category.",
                category: "Billing",
                tags: ["refund", "money", "billing"],
                viewCount: 88
            },
            {
                title: "Advanced Search and Filtering Tips",
                content: "Use the search bar in your Ticket List to filter by user name, ticket title, or category. You can also click on the sentiment dots to quickly find urgent tickets.",
                category: "General",
                tags: ["search", "filter", "tips"],
                viewCount: 120
            },
            {
                title: "Slack Integration Setup Guide",
                content: "Connect Deskora to your Slack workspace to receive real-time alerts. Navigate to Integrations > Slack, and follow the OAuth flow to authorize the connection.",
                category: "Technical",
                tags: ["slack", "integration", "app"],
                viewCount: 25
            },
            {
                title: "Customizing your Profile",
                content: "Personalize your Deskora account by updating your bio, location, and gender settings on the Profile page. You can also toggle between Light and Dark mode using the sun/moon icon in the Navbar.",
                category: "Getting Started",
                tags: ["profile", "settings", "theme"],
                viewCount: 72
            },
            {
                title: "Desktop vs Mobile Web App",
                content: "Deskora is fully responsive. On desktops, use the multi-column view for agent productivity. On mobile, use our touch-optimized interface for managing tickets on the go.",
                category: "Getting Started",
                tags: ["mobile", "responsive", "desktop"],
                viewCount: 45
            },
            {
                title: "Browser Compatibility Guide",
                content: "We officially support Chrome, Firefox, Safari, and Edge. For the best experience, including real-time notifications, we recommend using the latest stable version of Google Chrome.",
                category: "Technical",
                tags: ["browser", "compatibility", "chrome"],
                viewCount: 38
            },
            {
                title: "How to Clear Cache and Cookies",
                content: "If you're experiencing UI glitches or login issues, clearing your browser's cache and cookies often fixes temporary local storage conflicts. Go to History > Clear Browsing Data.",
                category: "Technical",
                tags: ["troubleshoot", "cache", "cookies"],
                viewCount: 91
            },
            {
                title: "API Authentication with Bearer Tokens",
                content: "Securely connect your apps using Deskora API Bearer Tokens. Head to Developer Settings to generate a new key and include it in your HTTP Authorization headers.",
                category: "Technical",
                tags: ["api", "dev", "security"],
                viewCount: 19
            },
            {
                title: "Setting up Webhook Integrations",
                content: "Automate your workflows by configuring Deskora Webhooks. Receive POST requests at your endpoint whenever a new ticket is created or an existing one is resolved.",
                category: "Technical",
                tags: ["webhooks", "automation", "api"],
                viewCount: 15
            },
            {
                title: "Troubleshooting Login Errors",
                content: "Common login errors are usually due to incorrect credentials or expired sessions. If you've forgotten your password, use the 'Forgot Password' link to reset it.",
                category: "Technical",
                tags: ["login", "error", "auth"],
                viewCount: 54
            },
            {
                title: "Changing your Subscription Plan",
                content: "Admins can upgrade or downgrade their platform plan directly from the Billing tab. Changes are applied immediately and reflected in your next monthly invoice.",
                category: "Billing",
                tags: ["subscription", "upgrade", "plan"],
                viewCount: 63
            },
            {
                title: "Multiple Payment Methods",
                content: "You can add multiple credit cards or PayPal accounts to your Deskora organization. Our system will automatically charge your primary method on each billing cycle.",
                category: "Billing",
                tags: ["payment", "billing", "card"],
                viewCount: 41
            },
            {
                title: "Viewing and Downloading Invoices",
                content: "Access your full payment history on the Billing page. All invoices are available for download in PDF format for your accounting records.",
                category: "Billing",
                tags: ["invoice", "history", "download"],
                viewCount: 77
            },
            {
                title: "Support Operating Hours",
                content: "Our AI Assistant is online 24/7. Human support agents are available Monday through Friday, 9:00 AM to 6:00 PM EST, excluding major holidays.",
                category: "General",
                tags: ["support", "hours", "human"],
                viewCount: 110
            },
            {
                title: "Platform Security Best Practices",
                content: "Protect your account by enabling Two-Factor Authentication (2FA) and using a unique, strong password. Never share your credentials with anyone.",
                category: "General",
                tags: ["security", "2fa", "privacy"],
                viewCount: 55
            },
            {
                title: "Understanding User Roles",
                content: "Admin: Full control over settings and agents. Agent: Handles assigned tickets and customer queries. User: Standard customer access for creating tickets.",
                category: "General",
                tags: ["roles", "access", "permissions"],
                viewCount: 89
            },
            {
                title: "Data Privacy and GDPR Compliance",
                content: "Deskora is fully GDPR compliant. We value your privacy and ensure all customer data is encrypted at rest and in transit using industry-standard protocols.",
                category: "General",
                tags: ["privacy", "gdpr", "legal"],
                viewCount: 30
            }
        ];

        await KnowledgeBase.insertMany(kbArticles);
        console.log('Knowledge Base fully expanded with 15+ more articles!');

        console.log('Full Seed Complete: Users, Tickets, Messages, and Knowledge Base are ready.');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding: ${error.message}`);
        process.exit(1);
    }
};

seedUsers();
