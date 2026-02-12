import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Sparkles, Check } from "lucide-react";

const AURA_COLORS = [
  { key: "blue", label: "Blue", meaning: "Calm & Thoughtful", hsl: "220 80% 60%" },
  { key: "red", label: "Red", meaning: "Passionate & Bold", hsl: "0 75% 55%" },
  { key: "green", label: "Green", meaning: "Growth & Balance", hsl: "150 60% 45%" },
  { key: "purple", label: "Purple", meaning: "Creative & Intuitive", hsl: "270 70% 55%" },
  { key: "gold", label: "Gold", meaning: "Confident & Radiant", hsl: "45 90% 55%" },
  { key: "pink", label: "Pink", meaning: "Romantic & Warm", hsl: "330 80% 60%" },
];

const VIBE_QUESTIONS = [
  { key: "time_of_day", question: "Are you a…", options: ["🌅 Morning person", "🌙 Night owl"] },
  { key: "energy", question: "Your ideal weekend?", options: ["🏔 Adventure", "🛋 Chill at home"] },
  { key: "conversation", question: "You prefer…", options: ["💭 Deep talks", "😄 Light laughs"] },
  { key: "intention", question: "Looking for…", options: ["💍 Something long-term", "🌊 Going with the flow"] },
  { key: "social", question: "Social style?", options: ["🎉 Big groups", "☕ One-on-one"] },
  { key: "love_language", question: "Love language?", options: ["🤗 Quality time", "💌 Words of affirmation"] },
];

const GENDERS = ["Woman", "Man", "Non-binary", "Other"];
const LOOKING_FOR_OPTIONS = ["Women", "Men", "Everyone"];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [bio, setBio] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [vibeAnswers, setVibeAnswers] = useState<Record<string, string>>({});

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const toggleColor = (key: string) => {
    setSelectedColors((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : prev.length < 3 ? [...prev, key] : prev
    );
  };

  const canProceed = () => {
    switch (step) {
      case 0: return displayName.trim() && birthday;
      case 1: return gender && lookingFor;
      case 2: return bio.trim().length >= 10;
      case 3: return selectedColors.length >= 1;
      case 4: return Object.keys(vibeAnswers).length === VIBE_QUESTIONS.length;
      default: return false;
    }
  };

  const calculateTraits = (): string[] => {
    const traits: string[] = [];
    if (vibeAnswers.time_of_day?.includes("Morning")) traits.push("Early riser");
    if (vibeAnswers.time_of_day?.includes("Night")) traits.push("Night owl");
    if (vibeAnswers.energy?.includes("Adventure")) traits.push("Adventurous");
    if (vibeAnswers.energy?.includes("Chill")) traits.push("Relaxed");
    if (vibeAnswers.conversation?.includes("Deep")) traits.push("Deep thinker");
    if (vibeAnswers.conversation?.includes("Light")) traits.push("Fun-loving");
    if (vibeAnswers.intention?.includes("long-term")) traits.push("Committed");
    if (vibeAnswers.intention?.includes("flow")) traits.push("Open-minded");
    if (vibeAnswers.social?.includes("Big")) traits.push("Social butterfly");
    if (vibeAnswers.social?.includes("One-on-one")) traits.push("Intimate connector");
    return traits;
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const traits = calculateTraits();

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          birthday,
          gender,
          looking_for: lookingFor,
          bio,
          aura_colors: selectedColors,
          traits,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Save vibe answers
      const vibeRows = Object.entries(vibeAnswers).map(([question_key, answer]) => ({
        profile_id: user.id,
        question_key,
        answer,
      }));

      const { error: vibeError } = await supabase.from("vibe_answers").insert(vibeRows);
      if (vibeError) throw vibeError;

      navigate("/");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen flex flex-col safe-top safe-bottom">
      {/* Progress bar */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            className={`p-1 rounded-full ${step > 0 ? "text-foreground" : "text-transparent pointer-events-none"}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs text-muted-foreground font-medium">Step {step + 1} of {totalSteps}</span>
          <div className="w-7" />
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Steps */}
      <div className="flex-1 flex flex-col px-6 py-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={1}>
          {step === 0 && (
            <motion.div key="step0" variants={slideVariants} initial="enter" animate="center" exit="exit" custom={1} transition={{ duration: 0.3 }} className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold mb-1">What's your name?</h2>
              <p className="text-muted-foreground text-sm mb-8">And when's your birthday?</p>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Display name</Label>
                  <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className="h-12 rounded-xl text-base" />
                </div>
                <div className="space-y-2">
                  <Label>Birthday</Label>
                  <Input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="h-12 rounded-xl text-base" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" custom={1} transition={{ duration: 0.3 }} className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold mb-1">About you</h2>
              <p className="text-muted-foreground text-sm mb-8">How do you identify?</p>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>I am a…</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {GENDERS.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`h-12 rounded-xl border-2 font-medium transition-all ${
                          gender === g ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Looking for…</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {LOOKING_FOR_OPTIONS.map((l) => (
                      <button
                        key={l}
                        onClick={() => setLookingFor(l)}
                        className={`h-12 rounded-xl border-2 font-medium text-sm transition-all ${
                          lookingFor === l ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" custom={1} transition={{ duration: 0.3 }} className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold mb-1">Your bio</h2>
              <p className="text-muted-foreground text-sm mb-8">Tell people about yourself</p>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="I'm the kind of person who…"
                className="flex-1 min-h-[150px] rounded-xl text-base resize-none"
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground mt-2 text-right">{bio.length}/300</p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" custom={1} transition={{ duration: 0.3 }} className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold mb-1">Your aura colors</h2>
              <p className="text-muted-foreground text-sm mb-8">Pick 1–3 that resonate with your energy</p>
              <div className="grid grid-cols-2 gap-3">
                {AURA_COLORS.map((color) => (
                  <button
                    key={color.key}
                    onClick={() => toggleColor(color.key)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedColors.includes(color.key) ? "border-primary shadow-glow" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {selectedColors.includes(color.key) && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className="w-10 h-10 rounded-full mb-2"
                      style={{ background: `hsl(${color.hsl})` }}
                    />
                    <p className="font-semibold text-sm">{color.label}</p>
                    <p className="text-xs text-muted-foreground">{color.meaning}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" custom={1} transition={{ duration: 0.3 }} className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold mb-1">Vibe check ✨</h2>
              <p className="text-muted-foreground text-sm mb-6">Quick questions to find your match energy</p>
              <div className="space-y-5 overflow-y-auto flex-1">
                {VIBE_QUESTIONS.map((q) => (
                  <div key={q.key} className="space-y-2">
                    <p className="font-medium text-sm">{q.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setVibeAnswers((prev) => ({ ...prev, [q.key]: opt }))}
                          className={`py-3 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            vibeAnswers[q.key] === opt ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        {step < totalSteps - 1 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="w-full h-12 rounded-xl gradient-aura text-primary-foreground font-semibold text-base"
          >
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            disabled={!canProceed() || saving}
            className="w-full h-12 rounded-xl gradient-aura text-primary-foreground font-semibold text-base"
          >
            {saving ? "Setting up your aura…" : (
              <>
                <Sparkles className="w-4 h-4 mr-1" /> Reveal My Aura
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
