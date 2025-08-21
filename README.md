# SecureBank Queue Analytics

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/stanleyoffia/securebank-queue-analytics)

A professional banking queue simulation platform that helps optimize customer service operations using mathematical queueing theory.

## 🚀 Features

- **Queue Simulation Engine** - Mathematical M/M/c queueing models
- **Real-time Analytics** - Live performance metrics and trends
- **Professional Dashboard** - Comprehensive simulation management
- **Admin Panel** - User and role management
- **Role-based Access** - User and admin management
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Charts**: Recharts
- **Deployment**: Vercel-ready

## 📊 What It Solves

Banks use this platform to optimize:
- **Customer wait times** (reduce by up to 45%)
- **Staff scheduling** (optimal teller allocation)
- **Resource planning** (peak vs off-peak analysis)
- **Operational costs** (efficiency improvements)

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/securebank-queue-analytics.git
   cd securebank-queue-analytics
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🗄️ Database Setup

Run these SQL scripts in your Supabase dashboard:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create simulation_runs table
CREATE TABLE simulation_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'completed',
  arrival_rate DECIMAL,
  service_rate DECIMAL,
  num_servers INTEGER,
  duration INTEGER,
  total_customers INTEGER,
  completed_customers INTEGER,
  avg_wait_time DECIMAL,
  avg_queue_length DECIMAL,
  max_queue_length INTEGER,
  server_utilization DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 How to Use

1. **Sign up** for an account
2. **Configure simulation parameters**:
   - Arrival Rate: customers/minute
   - Service Rate: customers/minute/teller
   - Number of Servers: teller windows
   - Duration: simulation time in minutes
3. **Run simulation** and analyze results
4. **Compare scenarios** to optimize operations

## 📈 Example Scenarios

- **Peak Hours**: 8 arrivals/min, 5 service rate, 4 tellers
- **Normal Hours**: 3 arrivals/min, 6 service rate, 2 tellers  
- **Off-Peak**: 1 arrival/min, 6 service rate, 1 teller

## 🔐 Security

- Bank-grade 256-bit SSL encryption
- Supabase Row Level Security (RLS)
- Secure authentication with JWT tokens
- Private data isolation per user

## 📱 Pages

- `/` - Landing page
- `/dashboard` - Main simulation interface
- `/profile` - User account management
- `/settings` - Platform preferences
- `/help` - Complete user guide
- `/admin` - Administrator panel (admin only)

## 🚀 Deployment

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/securebank-queue-analytics)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Stanley Offia**
- Email: stanleyoffia@gmail.com
- Phone: 08085017786
- Location: MOUAU, Abia State

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📊 Mathematical Foundation

Uses queueing theory (M/M/c model):
- **M/M/c**: Markovian arrivals, Markovian service, c servers
- **Poisson arrivals**: Random customer arrival patterns
- **Exponential service**: Service time distribution
- **Little's Law**: L = λW (queue length = arrival rate × wait time)

---

*Built for banking professionals who need data-driven queue optimization solutions.*