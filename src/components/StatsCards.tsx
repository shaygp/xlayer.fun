import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

const StatsCards = () => {
  const stats = [
    {
      title: "Total Users",
      value: "114",
      change: "+2.1%",
      icon: Users,
      color: "text-xlayer-purple"
    },
    {
      title: "Testnet Market Cap",
      value: "8.2K OKB",
      change: "+5.4%",
      icon: TrendingUp,
      color: "text-primary"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-xlayer-card border-xlayer-border p-4 hover:shadow-xlayer-glow transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-primary" />
                <span className="text-xs text-primary font-medium">{stat.change}</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg bg-xlayer-hover group-hover:bg-xlayer-border transition-colors`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;