import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ScoreBar from "@/components/game/ScoreBar";
import Scene1Greeting from "@/components/game/Scene1Greeting";
import Scene2Seating from "@/components/game/Scene2Seating";
import Scene3Menu from "@/components/game/Scene3Menu";
import IdentifyScene from "@/components/game/IdentifyScene";
import GameSummary from "@/components/game/GameSummary";
import { getSession, updateScene, completeSession } from "@/lib/api";
import { stopSpeaking } from "@/lib/tts";
import { SCENE_4, SCENE_5 } from "@/lib/gameContent";

const SCENE_KEYS = ["scene_1", "scene_2", "scene_3", "scene_4", "scene_5"];

const Game = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await getSession(sessionId);
        setSession(s);
        // Jump to next incomplete scene
        const completedScenes = Object.keys(s.scenes || {}).length;
        if (s.completed_at) {
          setFinished(true);
          setSceneIndex(SCENE_KEYS.length - 1);
        } else if (completedScenes >= SCENE_KEYS.length) {
          setFinished(true);
        } else {
          setSceneIndex(completedScenes);
        }
      } catch (err) {
        toast.error("Oturum bulunamadı.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
    return () => stopSpeaking();
  }, [sessionId, navigate]);

  const finishScene = async ({ score, max_score, answers }) => {
    stopSpeaking();
    const sceneKey = SCENE_KEYS[sceneIndex];
    try {
      const updated = await updateScene(sessionId, {
        scene: sceneKey,
        score,
        max_score,
        answers,
      });
      setSession(updated);
      toast.success(
        `Sahne ${sceneIndex + 1} tamam: ${score}/${max_score} puan!`,
      );
      if (sceneIndex < SCENE_KEYS.length - 1) {
        setSceneIndex(sceneIndex + 1);
      } else {
        const finalSession = await completeSession(sessionId);
        setSession(finalSession);
        setFinished(true);
      }
    } catch (err) {
      toast.error("Puan kaydedilemedi.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0]">
        <div className="font-serif-display text-[#8C7A6B]">Masanız hazırlanıyor...</div>
      </div>
    );
  }

  const totalScore = session?.total_score || 0;
  const maxScore = session?.max_score || 0;

  if (finished) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] cini-bg">
        <ScoreBar
          studentName={session?.student_name}
          sceneIndex={SCENE_KEYS.length - 1}
          totalScenes={SCENE_KEYS.length}
          score={totalScore}
          maxScore={maxScore}
        />
        <GameSummary session={session} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] cini-bg">
      <ScoreBar
        studentName={session?.student_name}
        sceneIndex={sceneIndex}
        totalScenes={SCENE_KEYS.length}
        score={totalScore}
        maxScore={maxScore}
      />
      {sceneIndex === 0 && <Scene1Greeting key="s1" onFinish={finishScene} />}
      {sceneIndex === 1 && <Scene2Seating key="s2" onFinish={finishScene} />}
      {sceneIndex === 2 && <Scene3Menu key="s3" onFinish={finishScene} />}
      {sceneIndex === 3 && (
        <IdentifyScene
          key="s4"
          scene={SCENE_4}
          accentKey="soru"
          testIdPrefix="scene4"
          onFinish={finishScene}
        />
      )}
      {sceneIndex === 4 && (
        <IdentifyScene
          key="s5"
          scene={SCENE_5}
          accentKey="belgisiz"
          testIdPrefix="scene5"
          onFinish={finishScene}
        />
      )}
    </div>
  );
};

export default Game;
