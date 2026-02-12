import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

type Props = {
    icv: number;
    irp: number;
    imt: number;
    ivp: number;
    cit: number;
};

export default function WaisProfileChart({
    icv,
    irp,
    imt,
    ivp,
    cit
}: Props) {

    const data = [
        { name: 'ICV', value: icv },
        { name: 'IRP', value: irp },
        { name: 'IMT', value: imt },
        { name: 'IVP', value: ivp },
        { name: 'CIT', value: cit }
    ];

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">
                Perfil de puntuaciones compuestas
            </h3>

            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[40, 160]} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#000"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
