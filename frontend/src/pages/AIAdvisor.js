import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AIAdvisor = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/ai/advice`,
        { 
          query: userMessage,
          conversation_id: conversationId 
        },
        { withCredentials: true }
      );
      
      // Store conversation ID for memory
      if (response.data.conversation_id) {
        setConversationId(response.data.conversation_id);
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.advice 
      }]);
    } catch (error) {
      toast.error('Failed to get AI advice');
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    toast.success('New conversation started');
  };

  const suggestedQuestions = [
    'What government schemes are available for farmers in India?',
    'ভারতে কৃষকদের জন্য কী কী সরকারি প্রকল্প আছে?',
    'How do I apply for a Kisan Credit Card?',
    'আমি কিভাবে মুদ্রা ঋণের জন্য আবেদন করব?'
  ];

  return (
    <Layout>
      <div className="p-6 lg:p-8 h-[calc(100vh-80px)]" data-testid="ai-advisor">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
              AI Financial Advisor
            </h1>
            <p className="text-slate-600">Get personalized advice powered by GPT-5.1 with conversation memory</p>
          </div>
          {messages.length > 0 && (
            <Button 
              onClick={handleNewConversation}
              data-testid="new-conversation-button"
              variant="outline"
              className="border-2 border-violet-300 text-violet-600 hover:bg-violet-50 px-4 py-2 rounded-xl font-semibold flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Chat</span>
            </Button>
          )}
        </div>

        <Card className="h-[calc(100vh-250px)] rounded-2xl border-2 border-slate-100 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">How can I help you today?</h3>
                <p className="text-slate-600 text-center mb-4 max-w-md">
                  Ask me anything about Indian finance, government schemes, property, or rural banking.
                </p>
                <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full mb-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">AI remembers your conversation for personalized advice</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      data-testid={`suggested-question-${index}`}
                      variant="outline"
                      className="text-left h-auto p-4 border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-sm"
                      onClick={() => {
                        setInput(question);
                        setTimeout(() => {
                          document.getElementById('ai-input').focus();
                        }, 0);
                      }}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                      data-testid={message.role === 'user' ? 'user-message' : 'ai-message'}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 rounded-2xl px-5 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <Input
                id="ai-input"
                data-testid="ai-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your finances..."
                className="flex-1 py-6 px-4 rounded-xl border-2 border-slate-200 focus:border-violet-300"
                disabled={loading}
              />
              <Button
                type="submit"
                data-testid="send-message-button"
                disabled={loading || !input.trim()}
                className="bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-6 rounded-xl font-semibold"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AIAdvisor;
