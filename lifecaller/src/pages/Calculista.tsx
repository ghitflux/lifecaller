import QueueList from "@/widgets/QueueList";
import { forward } from "@/services/atendimentos";
import ImportBox from "@/components/ImportBox";
import { useAuth } from "@/hooks/useAuth";

export default function CalculistaPage(){
  const { isIn } = useAuth();
  return (
    <div className="space-y-4">
      {(isIn("calculista") || isIn("admin")) && <ImportBox onDone={()=>location.reload()} />}
      <QueueList
        queue="calculista"
        title="Fila do Calculista"
        actionsFor={(it)=>([
          { label: "Devolver (Pós-Sim)", variant: "primary", onClick: async()=>{ await forward(it.id, {note:"Simulação concluída"}); location.reload(); } }
        ])}
      />
    </div>
  );
}
