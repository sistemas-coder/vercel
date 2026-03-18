export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
// IMPORTANTE: Faltaban estas importaciones para que no den error de "not found"
import { 
  User, 
  Settings, 
  ClipboardCheck, 
  ChevronRight, 
  BarChart3, 
  QrCode 
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/login");
  }

  // CORRECCIÓN DE TIPO: Forzamos a TS a reconocer el campo 'role'
  const user = session.user as { 
    name?: string | null; 
    email?: string | null; 
    role?: string | null 
  };
  
  const totalReportes = await prisma.reporte.count();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* BANNER DINÁMICO SEGÚN ROL */}
      <div className={`shadow-2xl transition-colors duration-500 ${
        user?.role === 'admin' ? 'bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900' : 
        user?.role === 'tecnico' ? 'bg-gradient-to-r from-orange-600 via-red-700 to-orange-600' :
        'bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-700'
      }`}>
        
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left text-white">
            <h1 className="text-4xl font-black tracking-tighter italic">
              MC<span className="text-blue-400">&</span>GE
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest backdrop-blur-md">
                Panel {user?.role || 'Usuario'}
              </span>
              <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.2em]">
                Sistema de Gestión v2.6
              </p>
            </div>
          </div>
          
          {/* PERFIL */}
          <div className="flex items-center gap-4 bg-black/20 p-2 pr-4 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center">
              <User className="text-white w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-blue-200 font-bold uppercase leading-none mb-1 tracking-tighter">
                {user?.role}
              </p>
              <p className="text-white font-bold text-sm leading-none">
                {user?.name}
              </p>
            </div>
            <button className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors text-white/70">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* MÓDULOS FILTRADOS POR ROL */}
          {(user?.role === 'admin' || user?.role === 'tecnico') && (
            <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
                <h2 className="text-xl font-bold uppercase tracking-tight">Reporte</h2>
                <ClipboardCheck className="w-6 h-6 opacity-50" />
              </div>
              <div className="p-6">
                <p className="text-slate-500 text-sm mb-4">Generar inspección técnica V08.24</p>
                <Link href="/reportes" className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold flex justify-between items-center hover:bg-blue-700 transition-all">
                  <span>NUEVO SERVICIO</span>
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-700 p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold uppercase tracking-tight">Historial</h2>
              <BarChart3 className="w-6 h-6 opacity-50" />
            </div>
            <div className="p-6">
              <div className="bg-emerald-50 p-4 rounded-2xl mb-4 border border-emerald-100">
                <span className="text-[10px] font-black text-emerald-600 uppercase">Total Registros</span>
                <div className="text-3xl font-black text-slate-800">{totalReportes}</div>
              </div>
              <Link href="/admin/reportes" className="w-full border-2 border-slate-900 text-slate-900 py-3 px-6 rounded-2xl font-bold flex justify-center hover:bg-slate-900 hover:text-white transition-all uppercase text-xs">
                Ver Archivos
              </Link>
            </div>
          </div>

          {user?.role === 'admin' && (
            <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 flex justify-between items-center text-white">
                <h2 className="text-xl font-bold uppercase tracking-tight">Scanner</h2>
                <QrCode className="w-6 h-6 opacity-50" />
              </div>
              <div className="p-6">
                <p className="text-slate-500 text-sm mb-4">Identificación de activos por QR</p>
                <Link href="/scanner" className="w-full bg-orange-500 text-white py-4 px-6 rounded-2xl font-bold flex justify-center hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">
                  ABRIR CÁMARA
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
