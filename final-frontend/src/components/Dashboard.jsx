import { Users, ShoppingCart, Mail } from "lucide-react";
import useCrmStore from "../store/crmStore";

export default function Dashboard() {
  const { allCustomers, allOrders, allCampaigns } = useCrmStore();

  const data = [
    {
      title: "👥 Customers",
      count: allCustomers.length,
      icon: Users,
      bg: "bg-blue-900/30",
      iconColor: "text-blue-300",
    },
    {
      title: "🛒 Orders",
      count: allOrders.length,
      icon: ShoppingCart,
      bg: "bg-green-900/30",
      iconColor: "text-green-300",
    },
    {
      title: "📧 Campaigns",
      count: allCampaigns.length,
      icon: Mail,
      bg: "bg-yellow-900/30",
      iconColor: "text-yellow-300",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e11] flex flex-col md:flex-row text-gray-100">
      {/* Left panel */}
      <aside className="md:w-1/3 px-6 py-10">
        <h1 className="text-4xl font-bold text-white mb-4">Dashboard</h1>
        <p className="text-sm text-gray-400">Real-time view of CRM metrics.</p>
      </aside>

      {/* Right panel */}
      <main className="flex-1 p-6 flex flex-col gap-6">
        {data.map(({ title, count, icon: Icon, bg, iconColor }) => (
          <div
            key={title}
            className={`rounded-md p-6 flex items-center justify-between ${bg} border border-white/10`}
          >
            <div>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <p className="text-4xl font-bold text-gray-100 mt-2">{count}</p>
            </div>
            <Icon className={`w-10 h-10 ${iconColor}`} />
          </div>
        ))}
      </main>
    </div>
  );
}
