import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function clampScore(score) {
  if (score === null || score === undefined) return 0;
  const n = Number(score);
  if (Number.isNaN(n)) return 0;
  if (n <= 1) return Math.round(n * 100);
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function TopMatchesWidget({ matches = [] }) {
  const navigate = useNavigate();

  const goToDetails = (id) => {
    navigate(`/opportunities/${id}`);
  };

  // ✅ IMPORTANT: No Card wrapper, no header, no "Shiko të gjitha"
  // DashboardPage already provides those.

  if (!matches || matches.length === 0) {
    return (
      <div className="dash2-empty">
        <p>Ende nuk kemi përputhje për ty. Plotëso profilin për rezultate më të sakta.</p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="dash2-btn"
            onClick={() => navigate("/profile/volunteer")}
          >
            Përditëso Profilin
          </button>

          <button
            className="dash2-btn primary"
            onClick={() => navigate("/opportunities")}
          >
            Shfleto Mundësitë <FaArrowRight />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dash2-list">
      {matches.slice(0, 3).map((match) => {
        const score = clampScore(match.score);
        const reason =
          Array.isArray(match.reasons) && match.reasons.length > 0
            ? match.reasons[0]
            : null;

        return (
          <div
            key={match.id}
            className="dash2-item"
            style={{ cursor: "pointer" }}
            onClick={() => goToDetails(match.id)}
            title="Kliko për detaje"
          >
            <div>
              <div className="dash2-itemTitle">{match.title}</div>
              <div className="dash2-itemSub">
                {match.organization}
                {reason ? ` • ${reason}` : ""}
              </div>
            </div>

            <span className="dash2-status">{score}%</span>
          </div>
        );
      })}
    </div>
  );
}