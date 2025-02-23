
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

interface InsightData {
  totalEarnings: number;
  completedCount: number;
  byDay: Record<string, number>;
  byWeek: Record<string, number>;
  recentCompletions: any[];
}

interface VetInsightsProps {
  insights: InsightData;
  className?: string;
}

const VetInsights = ({ insights, className }: VetInsightsProps) => {
  const chartData = Object.entries(insights.byDay).map(([date, amount]) => ({
    date,
    amount
  }));

  return (
    <div className={cn("bg-white rounded-xl shadow-md p-6", className)}>
      <h3 className="text-lg font-semibold mb-6">Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm text-blue-600 mb-1">Total Earnings (30 days)</h4>
          <p className="text-2xl font-bold">${insights.totalEarnings}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm text-green-600 mb-1">Completed Consultations</h4>
          <p className="text-2xl font-bold">{insights.completedCount}</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="text-sm text-yellow-600 mb-1">Average per Consultation</h4>
          <p className="text-2xl font-bold">
            ${insights.completedCount > 0 
              ? Math.round(insights.totalEarnings / insights.completedCount) 
              : 0}
          </p>
        </div>
      </div>

      <div className="h-[300px] mb-6">
        <h4 className="text-sm font-medium mb-4">Earnings by Day</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-4">Recent Completions</h4>
        <div className="space-y-4">
          {insights.recentCompletions.map((completion) => (
            <div 
              key={completion.id} 
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">Patient ID: {completion.user_id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(completion.appointment_time).toLocaleString()}
                </p>
              </div>
              <span className="font-semibold text-green-600">${completion.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VetInsights;
