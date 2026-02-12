import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass, MessageCircle, User, Heart } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile && !profile.onboarding_completed) {
      navigate("/onboarding");
    }
  }, [profile, navigate]);

  if (!profile?.onboarding_completed) return null;

  return (
    <div className="flex flex-col min-h-screen pb-20 safe-top">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-gradient-aura">Aura</span>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
        >
          <User className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Content placeholder */}
      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-aura flex items-center justify-center aura-glow">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome, {profile?.display_name || "Explorer"} ✨</h1>
          <p className="text-muted-foreground">Your aura is ready. Start discovering connections.</p>
        </motion.div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass safe-bottom border-t border-border">
        <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
          {[
            { icon: Compass, label: "Discover", path: "/" },
            { icon: Heart, label: "Matches", path: "/matches" },
            { icon: MessageCircle, label: "Chat", path: "/chat" },
            { icon: User, label: "Profile", path: "/profile" },
          ].map(({ icon: Icon, label, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 py-1 px-3 transition-colors text-muted-foreground hover:text-primary"
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Index;
