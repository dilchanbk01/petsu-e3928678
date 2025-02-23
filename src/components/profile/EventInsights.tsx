
import { Users, Ticket, DollarSign } from "lucide-react";

interface EventInsight {
  event_id: string;
  title: string;
  date: string;
  total_bookings: number;
  total_tickets_sold: number;
  total_revenue: number;
}

interface EventInsightsProps {
  insights: EventInsight[];
}

export const EventInsights = ({ insights }: EventInsightsProps) => {
  return (
    <div className="space-y-4">
      {insights.length === 0 ? (
        <p className="text-center text-petsu-blue/60 py-8">
          No event data available yet. Create your first event to see insights here!
        </p>
      ) : (
        insights.map((insight) => (
          <div 
            key={insight.event_id}
            className="bg-white rounded-xl p-6 shadow-md border-2 border-petsu-blue/20 hover:border-petsu-blue transition-colors"
          >
            <h3 className="text-xl font-semibold text-petsu-blue mb-4">{insight.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-petsu-blue/60" />
                <div>
                  <p className="text-sm text-petsu-blue/60">Total Bookings</p>
                  <p className="text-lg font-semibold text-petsu-blue">{insight.total_bookings}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-petsu-blue/60" />
                <div>
                  <p className="text-sm text-petsu-blue/60">Tickets Sold</p>
                  <p className="text-lg font-semibold text-petsu-blue">{insight.total_tickets_sold}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-petsu-blue/60" />
                <div>
                  <p className="text-sm text-petsu-blue/60">Total Revenue</p>
                  <p className="text-lg font-semibold text-petsu-blue">₹{insight.total_revenue}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-petsu-blue/60 mt-4">
              Event Date: {new Date(insight.date).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};
