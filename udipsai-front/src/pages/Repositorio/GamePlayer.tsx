import React from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Info } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";

const GAMES_CONFIG: Record<string, string> = {
    estimulacion: "https://proyecto-vinculacion.vercel.app/",
    palabras: "https://sistemajuegodepalabras.vercel.app/",
};

const GamePlayer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const gameUrl = id ? GAMES_CONFIG[id] : undefined;
    const gameTitle = id === "estimulacion" ? "Estimulación Cognitiva" : id === "palabras" ? "Juego de Palabras" : "Juego";

    if (!gameUrl) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-gray-500 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/[0.05] p-12">
                <Info size={48} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Juego no encontrado</h2>
                <p className="mb-6">Lo sentimos, el juego que buscas no existe o no está disponible.</p>
                <Button onClick={() => navigate("/juegos")}>Volver a Juegos</Button>
            </div>
        );
    }

    return (
        <>
            <PageMeta
                title={`${gameTitle} | UDIPSAI`}
                description={`Jugando a ${gameTitle}`}
            />

            <div className="mb-6 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate("/juegos")}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        title="Volver"
                    >
                        <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                        {gameTitle}
                    </h2>
                </div>
                <div className="text-xs text-gray-400 italic">
                    Modo Pantalla Completa disponible en el reproductor
                </div>
            </div>

            <div className="w-full h-[calc(100vh-180px)] bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-white/[0.05] overflow-hidden">
                <iframe
                    src={gameUrl}
                    title={`Juego ${id}`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </>
    );
};

export default GamePlayer;
