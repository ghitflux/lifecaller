import QueueList from "@/widgets/QueueList";
import { forward } from "@/services/atendimentos";
import ImportBox from "@/components/ImportBox";
import { useAuth } from "@/hooks/useAuth";

export default function FechamentoPage(){
  const { isIn } = useAuth();
  return (
    <div className="space-y-4">
      {(isIn("gerente") || isIn("admin")) && <ImportBox onDone={()=>location.reload()} />}
      <QueueList
        queue="gerente"
        title="Fechamento (Gerente)"
        actionsFor={(it)=>([
          { label: "Formalizar e ir p/ Docs", variant: "primary", onClick: async()=>{ await forward(it.id, {contrato_formalizado:true, note:"Formalizado"}); location.reload(); } },
        ])}
      />
    </div>
  );
}
