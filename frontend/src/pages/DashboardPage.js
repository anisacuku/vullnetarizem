import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaUserCircle,
  FaUserEdit,
  FaRegLightbulb,
  FaArrowRight,
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

function prettifyEmailName(email) {
  if (!email || typeof email !== "string") return "";
  const base = email.split("@")[0] || "";
  return base
    .replace(/[._-]+/g, " ")
    .replace(/\d+/g, "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ---------------- DASHBOARD ---------------- */

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState("Përshëndetje");
  const [username, setUsername] = useState("");
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [topMatches, setTopMatches] = useState([]);
  const [applied, setApplied] = useState([]);

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

    setUsername(prettifyEmailName(user.email));

    try {
      const savedProfile = localStorage.getItem(`user_profile_${user.email}`);
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));

      const recommendationsData = localStorage.getItem(
        `user_recommendations_${user.email}`
      );

      let recs = [];
      if (recommendationsData) recs = JSON.parse(recommendationsData);

      /* 🔥 PROPER TITLE + ORG DETECTION */
      const mappedMatches = recs.map((r, idx) => {
        const title =
          r.title ??
          r.name ??
          r.opportunity_title ??
          r.position ??
          r.opportunity?.title ??
          r.opportunity?.name ??
          `Mundësi #${idx + 1}`;

        const organization =
          r.organization ??
          r.org ??
          r.company ??
          r.opportunity?.organization ??
          "Organizatë";

        const rawScore =
          r.score ?? r.match_score ?? r.similarity ?? r.matchScore ?? 0.75;

        const score =
          rawScore > 1 ? Math.round(rawScore) : Math.round(rawScore * 100);

        return {
          id: r.id ?? r.opportunity?.id ?? idx + 1,
          title,
          organization,
          score: Math.max(0, Math.min(100, score)),
          reasons: r.reasons ?? [],
        };
      });

      setTopMatches(mappedMatches);

      const appliedOpps = JSON.parse(
        localStorage.getItem(`applied_${user.email}`) || "[]"
      );

      const appliedDetails = appliedOpps.map((id) => ({
        id,
        title: `Opportunity #${id}`,
        organization: "Organizatë",
        date: "Data në pritje",
        status: "Applied",
      }));

      setApplied(appliedDetails);
    } catch (err) {
      console.error(err);
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

  const displayName =
    userProfile?.name || user?.name || username || "Përdorues";

  if (showProfileEdit) {
    return (
      <div className="dash2-wrap">
        <div className="dash2-shell">
          <ProfileEditForm
            initialData={userProfile}
            userEmail={user?.email}
            onComplete={handleProfileUpdate}
            onCancel={() => setShowProfileEdit(false)}
          />
        </div>
      </div>
    );
  }

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
              <div className="dash2-eyebrow">DASHBOARD</div>
              <h1>
                {greeting}, <span className="dash2-name">{displayName}</span> 👋
              </h1>
              <p>Paneli yt personal për përputhje dhe aplikime.</p>

              <div className="dash2-actions">
                <button
                  className="dash2-btn primary"
                  onClick={() => setShowProfileEdit(true)}
                >
                  <FaUserEdit /> Përditëso Profilin
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PROFILE COMPLETION */}
        <section className="dash2-section">
          <Card radius="lg" shadow="sm" className="dash2-card">
            <div className="dash2-profileTop">
              <div>
                <div className="dash2-profileTitle">Profili yt</div>
                <Badge variant="light">AI MATCHING</Badge>
              </div>
              <div className="dash2-profilePct">{completion}%</div>
            </div>
            <Progress value={completion} mt="sm" radius="xl" />
          </Card>
        </section>

        {/* PANELS */}
        <section className="dash2-panels">
          {/* MATCHES */}
          <Card radius="lg" shadow="sm" className="dash2-card">
            <div className="dash2-panelHead">
              <h3>Top Përputhjet</h3>
              <Link to="/matches" className="dash2-link">
                Shiko të gjitha →
              </Link>
            </div>

            <TopMatchesWidget matches={topMatches} />
          </Card>

          {/* APPLICATIONS */}
          <Card radius="lg" shadow="sm" className="dash2-card">
            <div className="dash2-panelHead">
              <h3>Aplikime të Bëra</h3>
            </div>

            {applied.length === 0 ? (
              <div className="dash2-empty">
                <div className="dash2-emptyIcon">📭</div>
                <p className="dash2-emptyTitle">
                  Ende nuk ke bërë aplikime.
                </p>

                <button
                  className="dash2-btn primary"
                  onClick={() => navigate("/opportunities")}
                >
                  Shfleto Mundësitë <FaArrowRight />
                </button>
              </div>
            ) : (
              <div className="dash2-list">
                {applied.map((app) => (
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