import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your anime assistant. I can help you discover new anime based on your preferences. Try asking me something like 'recommend a fantasy anime' or 'what's similar to Attack on Titan?'",
      isBot: true,
      timestamp: new Date()
    }
  ]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");

    // Simulate AI response - this will be connected to actual AI API
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(message),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('fantasy')) {
      return "For fantasy anime, I recommend:\n\n• **Stellar Knights** - Epic mecha fantasy with stunning visuals\n• **Mystic Academy** - Magical school setting with great character development\n• **Shadow Realm** - Dark fantasy with mystery elements\n\nWould you like more details about any of these?";
    }
    
    if (lowerMessage.includes('action')) {
      return "Great action anime recommendations:\n\n• **Stellar Knights** - Intense mecha battles in space\n• **Shadow Realm** - Dark action with supernatural elements\n\nBoth are currently trending on AniVerse!";
    }
    
    if (lowerMessage.includes('attack on titan') || lowerMessage.includes('similar')) {
      return "If you enjoyed Attack on Titan, you might love:\n\n• **Stellar Knights** - Similar themes of humanity vs overwhelming threats\n• **Shadow Realm** - Dark atmosphere and complex storytelling\n\nBoth feature intense action and deep narratives!";
    }
    
    return "I'd be happy to help you find anime! You can ask me about:\n\n• Specific genres (action, romance, comedy, etc.)\n• Anime similar to ones you've watched\n• Popular or trending series\n• Recommendations based on your mood\n\nWhat type of anime are you in the mood for?";
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-primary hover:opacity-90 shadow-glow z-50 transition-all duration-300 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>

      {/* Chat Window */}
      <Card className={`fixed bottom-6 right-6 w-96 h-[500px] bg-card border-border shadow-premium z-50 transition-all duration-300 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-semibold">Anime Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-[400px] p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${
                  msg.isBot ? 'justify-start' : 'justify-end'
                }`}
              >
                {msg.isBot && (
                  <div className="w-8 h-8 bg-anime-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    msg.isBot
                      ? 'bg-muted text-foreground'
                      : 'bg-gradient-primary text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
                
                {!msg.isBot && (
                  <div className="w-8 h-8 bg-anime-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <form onSubmit={sendMessage} className="flex items-center space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about anime recommendations..."
                className="flex-1 bg-input border-border focus:ring-anime-primary"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-gradient-primary hover:opacity-90 text-white shadow-glow"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ChatBot;