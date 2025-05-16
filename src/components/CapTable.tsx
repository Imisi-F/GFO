import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EditEquityDialog from "@/components/EditEquityDialog";
import { EditRequest, Founder } from "@/types";

interface Props {
  founderData: Founder[];
  onEditRequest: (request: EditRequest) => void;
  onTokenizeFounder: (founder: Founder) => void;
}

export default function CapTable({ founderData, onEditRequest, onTokenizeFounder }: Props) {
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
                    {founder.tokenized ? (
                      <a
                        href={`https://stellar.expert/explorer/testnet/account/${founder.publicKey}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline"
                      >
                        <Badge variant="default" className="cursor-pointer hover:underline">
                          Tokenized
                        </Badge>
                      </a>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </td>
                  <td className="p-3 space-y-2">
                    <EditEquityDialog
                      founder={founder}
                      onEditRequest={(editRequest) => onEditRequest(editRequest)}
                    />
                    {!founder.tokenized && (
                      <button
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => onTokenizeFounder(founder)}
                      >
                        Tokenize
                      </button>
                    )}
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
