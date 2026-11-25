import { useState, type FormEvent } from 'react';
import { LoaderCircle, Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { reportsApi } from '../api/reportsApi';
import type { AssistantAnswer, ReportFilters } from '../types';
import { getApiErrorMessage } from '../../auth/utils/apiError';

const suggestions = [
  '¿Qué sucursal tuvo menos ventas y cuál fue su total?',
  '¿Cuáles fueron los productos más vendidos por unidades?',
  'Genera un resumen ejecutivo del periodo filtrado.',
];

export function ReportAssistantPanel({ filters }: { filters: ReportFilters }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<AssistantAnswer | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask(value: string) {
    const trimmed = value.trim();
    if (trimmed.length < 8) {
      toast.error('Escribe una pregunta de al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    setAnswer(null);
    try {
      const result = await reportsApi.assistant(trimmed, filters);
      setAnswer(result);
      setQuestion('');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(question);
  }

  return (
    <section className="assistant-panel" aria-labelledby="assistant-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="assistant-icon"><Sparkles aria-hidden="true" size={21} /></span>
          <div>
            <h2 className="text-lg font-bold text-white" id="assistant-heading">Asistente analítico con IA</h2>
            <p className="mt-1 text-xs text-slate-400">Respuestas basadas en métricas agregadas del periodo · sin consultas SQL</p>
          </div>
        </div>
        <button className="assistant-summary-button" disabled={loading} onClick={() => void ask('Genera un resumen ejecutivo del periodo filtrado con las cifras principales.')} type="button">
          {loading ? <LoaderCircle className="animate-spin" size={16} /> : <Sparkles size={16} />}
          Resumen ejecutivo
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button className="assistant-suggestion" disabled={loading} key={suggestion} onClick={() => void ask(suggestion)} type="button">
            {suggestion}
          </button>
        ))}
      </div>

      <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="report-assistant-question">Pregunta sobre los reportes</label>
        <textarea
          className="assistant-question"
          id="report-assistant-question"
          maxLength={500}
          minLength={8}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Pregunta en español sobre ventas, productos, vendedores o sucursales…"
          required
          rows={2}
          value={question}
        />
        <button className="assistant-ask-button" disabled={loading || question.trim().length < 8} type="submit">
          {loading ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={17} />}
          Preguntar
        </button>
      </form>
      <p className="mt-2 text-right text-[11px] text-slate-500">{question.length}/500</p>

      {answer && (
        <div className="assistant-answer" aria-live="polite">
          <div className="assistant-answer-heading">
            <span>Respuesta</span><span className="assistant-model-tag">{answer.model}</span>
          </div>
          <div className="assistant-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer.answer}</ReactMarkdown>
          </div>
          <p className="mt-4 text-[11px] text-slate-500">Periodo consultado: {answer.filters.from} a {answer.filters.to}</p>
          {answer.usage && <p className="mt-1 text-[11px] text-slate-500">Tokens de esta consulta: {answer.usage.input_tokens.toLocaleString('es-MX')} entrada · {answer.usage.output_tokens.toLocaleString('es-MX')} salida · {answer.usage.total_tokens.toLocaleString('es-MX')} total</p>}
        </div>
      )}
    </section>
  );
}
