import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

// --- Icon Components (Replacing Lucide data-attributes) ---
const Icon = ({ name, className }) => {
    const icons = {
        'heart-pulse': <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
        'layout-dashboard': <><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></>,
        'history': <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></>,
        'user': <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
        'settings': <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>,
        'user-circle': <circle cx="12" cy="12" r="10" />,
        'activity': <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
        'trending-down': <><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></>,
        'bar-chart-horizontal': <><path d="M3 3v18h18" /><path d="M7 16h8" /><path d="M7 11h12" /><path d="M7 6h4" /></>,
        'shield-alert': <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="M12 8v4" /><path d="M12 16h.01" /></>,
        'brain-circuit': <><path d="M12 2a10 10 0 0 0-4.63 8.16a1 1 0 0 0 .1.64a1 1 0 0 1 .47 1.25a1 1 0 0 0-.5 1.55a10 10 0 1 0 9.17-11.6" /><path d="M12 2v2.5" /><path d="M18.5 3.5 16 5" /><path d="m4 12 2.5 1" /><path d="M4.5 18.5 7 17" /><circle cx="12" cy="12" r="2" /><path d="M12 14c-2.67 0-4.63.1-6.16.4a1 1 0 0 0-.84 1.6" /><path d="M12 14c2.67 0 4.63.1 6.16.4a1 1 0 0 1 .84 1.6" /><path d="m15 11-.5-3" /><path d="M9 11l.5-3" /></>,
        'sparkles': <path d="m12 3-1.9 4.2-4.3.4 3.3 2.9-.6 4.2 3.5-2.3 3.5 2.3-.6-4.2 3.3-2.9-4.3-.4L12 3zM5 13l-1.4 3L1 16.5l2.5 2.1-.5 3L5 20l2-1.4 2 1.4-.5-3L11 16.5l-2.6-.5L7 13zM19 13l-1.4 3L15 16.5l2.5 2.1-.5 3L19 20l2-1.4 2 1.4-.5-3L25 16.5l-2.6-.5L21 13z" />,
        'info': <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>,
        'x': <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {icons[name]}
        </svg>
    );
};

