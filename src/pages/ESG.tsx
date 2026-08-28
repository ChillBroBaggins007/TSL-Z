import { useState } from 'react';
import { conservationProjects } from '@/data/mockData';
import { RoleGuard } from '@/components/Guards';
import { SectionHeader, RAGPill } from '@/components/ui';
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip,
  RadialBarChart, RadialBar, PolarAngleAxis,
} from 'recharts';
import { Leaf, Users, GraduationCap, TreePine, Sun, Droplets, TrendingDown, Award } from 'lucide-react';

export default function ESG() {
  const [filter, setFilter] = useState<'all' | 'Conservation' | 'Community' | 'Education' | 'Environment'>('all');

  const emissionsData = [
    { year: '2021', value: 5200 }, { year: '2022', value: 4900 },
    { year: '2023', value: 4600 }, { year: '2024', value: 4500 },
    { year: '2025', value: 4200 },
  ];

  const safetyData = [
    { year: '2021', incidents: 9 }, { year: '2022', incidents: 8 },
    { year: '2023', incidents: 7 }, { year: '2024', incidents: 7 },
    { year: '2025', incidents: 3 },
  ];

  const scorecard = [
    { name: 'Environmental', score: 78, fill: '#16a34a' },
    { name: 'Social', score: 85, fill: '#ca8a04' },
    { name: 'Governance', score: 92, fill: '#0284c7' },
  ];

  const categoryIcons: Record<string, React.ReactNode> = {
    Conservation: <TreePine size={18} />,
    Community: <Users size={18} />,
    Education: <GraduationCap size={18} />,
    Environment: <Sun size={18} />,
  };

  const filteredProjects = filter === 'all' ? conservationProjects : conservationProjects.filter((p) => p.category === filter);

  return (
    <RoleGuard allowedRoles={['chairman', 'group_ceo', 'group_cfo', 'board_member']}>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">ESG & Sustainability</h1>
          <p className="text-muted mt-1">Group sustainability scorecard and conservation initiatives</p>
        </div>

        {/* Scorecard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="card p-5">
            <SectionHeader title="ESG Scorecard" />
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart data={scorecard} innerRadius="25%" outerRadius="90%" startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="score" cornerRadius={8} background />
                <Tooltip contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {scorecard.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.fill }} />
                    <span>{s.name}</span>
                  </div>
                  <span className="font-semibold">{s.score}/100</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <SectionHeader title="Carbon Emissions" subtitle="Scope 1+2 (tCO2e)" />
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={emissionsData}>
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="rgb(var(--color-text-muted))" />
                <YAxis tick={{ fontSize: 12 }} stroke="rgb(var(--color-text-muted))" />
                <Tooltip contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-2 mt-2 text-sm text-success">
              <TrendingDown size={16} />
              <span>19% reduction since 2021</span>
            </div>
          </div>

          <div className="card p-5">
            <SectionHeader title="Safety Incidents" subtitle="Annual trend" />
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={safetyData}>
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="rgb(var(--color-text-muted))" />
                <YAxis tick={{ fontSize: 12 }} stroke="rgb(var(--color-text-muted))" />
                <Tooltip contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="incidents" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-2 mt-2 text-sm text-success">
              <TrendingDown size={16} />
              <span>57% reduction since 2024</span>
            </div>
          </div>

          <div className="card p-5">
            <SectionHeader title="Community Reach" />
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted">Farmers Trained</div>
                <div className="text-2xl font-bold">18,400</div>
              </div>
              <div>
                <div className="text-xs text-muted">Students Benefited</div>
                <div className="text-2xl font-bold">2,800</div>
              </div>
              <div>
                <div className="text-xs text-muted">Training Hours</div>
                <div className="text-2xl font-bold">4,200</div>
              </div>
              <div>
                <div className="text-xs text-muted">Active Programs</div>
                <div className="text-2xl font-bold">6</div>
              </div>
            </div>
          </div>
        </div>

        {/* Conservation & Community Initiatives */}
        <div>
          <SectionHeader
            title="Conservation & Community Initiatives"
            subtitle="Tracked projects with live progress"
          />
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(['all', 'Conservation', 'Community', 'Education', 'Environment'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  filter === cat
                    ? 'bg-primary text-white font-medium'
                    : 'bg-surface-2 text-muted hover:bg-primary-soft hover:text-primary'
                }`}
              >
                {cat === 'all' ? 'All Projects' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="card p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center text-primary shrink-0">
                    {categoryIcons[project.category]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm">{project.name}</h3>
                    <span className="text-xs text-muted">{project.location}</span>
                  </div>
                </div>
                <p className="text-sm text-muted mb-4">{project.description}</p>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        project.progress >= 80 ? 'bg-success' :
                        project.progress >= 50 ? 'bg-primary' : 'bg-warning'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="badge bg-surface-2 text-muted">{project.category}</span>
                  {project.progress >= 80 && (
                    <span className="badge bg-success/10 text-success">On Track</span>
                  )}
                  {project.progress < 60 && (
                    <span className="badge bg-warning/10 text-warning">Behind Target</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
