import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { findRecommendations } from "../services/profileMatchingService";
import MatchCard from "../components/matching/MatchCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import "../App.css";

function MatchesPage() {
  const { user } = useContext(AuthContext);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const displayName = useMemo(() => {
    const emailName = user?.email?.includes("@") ? user.email.split("@")[0] : "";
    return profileData?.name || user?.name || emailName || "Përdorues";
  }, [profileData, user]);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const profileKey = `user_profile_${user.email}`;
    const matchesKey = `user_matches_${user.email}`;

    try {
      const storedProfile = localStorage.getItem(profileKey);
      const storedMatches = localStorage.getItem(matchesKey);

      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfileData(parsedProfile);

        if (storedMatches) {
          setMatches(JSON.parse(storedMatches));
          setLoading(false);
        } else {
          generateMatches(parsedProfile, matchesKey);
        }
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error("Error loading matches page data:", e);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const generateMatches = async (profile, cacheKey) => {
    try {
      setLoading(true);
      const matchResults = await findRecommendations(profile);
      setMatches(matchResults || []);
      localStorage.setItem(cacheKey, JSON.stringify(matchResults || []));
    } catch (error) {
      console.error("Gabim gjatë gjenerimit të përputhjeve:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="matches-page colorful">
      {/* HERO */}
      <section className="matches-hero colorful">
        <div className="matches-hero-inner">
          <div className="matches-hero-left">
            <div className="matches-badge">AI RECOMMENDATIONS</div>
            <h1 className="matches-h1">Përshëndetje, {displayName} ✨</h1>
            <p className="matches-lead">
              Këto janë mundësitë që përputhen më së shumti me profilin tënd. Plotëso aftësitë dhe interesat për rezultate edhe më të mira.
            </p>
          </div>

          <div className="matches-hero-right">
            <div className="matches-hero-stat colorful a">
              <div className="matches-hero-stat-label">Rezultate</div>
              <div className="matches-hero-stat-value">
                {loading ? "—" : matches.length}
              </div>
            </div>

            <div className="matches-hero-stat colorful b">
              <div className="matches-hero-stat-label">Statusi</div>
              <div className="matches-hero-stat-value small">
                {profileData ? "Aktiv" : "Plotëso profilin 📝"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="matches-content">
        <div className="matches-container">
          <div className="matches-titlebar">
            <h2 className="matches-h2">Përputhjet Tuaja</h2>

            {!loading && matches.length > 0 && (
              <div className="matches-pill colorful">
                {matches.length} rezultat{matches.length === 1 ? "" : "e"}
              </div>
            )}
          </div>

          {loading ? (
            <div className="matches-loading">
              <LoadingSpinner />
            </div>
          ) : !profileData ? (
            <div className="matches-empty colorful">
              <h3>Plotëso profilin</h3>
              <p>
                Nuk kemi të dhëna profili për të krijuar përputhje. Shko te Dashboard → Përditëso Profilin dhe shto aftësi/interesa.
              </p>
            </div>
          ) : matches.length === 0 ? (
            <div className="matches-empty colorful">
              <h3>Nuk ka përputhje ende</h3>
              <p>
                Përditëso profilin (aftësi/interesa) që sistemi të sugjerojë mundësi më të mira.
              </p>
            </div>
          ) : (
            <div className="matches-grid">
              {matches.map((match, idx) => (
                <MatchCard key={match?.opportunity?.id ?? idx} match={match} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MatchesPage;