// --- Main App Component ---
export default function App() {
    // --- State Management ---
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [activeFilter, setActiveFilter] = useState('weekly');
    const [aiSummary, setAiSummary] = useState({ loading: false, content: '', visible: false });
    const [modal, setModal] = useState({ visible: false, title: '', content: '', loading: false });

    // --- Refs for Charts ---
    const hrTrendChartRef = useRef(null);
    const hrZonesChartRef = useRef(null);
    const hrTrendChartInstance = useRef(null);
    const hrZonesChartInstance = useRef(null);

    // --- Mock Data ---
    const generateChartData = (days) => {
        const data = [];
        const endDate = new Date('2025-10-08T22:44:00');
        for (let i = 0; i < days * 24; i++) {
            const date = new Date(endDate);
            date.setHours(endDate.getHours() - i);
            const resting = 65 + Math.sin(i / 10) * 5 + Math.random() * 5;
            data.push({ x: date, y: resting });
        }
        return data.reverse();
    };
    const weeklyData = generateChartData(7);
    const monthlyData = generateChartData(30);

    // --- Effects ---

    // Effect for updating time and date
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' };
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' };
            setCurrentTime(now.toLocaleTimeString('en-IN', timeOptions));
            setCurrentDate(now.toLocaleDateString('en-IN', dateOptions));
        };
        updateTime();
        const timerId = setInterval(updateTime, 1000);
        return () => clearInterval(timerId);
    }, []);

    // Effect for rendering HR Trend Chart
    useEffect(() => {
        if (!hrTrendChartRef.current) return;
        
        if (hrTrendChartInstance.current) {
            hrTrendChartInstance.current.destroy();
        }

        const data = activeFilter === 'weekly' ? weeklyData : monthlyData;
        const ctx = hrTrendChartRef.current.getContext('2d');
        hrTrendChartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Heart Rate',
                    data: data,
                    borderColor: '#059669',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { type: 'time', time: { unit: 'day' }, grid: { display: false } },
                    y: { beginAtZero: false, grid: { color: '#e5e7eb' } }
                },
                plugins: { legend: { display: false } }
            }
        });

    }, [activeFilter, weeklyData, monthlyData]);

    // Effect for rendering HR Zones Chart
    useEffect(() => {
        if (!hrZonesChartRef.current) return;
        if (hrZonesChartInstance.current) {
            hrZonesChartInstance.current.destroy();
        }
        const ctx = hrZonesChartRef.current.getContext('2d');
        hrZonesChartInstance.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Resting', 'Active', 'Elevated'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: ['#10B981', '#F59E0B', '#F97316'],
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: { legend: { display: false }, tooltip: { enabled: true } }
            }
        });
    }, []);
    
    // --- API Call Logic ---
    const callGeminiAPI = async (userQuery, systemPrompt) => {
        // NOTE: An API key is not required for gemini-2.5-flash-preview-05-20.
        // If you use a different model, you will need to provide a key.
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API error: ${response.statusText}`);

            const result = await response.json();
            const candidate = result.candidates?.[0];
            if (candidate?.content?.parts?.[0]?.text) {
                return candidate.content.parts[0].text;
            }
            return "Sorry, I couldn't generate a response. Please try again.";
        } catch (error) {
            console.error("Gemini API call failed:", error);
            return "An error occurred while contacting the AI. Please check the console.";
        }
    };

    // --- Event Handlers ---
    const handleGetAiSummary = async () => {
        setAiSummary({ loading: true, content: '', visible: true });

        const dashboardData = "My average resting heart rate this week was 68 BPM. My heart rate variability was 54ms. The system detected 2 potential anomaly events.";
        const systemPrompt = "You are a helpful and encouraging wellness assistant. Provide a brief, personalized, non-medical summary based on user data. Your advice should be positive and safe. Include a clear disclaimer at the end that this is not medical advice. Format the response with a title, a short paragraph, 2-3 bullet points for suggestions, and the disclaimer.";
        const userQuery = `Please provide a health summary based on this data: ${dashboardData}`;

        const responseText = await callGeminiAPI(userQuery, systemPrompt);
        setAiSummary({ loading: false, content: responseText, visible: true });
    };

    const handleLearnMore = async (anomaly) => {
        setModal({ visible: true, title: `About ${anomaly}`, content: '', loading: true });

        const systemPrompt = "You are a health information assistant. Explain a cardiovascular term in simple, easy-to-understand language. DO NOT provide any diagnosis, medical advice, or treatment. Mention common, non-medical factors that might influence it. End with a strong disclaimer to consult a healthcare professional as this is for educational purposes only.";
        const userQuery = `Please explain what "${anomaly}" means in a general wellness context.`;

        const responseText = await callGeminiAPI(userQuery, systemPrompt);
        setModal({ visible: true, title: `About ${anomaly}`, content: responseText, loading: false });
    };

    const closeModal = () => {
        setModal({ ...modal, visible: false });
    };
    
    // --- JSX ---
    return (
      <>
        {/* Global Styles */}
        <style>{`
          body { font-family: 'Inter', sans-serif; background-color: #F8F7F4; color: #3D3B37; }
          .main-chart-container { position: relative; width: 100%; height: 350px; max-height: 40vh; }
          .secondary-chart-container { position: relative; width: 100%; max-width: 300px; margin: auto; height: 250px; max-height: 30vh; }
          .filter-btn.active { background-color: #047857; color: white; }
          .loader { border: 4px solid #f3f3f3; border-top: 4px solid #047857; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex-col hidden md:flex">
                <div className="flex items-center gap-2 p-4 border-b">
                    <Icon name="heart-pulse" className="w-8 h-8 text-red-400" />
                    <span className="text-2xl font-bold text-gray-800">BeatSync</span>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-white bg-red-400 rounded-lg">
                        <Icon name="layout-dashboard" className="w-5 h-5" /> Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Icon name="history" className="w-5 h-5" /> History
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Icon name="user" className="w-5 h-5" /> Profile
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Icon name="settings" className="w-5 h-5" /> Settings
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 border-b">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">Welcome Back, User</h1>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="font-medium text-gray-700">{currentTime}</p>
                                <p className="text-sm text-gray-500">{currentDate}</p>
                            </div>
                            <Icon name="user-circle" className="w-10 h-10 text-gray-400" />
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
                           <div className="bg-emerald-100 p-3 rounded-full"><Icon name="activity" className="w-8 h-8 text-emerald-600"/></div>
                           <div>
                               <p className="text-sm text-gray-500">Avg. Heart Rate</p>
                               <p className="text-3xl font-bold text-gray-800">72 <span className="text-base font-normal">BPM</span></p>
                           </div>
                       </div>
                       <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
                           <div className="bg-blue-100 p-3 rounded-full"><Icon name="trending-down" className="w-8 h-8 text-blue-600"/></div>
                           <div>
                               <p className="text-sm text-gray-500">Avg. Resting HR (7d)</p>
                               <p className="text-3xl font-bold text-gray-800">68 <span className="text-base font-normal">BPM</span></p>
                           </div>
                       </div>
                       <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
                           <div className="bg-purple-100 p-3 rounded-full"><Icon name="bar-chart-horizontal" className="w-8 h-8 text-purple-600"/></div>
                           <div>
                               <p className="text-sm text-gray-500">Heart Rate Variability</p>
                               <p className="text-3xl font-bold text-gray-800">54 <span className="text-base font-normal">ms</span></p>
                           </div>
                       </div>
                        <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
                           <div className="bg-red-100 p-3 rounded-full"><Icon name="shield-alert" className="w-8 h-8 text-red-600"/></div>
                           <div>
                               <p className="text-sm text-gray-500">Anomaly Events (7d)</p>
                               <p className="text-3xl font-bold text-gray-800">2</p>
                           </div>
                       </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                             <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-700">Heart Rate Trends</h2>
                                <div>
                                    <button onClick={() => setActiveFilter('weekly')} className={`filter-btn text-sm px-3 py-1 rounded-md bg-gray-200 text-gray-700 transition ${activeFilter === 'weekly' ? 'active' : ''}`}>Weekly</button>
                                    <button onClick={() => setActiveFilter('monthly')} className={`filter-btn text-sm px-3 py-1 rounded-md bg-gray-200 text-gray-700 transition ${activeFilter === 'monthly' ? 'active' : ''}`}>Monthly</button>
                                </div>
                            </div>
                            <div className="main-chart-container">
                                <canvas ref={hrTrendChartRef}></canvas>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                             <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">Daily HR Zones</h2>
                             <div className="secondary-chart-container">
                                 <canvas ref={hrZonesChartRef}></canvas>
                             </div>
                             <div className="mt-4 text-sm text-gray-600 space-y-2">
                                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span>Resting</span> <strong>65%</strong></div>
                                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span>Active</span> <strong>25%</strong></div>
                                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span>Elevated</span> <strong>10%</strong></div>
                             </div>
                        </div>
                    </div>

                    {/* AI & Anomaly Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon name="brain-circuit" className="w-8 h-8 text-red-400" />
                                <h2 className="text-lg font-semibold text-gray-700">AI Health Summary</h2>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">Get a personalized, non-medical summary of your recent activity and wellness tips powered by Gemini.</p>
                            <button onClick={handleGetAiSummary} className="bg-red-400 text-white font-bold py-2 px-5 rounded-lg hover:bg-emerald-700 transition-colors w-full flex items-center justify-center gap-2">
                                <Icon name="sparkles" className="w-5 h-5" /> Generate My Summary
                            </button>
                            {aiSummary.visible && (
                                <div className="mt-4 text-left">
                                    {aiSummary.loading ? (
                                        <div className="flex justify-center items-center py-4"><div className="loader"></div></div>
                                    ) : (
                                        <div className="p-4 bg-emerald-50 rounded-lg text-red-400 text-sm whitespace-pre-wrap">{aiSummary.content}</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <Icon name="history" className="w-8 h-8 text-red-600" />
                                <h2 className="text-lg font-semibold text-gray-700">Recent Anomaly Log</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start justify-between p-3 bg-red-50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-semibold text-red-800">Potential Tachycardia</p>
                                        <p className="text-sm text-red-600">October 7, 2025, 3:15 PM</p>
                                        <p className="font-bold text-red-700 mt-1">125 BPM</p>
                                    </div>
                                    <button onClick={() => handleLearnMore('Tachycardia')} className="text-sm text-emerald-700 font-semibold flex items-center gap-1 hover:text-emerald-800">
                                        <Icon name="sparkles" className="w-4 h-4" />Learn More
                                    </button>
                                </div>
                                <div className="flex items-start justify-between p-3 bg-red-50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-semibold text-red-800">Irregular Pattern Detected</p>
                                        <p className="text-sm text-red-600">October 5, 2025, 8:42 AM</p>
                                        <p className="font-bold text-red-700 mt-1">--</p>
                                    </div>
                                    <button onClick={() => handleLearnMore('Irregular Heart Pattern')} className="text-sm text-emerald-700 font-semibold flex items-center gap-1 hover:text-emerald-800">
                                        <Icon name="sparkles" className="w-4 h-4" />Learn More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>

        {/* Anomaly Info Modal */}
        {modal.visible && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div onClick={closeModal} className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"></div>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 p-6 relative transition-all duration-300 ease-in-out transform">
                    <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <Icon name="x" className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                        <Icon name="info" className="w-8 h-8 text-emerald-600" />
                        <h2 className="text-xl font-bold text-gray-800">{modal.title}</h2>
                    </div>
                    <div>
                        {modal.loading ? (
                            <div className="flex justify-center items-center py-8"><div className="loader"></div></div>
                        ) : (
                            <div className="text-gray-600 text-sm space-y-3 whitespace-pre-wrap">{modal.content}</div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </>
    );
}

