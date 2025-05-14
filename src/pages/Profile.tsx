
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, FileText, MessageSquare } from "lucide-react";

const ProfilePage = () => {
  const username = "Founder";
  
  const recentActivities = [
    {
      id: 1,
      title: "Equity Changes",
      icon: <Activity className="h-4 w-4" />,
      date: "2 days ago",
      description: "Updated CTO equity allocation to 15%"
    },
    {
      id: 2,
      title: "Payments",
      icon: <Clock className="h-4 w-4" />,
      date: "1 week ago",
      description: "Processed Q2 vesting for founding team"
    },
    {
      id: 3,
      title: "Documents",
      icon: <FileText className="h-4 w-4" />,
      date: "2 weeks ago",
      description: "Added new SAFE agreement template"
    },
    {
      id: 4,
      title: "Chat History",
      icon: <MessageSquare className="h-4 w-4" />,
      date: "3 weeks ago",
      description: "Discussed funding strategy with AI CFO"
    }
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-heading font-bold mb-6">Profile Dashboard</h1>
      
      <Card className="glass-card mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                👋 Welcome back, {username}!
              </h2>
              <p className="text-slate-300">Here's where your startup stands.</p>
            </div>
            
            <div className="flex gap-3">
              <div className="text-right">
                <p className="text-sm text-slate-400">Stage</p>
                <Badge variant="outline" className="mt-1">Pre-Seed</Badge>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-slate-400">Last Edit</p>
                <p className="text-sm mt-1">2 days ago</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-slate-400">Cap Table</p>
                <Badge className="mt-1 bg-emerald-600">Draft (Tokenized)</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center mr-4">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium">{activity.title}</h3>
                    <span className="text-xs text-slate-400">{activity.date}</span>
                  </div>
                  <p className="text-sm text-slate-300">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ProfilePage;
