import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EditEquityDialog from "@/components/EditEquityDialog";
import { EditRequest, DisplayFounder } from "@/types";

interface Props {
  founderData: DisplayFounder[];
  onEditRequest: (request: EditRequest) => void;
}

export default function CapTable({ founderData, onEditRequest }: Props) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Live Cap Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Equity %</th>
                <th className="text-left p-3">Vested</th>
                <th className="text-left p-3">Cliff</th>
                <th className="text-left p-3">Tokenized</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {founderData.map((founder, i) => (
                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30">
                  <td className="p-3">{founder.name}</td>
                  <td className="p-3">{founder.role ?? "-"}</td>
                  <td className="p-3 font-medium">{founder.equity}</td>
                  <td className="p-3">{founder.vested ?? "-"}</td>
                  <td className="p-3">{founder.cliff ?? "-"}</td>
                  <td className="p-3">
                    <Badge variant={founder.tokenized === "Yes" ? "default" : "outline"}>
                      {founder.tokenized}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <EditEquityDialog founder={founder} onEditRequest={(editRequest) => console.log(editRequest)} />

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
