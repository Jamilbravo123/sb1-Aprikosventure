import Layout from '../components/layout/Layout';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import MembershipStatus from '../components/dashboard/MembershipStatus';
import VentureList from '../components/dashboard/VentureList';
import NewsList from '../components/dashboard/NewsList';

export default function InvestorDashboard() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] via-[#111827] to-[#0A0E1A]">
        <DashboardHeader />
        <MembershipStatus />
        <VentureList />
        <NewsList />
      </div>
    </Layout>
  );
}

