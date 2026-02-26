import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaUserCircle,
  FaUserEdit,
  FaPaperPlane,
  FaArrowRight,
  FaRegLightbulb,
} from "react-icons/fa";

import ProfileEditForm from "../components/profile/ProfileEditForm";
import TopMatchesWidget from "../components/dashboard/TopMatchesWidget";

import { Card, Progress, Badge } from "@mantine/core";
import "./DashboardPage.css";

/* ---------------- PROFILE COMPLETION ---------------- */

const calculateProfileCompletion = (profile) => {
  if (!profile) return 10;

  const fields = ["name", "city", "skills", "interests", "availability", "bio"];

  const filled = fields.filter((f) => {
    const val = profile[f];
    if (Array.isArray(val)) return val.length > 0;
    return Boolean(val && String(val).trim().length > 0);
  }).length;

  return Math.min(100, 10 + Math.round((filled / fields.length) * 90));
};

/* ---------------- DASHBOARD ---------------- */

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState("Mirësevini");
  const [username, setUsername] = useState("");
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [topMatches, setTopMatches] = useState([]);

  const [stats, setStats] = useState({
    matchedOpportunities: 0,
    appliedOpportunities: [],
  });

  const completion = useMemo(
    () => calculateProfileCompletion(userProfile),
    [userProfile]
  );

  /* Greeting */
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Mirëmëngjes");
    else if (hour < 18) setGreeting("Mirëdita");
    else setGreeting("Mirëmbrëma");
  }, []);

  /* Load Data */
  useEffect(() => {
    if (!user?.email) return;

    const extractedName = user.email.split("@")[0];
    setUsername(extractedName);

    try {
      const savedProfile = localStorage.getItem(
        `user_profile_${user.email}`
      );
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));

      const recommendationsData = localStorage.getItem(
        `user_recommendations_${user.email}`
      );

      let recs = [];
      if (recommendationsData) recs = JSON.parse(recommendationsData);

      const mappedMatches = recs.map((r, idx) => {
        const rawScore =
          r.score ?? r.match_score ?? r.similarity ?? r.matchScore ?? 0.75;

        const score =
          rawScore > 1 ? Math.round(rawScore) : Math.round(rawScore * 100);

        return {
          id: r.id ?? idx + 1,
          title: r.title ?? "Mundësi Vullnetarizmi",
          organization: r.organization ?? "Organizatë",
          score: Math.max(0, Math.min(100, score)),
          reasons: r.reasons ?? [],
        };
      });

      const appliedOpps = JSON.parse(
        localStorage.getItem(`applied_${user.email}`) || "[]"
      );

      const appliedDetails = appliedOpps.map((id) => ({
        id,
        title:
          id === 1
            ? "Community Clean-up"
            : id === 2
            ? "Teaching Assistant"
            : `Opportunity #${id}`,
        organization:
          id === 1
            ? "Green Albania"
            : id === 2
            ? "Fondacioni Arsimor i Shqipërisë"
            : "Organizatë",
        date:
          id === 1
            ? "15 Maj, 2025"
            : id === 2
            ? "1 Qershor - 31 Gusht, 2025"
            : "Data në pritje",
        status: "Applied",
      }));

      setTopMatches(mappedMatches);

      setStats({
        matchedOpportunities: recs.length,
        appliedOpportunities: appliedDetails,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }, [user]);

  const handleProfileUpdate = (updatedProfile) => {
    localStorage.setItem(
      `user_profile_${user?.email}`,
      JSON.stringify(updatedProfile)
    );
    setUserProfile(updatedProfile);
    setShowProfileEdit(false);
  };

  const displayName = userProfile?.name || username || "Përdorues";

  /* EDIT MODE */
  if (showProfileEdit) {
    return (
      <div className="dash2-wrap">
        <div className="dash2-shell">
          <div className="dash2-editHeader">
            <h2>Përditëso Profilin Tuaj</h2>
            <button
              className="dash2-btn ghost"
              onClick={() => setShowProfileEdit(false)}
            >
              Kthehu prapa
            </button>
          </div>

          <div className="dash2-editCard">
            <ProfileEditForm
              initialData={userProfile}
              userEmail={user?.email}
              onComplete={handleProfileUpdate}
              onCancel={() => setShowProfileEdit(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  /* MAIN DASHBOARD */

  return (
    <div className="dash2-wrap">
      <div className="dash2-shell">

        {/* HERO */}
        <section className="dash2-hero">
          <div className="dash2-heroLeft">
            <div className="dash2-avatar">
              <FaUserCircle />
            </div>

            <div className="dash2-heroText">
              <h1>
                {greeting}, <span className="dash2-name">{displayName}</span> 👋
              </h1>
              <p>Paneli yt personal për përputhje dhe aplikime.</p>

              <div className="dash2-actions">
                <button
                  className="dash2-btn primary"
                  onClick={() => navigate("/matches")}
                >
                  Shiko përputhjet <FaArrowRight />
                </button>

                <button
                  className="dash2-btn"
                  onClick={() => navigate("/opportunities")}
                >
                  Shfleto Mundësitë
                </button>

                <button
                  className="dash2-btn ghost"
                  onClick={() => setShowProfileEdit(true)}
                >
                  <FaUserEdit /> Përditëso Profilin
                </button>
              </div>
            </div>
          </div>

          <div className="dash2-heroRight">
            <div className="dash2-mini">
              <div className="dash2-miniLabel">Profili</div>
              <div className="dash2-miniValue">{completion}%</div>
              <div className="dash2-miniHint">Plotësim</div>
            </div>

            <div className="dash2-mini">
              <div className="dash2-miniLabel">Përputhje</div>
              <div className="dash2-miniValue">
                {stats.matchedOpportunities}
              </div>
              <div className="dash2-miniHint">Rekomandime</div>
            </div>
          </div>
        </section>

        {/* PROFILE COMPLETION */}
        <section className="dash2-section">
          <Card radius="lg" shadow="sm" className="dash2-card dash2-profileCard">
            <div className="dash2-profileTop">
              <div className="dash2-profileLeft">
                <div className="dash2-profileTitle">Profili yt</div>
                <Badge variant="light" className="dash2-badge">
                  AI MATCHING
                </Badge>
              </div>
              <div className="dash2-profilePct">{completion}%</div>
            </div>

            <Progress value={completion} mt="sm" radius="xl" />

            <div className="dash2-profileHint">
              Sa më i plotë profili, aq më të sakta përputhjet e AI.
            </div>

            {completion < 70 && (
              <div className="dash2-tip">
                <FaRegLightbulb />
                <span>
                  Shto <b>aftësi</b> dhe <b>interesa</b> për rezultate më të mira.
                </span>
              </div>
            )}
          </Card>
        </section>

        {/* PANELS */}
        <section className="dash2-panels">
          <Card radius="lg" shadow="sm" className="dash2-card dash2-panel">
            <div className="dash2-panelHead">
              <h3>Top Përputhjet</h3>
              <Link to="/matches" className="dash2-link">
                Shiko të gjitha →
              </Link>
            </div>

            <TopMatchesWidget matches={topMatches} />
          </Card>

          <Card radius="lg" shadow="sm" className="dash2-card dash2-panel">
            <div className="dash2-panelHead">
              <h3>Aplikime të Bëra</h3>
              <Link to="/opportunities" className="dash2-link">
                Gjej mundësi →
              </Link>
            </div>

            {stats.appliedOpportunities.length === 0 ? (
              <div className="dash2-empty">
                <p>Ende nuk ke bërë aplikime.</p>
                <button
                  className="dash2-btn primary"
                  onClick={() => navigate("/opportunities")}
                >
                  Shfleto Mundësitë <FaArrowRight />
                </button>
              </div>
            ) : (
              <div className="dash2-list">
                {stats.appliedOpportunities.map((app) => (
                  <div className="dash2-item" key={app.id}>
                    <div>
                      <div className="dash2-itemTitle">{app.title}</div>
                      <div className="dash2-itemSub">
                        {app.organization} • {app.date}
                      </div>
                    </div>
                    <span className="dash2-status">{app.status}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;