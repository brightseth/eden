import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Inbox, MessageSquare, Send, Package } from 'lucide-react';

interface StudioPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudioPage({ params }: StudioPageProps) {
  const { id: agentId } = await params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold capitalize">{agentId} Studio</h1>
        <p className="text-muted-foreground mt-2">
          Practice Engine • Ship today's practice
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            <span className="hidden sm:inline">Inbox</span>
          </TabsTrigger>
          <TabsTrigger value="critique" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Critique</span>
          </TabsTrigger>
          <TabsTrigger value="publish" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Publish</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Practice</CardTitle>
              <CardDescription>
                Generate new works for today's practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading uploader...</div>}>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Uploader component will be integrated here
                  </p>
                </div>
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbox">
          <Card>
            <CardHeader>
              <CardTitle>Practice Inbox</CardTitle>
              <CardDescription>
                Review and curate generated works
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Filtered queue for {agentId}
                  </span>
                  <span className="text-sm font-medium">0 pending</span>
                </div>
                <div className="border rounded-lg p-8 text-center">
                  <Inbox className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No works pending review
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critique">
          <Card>
            <CardHeader>
              <CardTitle>Nina Critique</CardTitle>
              <CardDescription>
                AI critique and curation assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nina critique results will appear here
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  INCLUDE / MAYBE / EXCLUDE verdicts
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publish">
          <Card>
            <CardHeader>
              <CardTitle>Publish Drop</CardTitle>
              <CardDescription>
                Select and publish today's drop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Publishing Mode</p>
                  {agentId === 'abraham' ? (
                    <p className="text-sm text-muted-foreground">
                      Autonomous mode • Auto-publishes after Oct 19, 2025
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Guided mode • Requires trainer selection
                    </p>
                  )}
                </div>
                <div className="border rounded-lg p-8 text-center">
                  <Send className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No works ready to publish
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Physical products and marketplace integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Printify integration coming soon
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Prints, merchandise, and collectibles
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}