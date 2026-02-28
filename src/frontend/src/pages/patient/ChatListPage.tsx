import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { SAMPLE_DOCTORS } from "@/data/mockData";
import { Link } from "@tanstack/react-router";
import { ChevronRight, MessageSquare } from "lucide-react";

export default function ChatListPage() {
  // Show sample conversations with doctors
  const conversations = SAMPLE_DOCTORS.filter(
    (d) => d.verificationStatus === "approved",
  ).slice(0, 5);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Messages
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chat securely with your doctors
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No conversations yet</p>
          <p className="text-xs text-muted-foreground">
            Book an appointment to start chatting
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((doc) => (
            <Link
              key={doc.id}
              to="/patient/chat/$doctorId"
              params={{ doctorId: doc.id }}
            >
              <Card className="shadow-card card-hover hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/15 text-primary font-bold">
                        {doc.name.split(" ").slice(-1)[0]?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">
                        {doc.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doc.specialty}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
