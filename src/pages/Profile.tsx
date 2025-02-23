
import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, User, Calendar, Settings, Ticket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ActivitiesList } from "@/components/profile/ActivitiesList";
import { EventInsights } from "@/components/profile/EventInsights";

interface UserActivity {
  id: string;
  activity_type: 'event' | 'consultation' | 'vet_appointment';
  activity_date: string;
  details: any;
  status: string;
}

interface UserProfile {
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface EventInsight {
  event_id: string;
  title: string;
  date: string;
  total_bookings: number;
  total_tickets_sold: number;
  total_revenue: number;
}

const Profile = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [eventInsights, setEventInsights] = useState<EventInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEventCreator, setIsEventCreator] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      navigate('/auth');
      return;
    }

    const fetchProfileAndActivities = async () => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        const { data: activitiesData, error: activitiesError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', session.user.id)
          .order('activity_date', { ascending: false });

        if (activitiesError) throw activitiesError;
        setActivities(activitiesData);

        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('id')
          .eq('creator_id', session.user.id)
          .limit(1);

        if (!eventsError && eventsData && eventsData.length > 0) {
          setIsEventCreator(true);

          const { data: insightsData, error: insightsError } = await supabase
            .from('event_insights')
            .select('*')
            .eq('creator_id', session.user.id)
            .order('date', { ascending: false });

          if (insightsError) throw insightsError;
          setEventInsights(insightsData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndActivities();
  }, [session, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Successfully signed out');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-petsu-green p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-petsu-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-petsu-green p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button 
              variant="outline" 
              className="bg-white/90 hover:bg-petsu-yellow/20 border-2 border-petsu-blue text-petsu-blue"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <img 
            src="/lovable-uploads/0a2713cc-b038-4b98-9603-83f497104e2e.png" 
            alt="Petsu Logo" 
            className="h-12 w-auto"
          />
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-petsu-blue shadow-lg">
          <ProfileHeader profile={profile} onSignOut={handleSignOut} />

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-4 gap-4 bg-petsu-blue/5 p-1">
              <TabsTrigger value="profile" className="data-[state=active]:bg-white">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="activities" className="data-[state=active]:bg-white">
                <Calendar className="w-4 h-4 mr-2" />
                Activities
              </TabsTrigger>
              {isEventCreator && (
                <TabsTrigger value="events" className="data-[state=active]:bg-white">
                  <Ticket className="w-4 h-4 mr-2" />
                  My Events
                </TabsTrigger>
              )}
              <TabsTrigger value="settings" className="data-[state=active]:bg-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-petsu-blue" />
                <span className="text-petsu-blue">{profile?.email}</span>
              </div>
              {profile?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-petsu-blue" />
                  <span className="text-petsu-blue">{profile.phone}</span>
                </div>
              )}
            </TabsContent>

            <TabsContent value="activities">
              <ActivitiesList activities={activities} />
            </TabsContent>

            {isEventCreator && (
              <TabsContent value="events">
                <EventInsights insights={eventInsights} />
              </TabsContent>
            )}

            <TabsContent value="settings" className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Update Contact Information
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
