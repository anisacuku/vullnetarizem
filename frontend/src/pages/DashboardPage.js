import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaUserCircle,
  FaClipboardCheck,
  FaCalendarAlt,
  FaUserEdit,
  FaPaperPlane,
  FaArrowRight,
} from "react-icons/fa";

import ProfileEditForm from "../components/profile/ProfileEditForm";
import TopMatchesWidget from "../components/dashboard/TopMatchesWidget";

import { Card, SimpleGrid, Progress, Badge } from "@mantine/core";
import "../App.css";

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
    upcomingActivities: [],
  });

  const completion = useMemo(
    () => calculateProfileCompletion(userProfile),
    [userProfile]
  );

  /* ---------------- LOAD USER DATA ---------------- */

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Mirëmëngjes");
    else if (hour < 18) setGreeting("Mirëdita");
    else setGreeting("Mirëmbrëma");
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    const extractedName = user.email.split("@")[0];
    setUsername(extractedName);

    try {
      // PROFILE
      const savedProfile = localStorage.getItem(`user_profile_${user.email}`);
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));

      // RECOMMENDATIONS
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

      setTopMatches(mappedMatches);

      // APPLIED
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

      setStats({
        matchedOpportunities: recs.length,
        appliedOpportunities: appliedDetails,
        upcomingActivities: appliedDetails, // keeping same for now
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }, [user]);

  /* ---------------- PROFILE UPDATE ---------------- */

  const handleProfileUpdate = (updatedProfile) => {
    localStorage.setItem(
      `user_profile_${user?.email}`,
      JSON.stringify(updatedProfile)
    );
    setUserProfile(updatedProfile);
    setShowProfileEdit(false);
  };

  const displayName = userProfile?.name || username || "Përdorues";

  /* ---------------- UI ---------------- */

  return (
    <div className="dash-wrap">
      {!showProfileEdit ? (
        <>
          {/* HERO */}
          <section className="dash-hero">
            <div className="dash-hero-inner">
              <div className="dash-hero-left">
                <div className="dash-avatar">
                  <FaUserCircle size={58} />
                </div>

                <div className="dash-hero-text">
                  <h1 className="dash-h1">
                    {greeting}, <span>{displayName}</span> 👋
                  </h1>
                  <p className="dash-sub">
                    Paneli yt personal për përputhje dhe aplikime.
                  </p>

                  <div className="dash-actions">
                    <button
                      className="dash-btn primary"
                      onClick={() => navigate("/matches")}
                    >
                      Shiko përputhjet <FaArrowRight />
                    </button>

                    <button
                      className="dash-btn ghost"
                      onClick={() => navigate("/opportunities")}
                    >
                      Shfleto Mundësitë
                    </button>

                    <button
                      className="dash-btn outline"
                      onClick={() => setShowProfileEdit(true)}
                    >
                      <FaUserEdit /> Përditëso Profilin
                    </button>
                  </div>
                </div>
              </div>

              <div className="dash-hero-right">
                <div className="dash-mini">
                  <div className="dash-mini-label">Profili</div>
                  <div className="dash-mini-value">{completion}%</div>
                  <div className="dash-mini-hint">Plotësim</div>
                </div>

                <div className="dash-mini">
                  <div className="dash-mini-label">Përputhje</div>
                  <div className="dash-mini-value">{stats.matchedOpportunities}</div>
                  <div className="dash-mini-hint">Rekomandime</div>
                </div>

                <div className="dash-mini">
                  <div className="dash-mini-label">Aplikime</div>
                  <div className="dash-mini-value">
                    {stats.appliedOpportunities.length}
                  </div>
                  <div className="dash-mini-hint">Totali</div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTENT */}
          <section className="dash-content">
            <div className="dash-container">
              {/* KPI CARDS */}
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <Card className="dash-kpi" radius="lg" shadow="sm">
                  <div className="dash-kpi-top">
                    <p className="dash-kpi-title">Përputhje</p>
                    <FaClipboardCheck />
                  </div>
                  <div className="dash-kpi-sub">Mundësi të rekomanduara për ty</div>
                  <div className="dash-kpi-value">{stats.matchedOpportunities}</div>
                  <Link to="/matches" className="dash-kpi-link">
                    Shiko përputhjet →
                  </Link>
                </Card>

                <Card className="dash-kpi" radius="lg" shadow="sm">
                  <div className="dash-kpi-top">
                    <p className="dash-kpi-title">Aplikime</p>
                    <FaPaperPlane />
                  </div>
                  <div className="dash-kpi-sub">Aplikimet që ke bërë</div>
                  <div className="dash-kpi-value">{stats.appliedOpportunities.length}</div>
                </Card>

                <Card className="dash-kpi" radius="lg" shadow="sm">
                  <div className="dash-kpi-top">
                    <p className="dash-kpi-title">Aktivitete</p>
                    <FaCalendarAlt />
                  </div>
                  <div className="dash-kpi-sub">Aktivitetet e planifikuara</div>
                  <div className="dash-kpi-value">{stats.upcomingActivities.length}</div>
                </Card>
              </SimpleGrid>

              {/* PROFILE COMPLETION */}
              <Card radius="lg" shadow="sm" className="dash-profile">
                <div className="dash-profile-top">
                  <div className="dash-profile-left">
                    <span className="dash-profile-title">Profili yt</span>
                    <Badge ml="sm" variant="light">
                      AI MATCHING
                    </Badge>
                  </div>

                  <span className="dash-profile-pct">{completion}%</span>
                </div>

                <Progress value={completion} mt="sm" radius="xl" />
                <p className="dash-profile-hint">
                  Plotëso profilin për rekomandime më të sakta.
                </p>
              </Card>

              {/* LOWER GRID */}
              <div className="dash-lower">
                <div className="dash-panel">
                  <div className="dash-panel-head">
                    <h3>Top Përputhjet</h3>
                    <Link to="/matches" className="dash-panel-link">
                      Shiko të gjitha →
                    </Link>
                  </div>
                  <TopMatchesWidget matches={topMatches} />
                </div>

                <div className="dash-panel">
                  <div className="dash-panel-head">
                    <h3>Aplikime të Bëra</h3>
                    <Link to="/opportunities" className="dash-panel-link">
                      Gjej mundësi →
                    </Link>
                  </div>

                  {stats.appliedOpportunities.length === 0 ? (
                    <div className="dash-empty">
                      <p>Ende nuk ke bërë aplikime.</p>
                      <button
                        className="dash-btn primary"
                        onClick={() => navigate("/opportunities")}
                      >
                        Shfleto Mundësitë <FaArrowRight />
                      </button>
                    </div>
                  ) : (
                    <div className="dash-list">
                      {stats.appliedOpportunities.slice(0, 5).map((app) => (
                        <div className="dash-item" key={app.id}>
                          <div className="dash-item-main">
                            <div className="dash-item-title">{app.title}</div>
                            <div className="dash-item-sub">
                              {app.organization} • {app.date}
                            </div>
                          </div>
                          <span className="dash-badge">{app.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="profile-edit-container">
          <h2>Përditëso Profilin Tuaj</h2>

          <ProfileEditForm
            initialData={userProfile}
            userEmail={user?.email}
            onComplete={handleProfileUpdate}
            onCancel={() => setShowProfileEdit(false)}
          />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;