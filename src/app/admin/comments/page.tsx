import { Check, X, MessageSquare, AlertCircle } from "lucide-react";

export default function ModerationQueuePage() {
  const pendingComments = [
    {
      id: "1",
      postTitle: "Transfer Rumours: Mbappe's Next Destination",
      author: "Guest",
      content: "I really don't think he's going to Madrid. The financials don't make sense anymore.",
      date: "10 mins ago"
    },
    {
      id: "2",
      postTitle: "UCL Semi-Finals Preview",
      author: "FootballFan99",
      content: "This tactical analysis is spot on. The double pivot will be the key to breaking their press.",
      date: "1 hour ago"
    },
    {
      id: "3",
      postTitle: "Rise of Defensive Midfielders",
      author: "Guest",
      content: "Great article! Can we get a similar breakdown for modern fullbacks?",
      date: "3 hours ago"
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <header className="h-16 border-b bg-card flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight">Comment Moderation</h1>
          <span className="flex items-center justify-center bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {pendingComments.length} Pending
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>Pending Review.</strong> Guest comments require explicit approval before they are visible on the public feed.
            </div>
          </div>

          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            {pendingComments.length > 0 ? (
              <div className="divide-y divide-border">
                {pendingComments.map((comment: any) => (
                  <div key={comment.id} className="p-6 flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{comment.author}</span>
                          <span className="text-muted-foreground text-xs">• {comment.date}</span>
                        </div>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {comment.postTitle}
                        </span>
                      </div>
                      <p className="text-sm text-foreground bg-muted/30 p-4 rounded-lg border border-border/50">
                        {comment.content}
                      </p>
                    </div>
                    
                    <div className="flex sm:flex-col gap-2 shrink-0 sm:w-32">
                      <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-semibold transition-colors">
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white px-4 py-2 text-sm font-semibold transition-colors">
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-bold">All caught up!</h3>
                <p className="text-sm mt-1">There are no pending comments to review.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
