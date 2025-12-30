#!/bin/bash

echo "🚀 Starting FAST deployment..."
rm -rf arex-fast 2>/dev/null
mkdir arex-fast && cd arex-fast

# Create minimal files
echo "📁 Creating core files..."

# 1. Create only essential files
cat > package.json << 'EOF'
{
  "name": "arex-fast",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "tailwindcss": "^3.3.0"
  }
}
EOF

# 2. Minimal next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
module.exports = nextConfig
EOF

# 3. Single page with the logic
mkdir -p app
cat > app/page.tsx << 'EOF'
'use client'
import { useState } from 'react'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [plan, setPlan] = useState<'trial' | 'gold' | 'platinum' | 'diamond'>('trial')

  // Simulate signup with 100 free leads
  const handleSignup = () => {
    const newUser = {
      id: 'user_' + Date.now(),
      plan: 'trial',
      trialLeadsTotal: 100,
      trialLeadsUsed: 0,
      trialLeadsRemaining: 100,
      bonusMultiplier: 2
    }
    setUser(newUser)
    setPlan('trial')
  }

  // Simulate upgrade (ends trial immediately)
  const handleUpgrade = (newPlan: 'gold' | 'platinum' | 'diamond') => {
    const updatedUser = {
      ...user,
      plan: newPlan,
      // CRITICAL: Trial features removed
      trialLeadsRemaining: undefined,
      bonusMultiplier: undefined,
      // Paid plan features
      paidFeatures: getPlanFeatures(newPlan)
    }
    setUser(updatedUser)
    setPlan(newPlan)
  }

  const getPlanFeatures = (plan: string) => {
    const plans: any = {
      gold: ['5,000 leads/month', 'WhatsApp Channels', 'Email Support'],
      platinum: ['50,000 leads', '24/7 Support', 'ROI Dashboard'],
      diamond: ['Unlimited leads', 'AI Intelligence', 'Dedicated Manager']
    }
    return plans[plan] || []
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Arex.co.ke Plan System</h1>
      
      {!user ? (
        <div className="max-w-md mx-auto">
          <button
            onClick={handleSignup}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg"
          >
            Sign Up for 100 Free Leads
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Dashboard Header */}
          <div className={`p-4 rounded-lg mb-6 ${
            plan === 'trial' ? 'bg-green-100 text-green-800' : 
            plan === 'gold' ? 'bg-yellow-100 text-yellow-800' :
            plan === 'platinum' ? 'bg-gray-100 text-gray-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            <div className="font-bold text-lg">
              {plan === 'trial' ? 'Trial Dashboard • 100 Free Leads Active' :
               plan === 'gold' ? 'Gold Plan • Paid Account' :
               plan === 'platinum' ? 'Platinum Plan • Paid Account' :
               'Diamond Plan • Paid Account'}
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Panel */}
            <div className="md:col-span-2">
              {plan === 'trial' ? (
                // TRIAL DASHBOARD
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Your Trial Status</h2>
                  <div className="mb-6">
                    <div className="text-3xl font-bold">{user.trialLeadsRemaining}</div>
                    <div className="text-gray-600">Leads Remaining</div>
                    <div className="w-full bg-gray-200 h-3 rounded mt-2">
                      <div 
                        className="bg-green-500 h-3 rounded"
                        style={{ width: `${(user.trialLeadsRemaining / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded">
                      <div className="font-bold">Bonus Multiplier</div>
                      <div className="text-2xl">{user.bonusMultiplier}x</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                      <div className="font-bold">Leads Used</div>
                      <div className="text-2xl">{user.trialLeadsUsed}</div>
                    </div>
                  </div>
                </div>
              ) : (
                // PAID DASHBOARD (NO TRIAL FEATURES)
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="p-4 bg-green-50 rounded mb-4">
                    <div className="font-bold text-green-800">✓ Trial Ended • Full Paid Plan Active</div>
                    <div className="text-sm text-green-700">No trial features shown in paid plans</div>
                  </div>
                  <h2 className="text-xl font-bold mb-4">{plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Features</h2>
                  <ul className="space-y-2">
                    {getPlanFeatures(plan).map((feature: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="mr-2">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                  {/* CRITICAL: No trial data shown here */}
                  <div className="mt-6 p-4 bg-blue-50 rounded">
                    <div className="text-sm text-blue-800">
                      ✅ This is a clean paid dashboard. No trial leads counter, no bonus multiplier.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold mb-4">Upgrade Plans</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleUpgrade('gold')}
                    className="w-full bg-yellow-500 text-white py-2 px-4 rounded"
                  >
                    Gold - KES 15,000
                  </button>
                  <button
                    onClick={() => handleUpgrade('platinum')}
                    className="w-full bg-gray-500 text-white py-2 px-4 rounded"
                  >
                    Platinum - KES 50,000
                  </button>
                  <button
                    onClick={() => handleUpgrade('diamond')}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Diamond - KES 125,000
                  </button>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <div className="font-bold">Important:</div>
                    <ul className="mt-1 space-y-1">
                      <li>• Trial ends immediately on upgrade</li>
                      <li>• No trial features in paid plans</li>
                      <li>• Full features unlocked instantly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <div className="font-bold mb-2">Current Status:</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm">Plan Type</div>
                <div className="font-bold">{plan === 'trial' ? 'Trial (100 Leads)' : plan}</div>
              </div>
              {plan === 'trial' ? (
                <>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm">Leads Remaining</div>
                    <div className="font-bold">{user.trialLeadsRemaining}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm">Bonus Multiplier</div>
                    <div className="font-bold">{user.bonusMultiplier}x</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm">Plan Status</div>
                    <div className="font-bold text-green-600">Active</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm">Features</div>
                    <div className="font-bold">{getPlanFeatures(plan).length}</div>
                  </div>
                </>
              )}
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm">Dashboard</div>
                <div className="font-bold">{plan === 'trial' ? 'Trial' : 'Paid'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
EOF

# 4. Minimal layout
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Arex.co.ke Plan System',
  description: 'Get 100 free leads. Trial ends immediately on upgrade.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
EOF

# 5. Minimal CSS
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# 6. Tailwind config
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
EOF

# 7. PostCSS config
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Install dependencies quickly
echo "📦 Installing dependencies (fast mode)..."
npm install --silent

# Initialize Git
echo "📡 Setting up Git..."
git init --quiet
git branch -M main
git add .
git commit -m "feat: Minimal Arex plan system with trial/paid separation" --quiet

echo ""
echo "✅ DONE in under 10 seconds!"
echo ""
echo "🚀 To run locally:"
echo "   cd arex-fast"
echo "   npm run dev"
echo ""
echo "🌐 Open: http://localhost:3000"
echo ""
echo "📤 To push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/arex-fast.git"
echo "   git push -u origin main"
echo ""
echo "🎯 Features implemented:"
echo "   ✓ 100 free leads on signup"
echo "   ✓ Trial dashboard with counter"
echo "   ✓ Upgrade removes trial features immediately"
echo "   ✓ Paid dashboard has NO trial features"
echo "   ✓ Mutually exclusive states"
