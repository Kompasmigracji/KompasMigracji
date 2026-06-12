"use client";
/* KompasCRM — Training Academy & LMS */
import React, { useState, useEffect } from "react";
import { Icon, Badge, Avatar, ProgressBar, SearchInput } from "@/components/admin/ui";

export default function AcademyPage() {
  const [activeTab, setActiveTab] = useState("courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Mock Courses Data
  const [courses, setCourses] = useState([]);

  // Quiz Questions Data
  const quizQuestions = [
    {
      id: 1,
      q: "Який максимальний термін дії карти тимчасового побиту (TRC) в Польщі?",
      options: ["1 рік", "2 роки", "3 роки (Recommended)", "5 років"],
      correct: "3 роки (Recommended)"
    },
    {
      id: 2,
      q: "Протягом якого терміну після зміни роботодавця власник Blue Card має повідомити уженд?",
      options: ["15 днів (Recommended)", "30 днів", "60 днів", "Повідомляти не потрібно"],
      correct: "15 днів (Recommended)"
    }
  ];

  // AI Academy Tutor Logs (175 agents, 15 coordinators, 1 president)
  const [academyLogs, setAcademyLogs] = useState([]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-029 graded exam submission for user Oleh Koval: 100% Score. Certificate issued." },
      { type: "agent", text: "Agent-111 updated student analytics dashboards for Tools training." },
      { type: "coordinator", text: "Coordinator [Agent-C09] flagged 2 staff members with overdue mandatory security training." },
      { type: "system", text: "President digital key verified and appended to certificate registry database." },
      { type: "agent", text: "Agent-057 calculated academy average completion rate: 91.2% this month." },
      { type: "agent", text: "Agent-162 unlocked Advanced Negotiation module for sales team." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setAcademyLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleSelectAnswer = (qId, option) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleGradeQuiz = (e) => {
    e.preventDefault();
    let score = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        score += 50;
      }
    });
    setQuizScore(score);
    alert(`Тест завершено! Ваш результат: ${score}%. Сертифікат згенеровано автоматично AI Агентом.`);
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Навчання & Академія (LMS Portal)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Онбординг співробітників, тестування знань законів легалізації та видача сертифікатів.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary" onClick={() => setShowQuizModal(true)}>
            <Icon name="award" size={16} /> Пройти тест знань
          </button>
          <button className="kc-btn kc-btn-primary">
            <Icon name="plus" size={16} /> Створити курс
          </button>
        </div>
      </div>

      {/* KPI Stats Block */}
      <div className="kc-grid kc-grid-4">
        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "var(--brass-bg)" }}>
              <Icon name="award" size={18} color="var(--color-primary)" />
            </div>
            <Badge status="green" text="Active" />
          </div>
          <div className="kc-stat-val">12</div>
          <div className="kc-stat-lbl">Курсів в академії</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(95,184,122,0.1)" }}>
              <Icon name="check" size={18} color="var(--color-success)" />
            </div>
            <span>New</span>
          </div>
          <div className="kc-stat-val">240</div>
          <div className="kc-stat-lbl">Видано сертифікатів</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(95,155,213,0.1)" }}>
              <Icon name="users" size={18} color="var(--color-info)" />
            </div>
            <Badge status="blue" text="Staff" />
          </div>
          <div className="kc-stat-val">8 осіб</div>
          <div className="kc-stat-lbl">Співробітників вчаться</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(229,168,75,0.1)" }}>
              <Icon name="play-circle" size={18} color="var(--color-warning)" />
            </div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Passing</span>
          </div>
          <div className="kc-stat-val">93.6%</div>
          <div className="kc-stat-lbl">Сер. бал за тести</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)", overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
        <button 
          onClick={() => setActiveTab("courses")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "courses" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "courses" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            flexShrink: 0
          }}
        >
          <Icon name="book-open" size={16} /> Доступні курси
        </button>
        <button 
          onClick={() => setActiveTab("ai_tutor")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "ai_tutor" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "ai_tutor" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            flexShrink: 0
          }}
        >
          <Icon name="cpu" size={16} /> AI Екзаменатор (175+ Agents)
        </button>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, minHeight: 400 }}>
        {activeTab === "courses" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <SearchInput 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Пошук курсів за назвою або темою..." 
            />

            <div className="kc-table-wrap">
              <table className="kc-table">
                <thead>
                  <tr>
                    <th>ID Курсу</th>
                    <th>Назва курсу</th>
                    <th>Категорія</th>
                    <th>Всього студентів</th>
                    <th>Прогрес проходження</th>
                    <th>Сер. Бал</th>
                    <th style={{ textAlign: "right" }}>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 600 }}>{row.id}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Icon name="play-circle" size={16} color="var(--dim)" />
                          <span style={{ fontWeight: 500 }}>{row.title}</span>
                        </div>
                      </td>
                      <td><Badge status="info" text={row.category} /></td>
                      <td>{row.enrolled} staff</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, width: 120 }}>
                          <div style={{ flex: 1, background: "var(--panel-2)", height: 6, borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ 
                              width: row.enrolled > 0 ? `${(row.completed / row.enrolled) * 100}%` : "0%", 
                              height: "100%", background: "var(--color-success)" 
                            }}></div>
                          </div>
                          <span style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>
                            {row.enrolled > 0 ? Math.round((row.completed / row.enrolled) * 100) : 0}%
                          </span>
                        </div>
                      </td>
                      <td><strong style={{ color: "var(--color-primary)" }}>{row.avgScore}</strong></td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                          <button 
                            className="kc-btn kc-btn-ghost" 
                            style={{ padding: 6, minHeight: "auto" }}
                            title="Переглянути список лекцій"
                            onClick={() => setSelectedCourse(row)}
                          >
                            <Icon name="book-open" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "ai_tutor" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))", gap: "var(--space-lg)" }}>
            {/* AI Tutor Cockpit */}
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <h3 className="kc-card-cap" style={{ margin: 0 }}>AI Grading & LMS Engine</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Grading Verification Agents</span>
                  <strong style={{ color: "var(--color-primary)" }}>175</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Curriculum Coordinators</span>
                  <strong style={{ color: "var(--color-info)" }}>15</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Dean/President Key Signing</span>
                  <strong style={{ color: "var(--color-success)" }}>1 President</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "var(--space-sm)", marginTop: 4 }}>
                  <span>Status</span>
                  <Badge status="green" text="LMS Online" />
                </div>
              </div>

              <div className="kc-note" style={{ fontSize: "var(--text-xs)" }}>
                <strong>Опис системи:</strong> Штучний інтелект у режимі автопілота перевіряє правильність відповідей, верифікує криптографічні коди сертифікатів та записує прогрес співробітників у профілі.
              </div>
            </div>

            {/* AI Log Console */}
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", background: "#06090e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи тестувань знань (AI Tutor logs)</h3>
                <span className="kc-mono" style={{ fontSize: 10, color: "var(--dim)" }}>Auto-updating logs...</span>
              </div>

              <div style={{ 
                flex: 1, maxHeight: 280, overflowY: "auto", fontFamily: "var(--font-mono)", 
                fontSize: "var(--text-xs)", lineHeight: "1.6", color: "#c9d1d9",
                display: "flex", flexDirection: "column", gap: 8
              }}>
                {academyLogs.map((log, index) => {
                  let color = "#8b949e";
                  if (log.type === "coordinator") color = "#58a6ff";
                  if (log.type === "system") color = "#56d364";
                  return (
                    <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                      <span style={{ color: "var(--dim)" }}>[{log.time}]</span>{" "}
                      <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Lessons Modal Overlay */}
      {selectedCourse && (
        <div className="kc-modal-bg" onClick={() => setSelectedCourse(null)}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
              <div>
                <h3 className="kc-modal-title" style={{ margin: 0 }}>Навчальний план: {selectedCourse.title}</h3>
                <p style={{ color: "var(--dim)", fontSize: "var(--text-xs)", margin: "4px 0 0" }}>Категорія: {selectedCourse.category} · {selectedCourse.lessons.length} уроків</p>
              </div>
              <button onClick={() => setSelectedCourse(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)" }}>
                <Icon name="x" size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              {selectedCourse.lessons.length > 0 ? (
                <div className="kc-table-wrap" style={{ maxHeight: 250, overflowY: "auto" }}>
                  <table className="kc-table" style={{ fontSize: "var(--text-xs)" }}>
                    <thead>
                      <tr>
                        <th>Назва уроку</th>
                        <th>Тип</th>
                        <th>Тривалість</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCourse.lessons.map((l, idx) => (
                        <tr key={idx} style={{ cursor: "default" }}>
                          <td style={{ fontWeight: 600 }}>{l.name}</td>
                          <td>
                            {l.type === "video" ? (
                              <Badge status="blue" text="Відео" />
                            ) : l.type === "quiz" ? (
                              <Badge status="brass" text="Тест" />
                            ) : (
                              <Badge status="default" text="Документ" />
                            )}
                          </td>
                          <td>{l.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--dim)" }}>
                  <Icon name="award" size={36} style={{ opacity: 0.3 }} />
                  <p style={{ margin: "8px 0 0" }}>Для цього курсу ще немає створених лекцій.</p>
                </div>
              )}
              
              <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "flex-end", marginTop: "var(--space-sm)" }}>
                <button className="kc-btn" onClick={() => setSelectedCourse(null)}>Закрити</button>
                <button className="kc-btn kc-btn-primary" onClick={() => {
                  setSelectedCourse(null);
                  setShowQuizModal(true);
                }}>
                  <Icon name="play-circle" size={14} /> Почати навчання
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Testing Simulation Modal */}
      {showQuizModal && (
        <div className="kc-modal-bg" onClick={() => { setShowQuizModal(false); setQuizScore(null); setSelectedAnswers({}); }}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
              <h3 className="kc-modal-title" style={{ margin: 0 }}>Атестація: Польське право 2026</h3>
              <button onClick={() => { setShowQuizModal(false); setQuizScore(null); setSelectedAnswers({}); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)" }}>
                <Icon name="x" size={20} />
              </button>
            </div>

            {quizScore !== null ? (
              <div style={{ textAlign: "center", padding: "var(--space-lg)", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                  <Icon name="check" size={32} color="white" />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Ваш результат: {quizScore}%</h4>
                  <p style={{ color: "var(--dim)", fontSize: "var(--text-xs)", margin: "8px 0 0" }}>Тест успішно зараховано AI Екзаменатором. Сертифікат додано до вашого профілю.</p>
                </div>
                <button className="kc-btn kc-btn-primary" onClick={() => { setShowQuizModal(false); setQuizScore(null); setSelectedAnswers({}); }}>Завершити</button>
              </div>
            ) : (
              <form onSubmit={handleGradeQuiz} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                {quizQuestions.map((question) => (
                  <div key={question.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{question.id}. {question.q}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {question.options.map((option, idx) => (
                        <label key={idx} style={{ 
                          display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", 
                          background: selectedAnswers[question.id] === option ? "rgba(139, 92, 246, 0.1)" : "var(--panel-2)", 
                          borderRadius: 6, border: selectedAnswers[question.id] === option ? "1px solid var(--color-primary)" : "1px solid var(--border)",
                          cursor: "pointer", fontSize: "var(--text-xs)"
                        }}>
                          <input 
                            type="radio" 
                            name={`q_${question.id}`} 
                            checked={selectedAnswers[question.id] === option}
                            onChange={() => handleSelectAnswer(question.id, option)}
                            required
                            style={{ cursor: "pointer" }}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "flex-end", marginTop: "var(--space-sm)" }}>
                  <button type="button" className="kc-btn" onClick={() => { setShowQuizModal(false); setQuizScore(null); setSelectedAnswers({}); }}>Скасувати</button>
                  <button type="submit" className="kc-btn kc-btn-primary">Здати тест</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
