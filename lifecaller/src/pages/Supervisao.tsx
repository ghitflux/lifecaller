import { useEffect, useState } from "react";
import { getQueue } from "@/services/atendimentos";
import { MetricCard } from "@/design-system/components/MetricCard";
import ImportBox from "@/components/ImportBox";
import { useAuth } from "@/hooks/useAuth";

export default function SupervisaoPage(){
  const [items, setItems] = useState<any[]>([]);
  const { isIn } = useAuth();
  useEffect(()=>{ getQueue("supervisao").then(d=>setItems(d.results||d)); }, []);
  const total = items.length;
  const aprov = items.filter(i=>i.simulacao_status==="aprovada").length;
  const formal = items.filter(i=>i.contrato_formalizado).length;
  return (
    <>
      {(isIn("supervisor") || isIn("admin")) && <div className="mb-4"><ImportBox onDone={()=>location.reload()}/></div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Contratos em Supervisão" value={total}/>
        <MetricCard label="Aprovados" value={aprov}/>
        <MetricCard label="Formalizados" value={formal}/>
      </div>
    </>
  );
}
