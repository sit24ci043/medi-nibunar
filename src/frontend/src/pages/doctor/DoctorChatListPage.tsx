import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useAppointments } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ChevronRight, MessageSquare } from "lucide-react";

export default function DoctorChatListPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const { data: appointments = [] } = useAppointments(principal);

  // Get unique patients from appointments
  const uniquePatients = [
    ...new Map(appointments.map((a) => [a.patientId.toString(), a])).values(),
  ].slice(0, 10);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Messages
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chat with your patients
        </p>
      </div>

      {uniquePatients.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No conversations yet</p>
          <p className="text-xs text-muted-foreground">
            Conversations appear when patients book appointments
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {uniquePatients.map((appt) => {
            const shortId = appt.patientId.toString().substring(0, 8);
            return (
              <Link
                key={appt.patientId.toString()}
                to="/doctor/chat/$patientId"
                params={{ patientId: appt.patientId.toString() }}
              >
                <Card className="shadow-card card-hover hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">
                          {shortId.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground">
                          Patient {shortId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last appointment: {appt.date}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
