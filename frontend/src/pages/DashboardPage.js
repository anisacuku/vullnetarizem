import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaUserCircle,
  FaClipboardCheck,
  FaCalendarAlt,
  FaUserEdit,
  FaPaperPlane,
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
      }));

      setStats({
        matchedOpportunities: recs.length,
        appliedOpportunities: appliedDetails,
        upcomingActivities: appliedDetails,
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

  /* ---------------- UI ---------------- */

  return (
    <div className="dashboard-container">
      {!showProfileEdit ? (
        <>
          {/* HERO */}
          <div className="dashboard-header">
            <div className="welcome-section">
              <div>
                <div className="user-avatar">
                  <FaUserCircle size={60} color="#083081" />
                </div>

                <div className="welcome-text">
                  <h2>
                    {greeting}, {userProfile?.name || username}!
                  </h2>
                  <p>Mirësevini në panelin tuaj personal.</p>
                </div>
              </div>

              <button
                className="edit-profile-button"
                onClick={() => setShowProfileEdit(true)}
              >
                <FaUserEdit /> Përditëso Profilin
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="dashboard-content">

            {/* KPI CARDS */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <Card className="dashboard-kpi-card" radius="lg" shadow="sm">
                <div className="dashboard-kpi-top">
                  <p className="dashboard-kpi-title">Përputhje</p>
                  <FaClipboardCheck color="#083081" />
                </div>

                <div className="dashboard-kpi-subtitle">
                  Mundësi të rekomanduara për ty
                </div>

                <div className="dashboard-kpi-value">
                  {stats.matchedOpportunities}
                </div>

                <Link to="/matches" className="dashboard-kpi-link">
                  Shiko përputhjet →
                </Link>
              </Card>

              <Card className="dashboard-kpi-card" radius="lg" shadow="sm">
                <div className="dashboard-kpi-top">
                  <p className="dashboard-kpi-title">Aplikime</p>
                  <FaPaperPlane color="#083081" />
                </div>

                <div className="dashboard-kpi-subtitle">
                  Aplikimet që ke bërë
                </div>

                <div className="dashboard-kpi-value">
                  {stats.appliedOpportunities.length}
                </div>
              </Card>

              <Card className="dashboard-kpi-card" radius="lg" shadow="sm">
                <div className="dashboard-kpi-top">
                  <p className="dashboard-kpi-title">Aktivitete</p>
                  <FaCalendarAlt color="#083081" />
                </div>

                <div className="dashboard-kpi-subtitle">
                  Aktivitetet e planifikuara
                </div>

                <div className="dashboard-kpi-value">
                  {stats.upcomingActivities.length}
                </div>
              </Card>
            </SimpleGrid>

            {/* PROFILE COMPLETION */}
            <Card radius="lg" shadow="sm" className="dashboard-profile-card">
              <div className="dashboard-profile-top">
                <div>
                  <span className="dashboard-profile-title">
                    Profili yt
                  </span>
                  <Badge ml="sm" variant="light">
                    AI MATCHING
                  </Badge>
                </div>

                <span className="dashboard-profile-percentage">
                  {completion}%
                </span>
              </div>

              <Progress value={completion} mt="sm" radius="xl" />
            </Card>

            {/* LOWER GRID */}
            <div className="dashboard-lower-grid">
              <div>
                <TopMatchesWidget matches={topMatches} />
              </div>

              <div className="dashboard-applications empty">
                <h3>Aplikime të Bëra</h3>
                <p>Ende nuk ke bërë aplikime.</p>
              </div>
            </div>

          </div>
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