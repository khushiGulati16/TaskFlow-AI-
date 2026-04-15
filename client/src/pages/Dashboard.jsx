import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Activity, CheckCircle, AlertTriangle, Users, TrendingUp, Layout } from 'lucide-react';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="glass p-6 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-white/10 transition-all">
        <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('text-', 'bg-')}`}><Icon className={color} size={24} /></div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            {trend && <div className="flex items-center gap-1 text-[10px] text-green-400 mt-1"><TrendingUp size={12} /><span>{trend}</span></div>}
        </div>
    </div>
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard');
                setData(res.data);
                setLoading(false);
            } catch (err) { console.error(err); setLoading(false); }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-screen bg-[#1e1e2d]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;

    const { metrics, chartData } = data;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#1e1e2d] min-h-screen text-white overflow-y-auto">
            <header className="flex items-center justify-between">
                <div><h1 className="text-3xl font-bold">Productivity Insights</h1><p className="text-gray-400 mt-1">Real-time stats from TaskFlow AI</p></div>
                <button onClick={() => window.location.reload()} className="p-2 glass rounded-full hover:bg-white/10"><Activity size={20} className="text-primary-400" /></button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Tasks" value={metrics.totalTasks} icon={Layout} color="text-primary-400" />
                <StatCard title="Completed" value={metrics.completedTasks} icon={CheckCircle} color="text-green-400" trend={`${metrics.completionRate}% completion`} />
                <StatCard title="Overdue" value={metrics.overdueTasks} icon={AlertTriangle} color="text-red-400" />
                <StatCard title="Top Contributor" value={metrics.mostActiveMember} icon={Users} color="text-purple-400" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold mb-6">Task Distribution by List</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                                <Tooltip contentStyle={{backgroundColor: '#2a2a3c', border: 'none', borderRadius: '12px', color: '#fff'}} cursor={{fill: '#ffffff05'}} />
                                <Bar dataKey="tasks" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                                <defs><linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold mb-6">Workflow Status</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="tasks">
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: '#2a2a3c', border: 'none', borderRadius: '12px', color: '#fff'}} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
