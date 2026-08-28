import { useStore } from '@/store/useStore';
import { escalations as seedEscalations, people, subsidiaries } from '@/data/mockData';
import { formatCurrency } from '@/services/api';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export function EscalationsList() {
  const customEscalations = useStore((s) => s.customEscalations);
  const allEscalations = [...customEscalations, ...seedEscalations];

  return (
    <div className="space-y-3">
      {allEscalations.map((esc) => {
        const person = people.find((p) => p.id === esc.fromPersonId);
        const sub = subsidiaries.find((s) => s.id === esc.fromSubsidiaryId);
        return (
          <div key={esc.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${
                    esc.priority === 'high' ? 'bg-error/10 text-error' :
                    esc.priority === 'medium' ? 'bg-warning/10 text-warning' :
                    'bg-info/10 text-info'
                  }`}>
                    {esc.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted">{sub?.shortName}</span>
                </div>
                <h4 className="font-semibold mt-1.5">{esc.title}</h4>
              </div>
              <span className={`badge ${
                esc.status === 'open' ? 'bg-warning/10 text-warning' :
                esc.status === 'acknowledged' ? 'bg-info/10 text-info' :
                'bg-success/10 text-success'
              }`}>
                {esc.status === 'open' && <Clock size={12} />}
                {esc.status === 'acknowledged' && <AlertCircle size={12} />}
                {esc.status === 'resolved' && <CheckCircle2 size={12} />}
                {esc.status.charAt(0).toUpperCase() + esc.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-muted">{esc.description}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted">
              <span>From: {person?.name}</span>
              <span>•</span>
              <span>{esc.date}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
