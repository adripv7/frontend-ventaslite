import { useState } from 'react';
import { Download, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { reportsApi } from '../api/reportsApi';
import type { ReportFilters } from '../types';
import { downloadBlob } from '../../../shared/utils/download';

interface Props {
  filters: ReportFilters;
  section: string;
  label?: string;
  topProductsBy?: 'amount' | 'units';
}

export function CsvExportButton({ filters, section, label = 'Exportar CSV', topProductsBy }: Props) {
  const [loading, setLoading] = useState(false);

  async function exportReport() {
    setLoading(true);
    try {
      const blob = await reportsApi.exportCsv(section, filters, topProductsBy);
      downloadBlob(blob, `ventaslite-${section}-${filters.from}-${filters.to}.csv`);
      toast.success('Reporte CSV descargado.');
    } catch {
      toast.error('No se pudo exportar el reporte. Verifica tu conexión e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="report-outline-button" disabled={loading} onClick={exportReport} type="button">
      {loading ? <LoaderCircle className="animate-spin" size={15} /> : <Download size={15} />}
      <span>{label}</span>
    </button>
  );
}
