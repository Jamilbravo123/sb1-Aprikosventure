import Layout from '../components/layout/Layout';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import VentureList from '../components/dashboard/VentureList';
import MembershipStatus from '../components/dashboard/MembershipStatus';

export default function InvestorDashboard() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] via-[#111827] to-[#0A0E1A]">
        <DashboardHeader />
        <VentureList />
        <MembershipStatus />
      </div>
    </Layout>
  );
}
