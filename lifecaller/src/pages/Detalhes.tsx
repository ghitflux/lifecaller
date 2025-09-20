import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItem, listEvents, addNote, forward, claim, releaseItem } from "@/services/atendimentos";
import { listAttachments, uploadAttachment } from "@/services/attachments";
import { useAuth } from "@/hooks/useAuth";
import { NoteInput } from "@/design-system/components/NoteInput";
import { Card } from "@/design-system/components/Card";
import SimuladorModal from "@/components/SimuladorModal";

export default function DetalhesPage(){
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const { isIn } = useAuth();
  const [openSim, setOpenSim] = useState(false);

  const load = async() => {
    const [it, ev, at] = await Promise.all([getItem(id!), listEvents(id!), listAttachments(id!)]);
    setItem(it); setEvents(ev); setFiles(at.results || at);
  };
  useEffect(()=>{ load(); }, [id]);

  const can = item?.available_actions || {};

  const doForward = async(payload:any)=>{ await forward(id!, payload); await load(); };
  const doClaim = async()=>{ await claim(id!); await load(); };
  const doRelease = async()=>{ await releaseItem(id!); await load(); };

  const onUpload = async(f:File)=>{ await uploadAttachment(id!, f); await load(); };
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Detalhes do Atendimento</div>

      {item && (
        <Card className="space-y-2">
          <div><b>CPF:</b> {item.cpf} · <b>Matrícula:</b> {item.matricula} · <b>Banco (principal):</b> {item.banco}</div>
          <div><b>Etapa:</b> {item.status_label} · <b>Assigned:</b> {item.assigned_username||"-"}</div>
          <div><b>Simulação:</b> {item.simulacao_status||"-"} · <b>Eventos:</b> {events.length} · <b>Simulações:</b> {item.simulacoes_count}</div>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            {can.can_claim && <button onClick={doClaim} className="h-9 px-3 rounded-xl2 bg-[var(--brand)] text-black">Pegar</button>}
            {can.can_release && <button onClick={doRelease} className="h-9 px-3 rounded-xl2 bg-transparent border border-[var(--stroke)]">Liberar</button>}

            {item.stage==="calculista" && (
              <button
                onClick={() => setOpenSim(true)}
                className="h-9 px-3 rounded-xl2 bg-[var(--brand)] text-black"
              >
                Abrir Simulador
              </button>
            )}
            {can.can_forward && item.stage==="atendente" && (
              <button onClick={()=>doForward({note:"Para simulação"})} className="h-9 px-3 rounded-xl2 bg-[var(--brand)] text-black">Enviar p/ Calculista</button>
            )}
            {can.can_forward && item.stage==="calculista" && (
              <button onClick={()=>doForward({note:"Devolvendo ao atendente (pós-sim)"})} className="h-9 px-3 rounded-xl2 bg-[var(--brand)] text-black">Devolver (Pós-Sim)</button>
            )}
            {can.can_forward && item.stage==="atendente_pos_sim" && (
              <>
                <button onClick={()=>doForward({approved:true, note:"Cliente aprovou"})} className="h-9 px-3 rounded-xl2 bg-[var(--brand)] text-black">Aprovar e Enviar p/ Fechamento</button>
                <button onClick={()=>doForward({approved:false, note:"Cliente não aprovou"})} className="h-9 px-3 rounded-xl2 bg-transparent border border-[var(--stroke)]">Registrar Não Aprovado</button>
              </>
            )}
            {can.can_forward && item.stage==="gerente_fechamento" && (
              <button onClick={()=>doForward({contrato_formalizado:true, note:"Formalizado"})} className="h-9 px-3 rounded-xl2 bg-[var(--brand)] text-black">Formalizar → Docs</button>
            )}
            {can.can_forward && item.stage==="atendente_docs" && (
              <button onClick={()=>doForward({note:"Enviar p/ Financeiro"})} className="h-9 px-3 rounded-xl2 bg-[var(--brand)] text-black">Enviar p/ Financeiro</button>
            )}
            {can.can_forward && item.stage==="financeiro" && (
              <button onClick={()=>doForward({note:"Finalizar contrato"})} className="h-9 px-3 rounded-xl2 bg-[var(--brand)] text-black">Finalizar → Supervisão</button>
            )}
          </div>
        </Card>
      )}

      {/* Ramificações banco+competência */}
      {item?.lancamentos?.length ? (
        <Card className="space-y-2">
          <div className="font-semibold">Bancos / Competências</div>
          <table className="w-full text-sm">
            <thead><tr className="text-left opacity-80"><th>Banco</th><th>Competência</th><th>Importado em</th></tr></thead>
            <tbody>
              {item.lancamentos.map((l:any)=>(
                <tr key={l.id} className="border-t border-[var(--stroke)]">
                  <td>{l.banco}</td>
                  <td>{l.competencia}</td>
                  <td>{new Date(l.imported_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : null}

      {/* Anexos */}
      <Card className="space-y-3">
        <div className="font-semibold">Anexos</div>
        <div className="flex items-center gap-2">
          <input type="file" onChange={async e=>{ const f=e.target.files?.[0]; if(f) await onUpload(f);} } />
          <span className="text-sm opacity-80">PDF/JPG/PNG até 20MB</span>
        </div>
        <ul className="text-sm list-disc pl-4">
          {files.map((f:any)=>(
            <li key={f.id}><a className="underline" href={f.file} target="_blank" rel="noreferrer">{f.name || f.file}</a> — {new Date(f.created_at).toLocaleString()}</li>
          ))}
        </ul>
      </Card>

      {/* Timeline */}
      <Card className="space-y-3">
        <div className="font-semibold">Histórico de Tratativas</div>
        <div className="space-y-2">
          {events.map((e)=>(
            <div key={e.id} className="text-sm opacity-90">
              <div className="opacity-80">{new Date(e.created_at).toLocaleString()}</div>
              <div><b>{e.actor_username||"—"}</b>: {e.note||`${e.from_stage}→${e.to_stage}`}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Nota rápida */}
      <Card className="space-y-2">
        <div className="font-semibold">Nova anotação</div>
        <NoteInput onSubmit={async (t)=>{ await addNote(id!, t); await load(); }}/>
      </Card>

      <SimuladorModal id={id!} open={openSim} onClose={() => setOpenSim(false)} />
    </div>
  );
}
