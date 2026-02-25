import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MatchCard.css";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

function clampScore(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  if (n <= 1) return Math.round(n * 100);
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreAccent(score) {
  return "accent-blue"; // FULL BLUE MODE
}

function MatchCard({ match }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const opp = useMemo(() => match?.opportunity ?? match ?? {}, [match]);

  const score = useMemo(() => {
    return clampScore(
      match?.score ??
        match?.match_score ??
        match?.similarity ??
        opp?.score ??
        0
    );
  }, [match, opp]);

  // 🔥 Smooth animation
  useEffect(() => {
    let start = 0;
    const duration = 900;
    const increment = score / (duration / 16);

    const animate = () => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
      } else {
        setAnimatedScore(Math.floor(start));
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const onViewDetails = () => {
    if (opp?.id != null) navigate(`/opportunities/${opp.id}`);
  };

  const title = opp?.title ?? "Mundësi Vullnetarizmi";
  const org = opp?.organization ?? opp?.org ?? "Organizatë";
  const description = opp?.description ?? "";

  const location = opp?.location ?? opp?.city ?? "—";
  const duration = opp?.duration ?? opp?.time ?? opp?.hours ?? "—";
  const dateRange = opp?.date_range ?? opp?.dates ?? opp?.date ?? "—";

  const matchedSkills =
    match?.matched_skills ??
    match?.skills ??
    match?.reasons ??
    opp?.matched_skills ??
    [];

  const skillsArray = useMemo(() => {
    if (Array.isArray(matchedSkills)) return matchedSkills;
    if (typeof matchedSkills === "string") return [matchedSkills];
    return [];
  }, [matchedSkills]);

  return (
    <article className="match-card accent-blue">
      <div className="match-card-top">
        <div className="match-score" aria-label={`Përputhje ${score}%`}>
          <div
            className="match-score-ring"
            style={{
              background: `conic-gradient(var(--ring) ${
                animatedScore * 3.4
              }deg, rgba(15,23,42,0.10) 0deg)`,
            }}
          >
            <div className="match-score-inner">
              <div className="match-score-value">
                {animatedScore}%
              </div>
              <div className="match-score-label">Match</div>
            </div>
          </div>
        </div>

        <div className="match-head">
          <h3 className="match-title">{title}</h3>
          <div className="match-org">{org}</div>
        </div>

        <button
          type="button"
          className="match-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? (
            <>
              Më pak <FaChevronUp />
            </>
          ) : (
            <>
              Më shumë <FaChevronDown />
            </>
          )}
        </button>
      </div>

      <div className="match-meta">
        <div className="match-chip">
          <FaMapMarkerAlt />
          <span>{location}</span>
        </div>
        <div className="match-chip">
          <FaCalendarAlt />
          <span>{dateRange}</span>
        </div>
        <div className="match-chip">
          <FaClock />
          <span>{duration}</span>
        </div>
      </div>

      {open && (
        <div className="match-body">
          {description && <p className="match-desc">{description}</p>}

          {skillsArray.length > 0 && (
            <div className="match-skills">
              <div className="match-skills-title">
                Aftësitë e përputhura
              </div>
              <div className="match-skill-list">
                {skillsArray.slice(0, 10).map((s, i) => (
                  <span className="match-skill" key={`${s}-${i}`}>
                    {String(s)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="match-actions">
        <button
          type="button"
          className="match-btn"
          onClick={onViewDetails}
          disabled={opp?.id == null}
        >
          Shiko Detajet
        </button>
      </div>
    </article>
  );
}

export default MatchCard;