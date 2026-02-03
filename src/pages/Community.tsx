import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, MessageSquare, ThumbsUp, Bot, User, Clock, Sparkles } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast';

interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  upvotes: number;
  created_at: string;
  answers?: CommunityAnswer[];
}

interface CommunityAnswer {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_ai_answer: boolean;
  upvotes: number;
  created_at: string;
}

const Community: React.FC = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatingAI, setGeneratingAI] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    
    // Load posts
    const { data: postsData, error: postsError } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsError || !postsData) {
      setLoading(false);
      return;
    }

    // Load answers for each post
    const { data: answersData } = await supabase
      .from('community_answers')
      .select('*')
      .order('created_at', { ascending: true });

    // Combine posts with their answers
    const postsWithAnswers: CommunityPost[] = (postsData as any[]).map((post: any) => ({
      ...post,
      answers: ((answersData as any[]) || []).filter((answer: any) => answer.post_id === post.id)
    }));

    setPosts(postsWithAnswers);
    setLoading(false);
  };

  const generateAIAnswer = async (post: CommunityPost) => {
    setGeneratingAI(post.id);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate contextual AI answer based on category and content
    let aiAnswer = '';
    
    if (post.category === 'pest') {
      aiAnswer = `Based on your description, here are my recommendations for pest control:\n\n1. **Identification**: The symptoms you describe are typical of ${post.content.toLowerCase().includes('aphid') ? 'aphid' : 'common pest'} infestation.\n\n2. **Organic Solution**: Apply neem oil spray (5ml per liter of water) early morning or evening. Repeat every 7 days for 3 weeks.\n\n3. **Biological Control**: Introduce natural predators like ladybugs which feed on aphids.\n\n4. **Cultural Practices**: Remove affected plant parts and maintain proper spacing for air circulation.\n\n5. **Monitoring**: Check plants daily and act quickly if infestation spreads.\n\nIf the problem persists after 2 weeks, consider consulting a local agricultural extension officer for chemical treatment options.`;
    } else if (post.category === 'irrigation') {
      aiAnswer = `Here's my advice on irrigation management:\n\n1. **Timing**: Water early morning (6-8 AM) or late evening (6-8 PM) to minimize evaporation.\n\n2. **Frequency**: For your crop, water every 3-4 days during vegetative stage, increasing to every 2-3 days during flowering.\n\n3. **Method**: Drip irrigation is most efficient, saving 30-50% water compared to flood irrigation.\n\n4. **Soil Moisture**: Maintain 60-70% soil moisture for optimal growth. Use a moisture meter or the finger test.\n\n5. **Weather Consideration**: Reduce watering during rainy periods and increase during hot, dry spells.\n\nProper irrigation scheduling can increase yield by 20-30% while conserving water resources.`;
    } else if (post.category === 'fertilizer') {
      aiAnswer = `Fertilizer recommendations for your situation:\n\n1. **Soil Testing**: First, conduct a soil test to determine exact nutrient deficiencies.\n\n2. **NPK Ratio**: For vegetative growth, use 20-10-10 (N-P-K). For flowering/fruiting, switch to 10-20-20.\n\n3. **Application Schedule**:\n   - Base dose: Apply at sowing/transplanting\n   - First top dressing: 30 days after sowing\n   - Second top dressing: 60 days after sowing\n\n4. **Organic Options**: Compost (5 tons/acre), vermicompost (2 tons/acre), or green manure crops.\n\n5. **Micronutrients**: Foliar spray of zinc, iron, and boron if deficiency symptoms appear.\n\nRemember: Over-fertilization can harm crops and pollute groundwater. Follow recommended doses.`;
    } else if (post.content.toLowerCase().includes('transplant') || post.content.toLowerCase().includes('rice')) {
      aiAnswer = `Regarding rice transplanting in Punjab:\n\n1. **Optimal Timing**: Mid-June to early July is ideal for Punjab region. This coincides with monsoon onset.\n\n2. **Seedling Age**: Transplant 25-30 day old seedlings for best results.\n\n3. **Weather Considerations**: \n   - Wait for at least 2-3 good rainfall events\n   - Soil should have adequate moisture\n   - Avoid transplanting during extreme heat\n\n4. **Preparation**: Ensure field is properly puddled and leveled before transplanting.\n\n5. **Spacing**: Maintain 20cm x 15cm spacing for optimal yield.\n\n6. **Water Management**: Keep 2-3 cm standing water for first 2 weeks after transplanting.\n\nCurrent weather patterns suggest waiting another week for better soil moisture conditions.`;
    } else {
      aiAnswer = `Thank you for your question. Here's my analysis:\n\n1. **Understanding the Issue**: ${post.content.substring(0, 100)}... requires careful consideration of multiple factors.\n\n2. **Best Practices**:\n   - Monitor your crops daily for any changes\n   - Maintain detailed records of all farming activities\n   - Consult with local agricultural experts\n\n3. **Preventive Measures**:\n   - Follow crop rotation practices\n   - Use quality seeds from certified sources\n   - Maintain soil health through organic matter addition\n\n4. **Resources**: Contact your local Krishi Vigyan Kendra (KVK) for region-specific guidance.\n\n5. **Community Support**: Other farmers in this community may have faced similar challenges. Their practical experience can be invaluable.\n\nFeel free to provide more details if you need specific guidance on any aspect.`;
    }

    // Save AI answer to database
    const { error } = await supabase
      .from('community_answers')
      .insert([{
        post_id: post.id,
        user_id: 'ai-assistant',
        content: aiAnswer,
        is_ai_answer: true,
        upvotes: 0
      }] as any);

    if (!error) {
      toast({
        title: '🤖 AI Expert Answer Generated',
        description: 'The AI has provided a detailed response to this question',
      });
      loadPosts();
    }

    setGeneratingAI(null);
  };

  const createPost = async () => {
    if (!title || !content) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both title and content',
        variant: 'destructive',
      });
      return;
    }

    const { data, error } = await supabase
      .from('community_posts')
      .insert([{
        user_id: 'mock-user-id',
        title,
        content,
        category,
        upvotes: 0
      }] as any)
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Question Posted',
      description: 'Your question has been posted. AI Expert will answer shortly!',
    });

    // Reset form
    setTitle('');
    setContent('');
    setCategory('general');
    setDialogOpen(false);

    // Reload posts
    loadPosts();

    // Auto-generate AI answer after 3 seconds
    if (data) {
      const postData = data as any;
      setTimeout(() => {
        generateAIAnswer({ ...postData, answers: [] } as CommunityPost);
      }, 3000);
    }
  };

  const handleUpvote = async (postId: string, currentUpvotes: number) => {
    try {
      await (supabase as any)
        .from('community_posts')
        .update({ upvotes: currentUpvotes + 1 })
        .eq('id', postId);

      loadPosts();
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-blue-100 text-blue-800',
      pest: 'bg-red-100 text-red-800',
      irrigation: 'bg-cyan-100 text-cyan-800',
      fertilizer: 'bg-purple-100 text-purple-800',
      harvest: 'bg-green-100 text-green-800',
      equipment: 'bg-orange-100 text-orange-800',
      weather: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || colors.general;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      general: '💬',
      pest: '🐛',
      irrigation: '💧',
      fertilizer: '🧪',
      harvest: '🌾',
      equipment: '🚜',
      weather: '🌤️'
    };
    return icons[category] || '💬';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Community Q&A</h1>
            <p className="text-muted-foreground">Ask questions and get expert answers from AI and fellow farmers</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" />
                Ask Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ask the Community</DialogTitle>
                <DialogDescription>
                  Post your farming question and get answers from AI Expert and community members
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Question Title *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., How to control aphids on wheat crop?"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">💬 General</SelectItem>
                      <SelectItem value="pest">🐛 Pest Control</SelectItem>
                      <SelectItem value="irrigation">💧 Irrigation</SelectItem>
                      <SelectItem value="fertilizer">🧪 Fertilizer</SelectItem>
                      <SelectItem value="harvest">🌾 Harvest</SelectItem>
                      <SelectItem value="equipment">🚜 Equipment</SelectItem>
                      <SelectItem value="weather">🌤️ Weather</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Question Details *</Label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe your farming challenge in detail..."
                    rows={6}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>AI Expert will automatically answer your question within 3 seconds!</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={createPost} className="flex-1 bg-primary hover:bg-primary/90">
                  Post Question
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading community posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card className="border-none shadow-md">
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-semibold mb-2">No Questions Yet</p>
              <p className="text-sm text-muted-foreground">Be the first to ask a question!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">Farmer Singh</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                      <CardDescription className="text-base whitespace-pre-wrap">
                        {post.content}
                      </CardDescription>
                    </div>
                    <Badge className={getCategoryColor(post.category)}>
                      {getCategoryIcon(post.category)} {post.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upvote Button */}
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpvote(post.id, post.upvotes)}
                      className="gap-2"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {post.upvotes} Helpful
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="w-4 h-4" />
                      {post.answers?.length || 0} Answers
                    </div>
                  </div>

                  {/* Answers */}
                  {post.answers && post.answers.length > 0 ? (
                    <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                      {post.answers.map((answer) => (
                        <div key={answer.id} className={`p-4 rounded-lg ${answer.is_ai_answer ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200' : 'bg-accent/50'}`}>
                          <div className="flex items-start gap-3">
                            <Avatar className={`w-8 h-8 ${answer.is_ai_answer ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-secondary'}`}>
                              <AvatarFallback className="text-white">
                                {answer.is_ai_answer ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="text-sm font-semibold">
                                  {answer.is_ai_answer ? 'AI Expert' : 'Community Member'}
                                </p>
                                {answer.is_ai_answer && (
                                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    AI Powered
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{answer.content}</p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {new Date(answer.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pl-4 border-l-2 border-primary/20">
                      <Button
                        onClick={() => generateAIAnswer(post)}
                        disabled={generatingAI === post.id}
                        variant="outline"
                        className="gap-2"
                      >
                        {generatingAI === post.id ? (
                          <>
                            <Bot className="w-4 h-4 animate-pulse" />
                            AI is thinking...
                          </>
                        ) : (
                          <>
                            <Bot className="w-4 h-4" />
                            Get AI Expert Answer
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Community;
