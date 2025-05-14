import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send, Edit } from "lucide-react";
import { useState } from "react";

export default function EditEquityDialog({ founder, onEdit }: any) {
  const [editRequest, setEditRequest] = useState({
    founderName: founder.name,
    currentEquity: founder.equity,
    requestedEquity: "",
    justification: ""
  });

  const handleSend = () => {
    console.log("Sending request:", editRequest);
    onEdit(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" onClick={() => onEdit(founder)}>
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle>Edit Equity Request</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={editRequest.founderName} readOnly className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current-equity" className="text-right">Current Equity</Label>
            <Input id="current-equity" value={editRequest.currentEquity} readOnly className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="requested-equity" className="text-right">Requested Equity</Label>
            <Input id="requested-equity" value={editRequest.requestedEquity} onChange={(e) => setEditRequest({ ...editRequest, requestedEquity: e.target.value })} className="col-span-3" placeholder="e.g. 40%" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="justification" className="text-right">Justification</Label>
            <Textarea id="justification" value={editRequest.justification} onChange={(e) => setEditRequest({ ...editRequest, justification: e.target.value })} className="col-span-3" rows={4} placeholder="Explain why this change is requested..." />
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" /> Send Request to Stakeholders
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
