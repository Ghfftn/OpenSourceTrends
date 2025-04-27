
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  RedditIcon,
} from 'react-share';
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, Send } from 'lucide-react';

export function ProjectDialog({ project, isOpen, onClose }) {
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (isOpen && project) {
      fetchReadme();
      loadComments();
    }
  }, [isOpen, project]);

  const fetchReadme = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.github.com/repos/${project.full_name}/readme`);
      const data = await response.json();
      if (!data.content) {
        throw new Error('No README content found');
      }
      
      // Properly decode base64 content and handle UTF-8
      const decodedContent = decodeBase64ToString(data.content);
      setReadme(sanitizeMarkdown(decodedContent));
    } catch (error) {
      console.error('Error fetching README:', error);
      setReadme('# README not available\n\nThis project does not have a README.md file or it could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const decodeBase64ToString = (base64) => {
    try {
      // Handle padded and unpadded base64
      const paddedBase64 = base64.replace(/\s/g, '').replace(/=+$/, '');
      const binaryString = window.atob(paddedBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new TextDecoder('utf-8').decode(bytes);
    } catch (error) {
      console.error('Base64 decoding error:', error);
      return 'Error decoding README content';
    }
  };

  const sanitizeMarkdown = (markdown) => {
    return markdown
      .replace(/<details>/g, '')
      .replace(/<\/details>/g, '')
      .replace(/<summary>/g, '**')
      .replace(/<\/summary>/g, '**\n\n')
      .replace(/<br>/g, '\n')
      .replace(/<\/?b>/g, '**')
      .replace(/<img([^>]*)>/g, (match, attributes) => {
        const src = attributes.match(/src="([^"]*)"/) || attributes.match(/src='([^']*)'/) || [];
        const alt = attributes.match(/alt="([^"]*)"/) || attributes.match(/alt='([^']*)'/) || [];
        return `![${alt[1] || ''}](${src[1] || ''})`;
      });
  };

  const loadComments = () => {
    const savedComments = localStorage.getItem(`comments-${project.id}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      setComments([]);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      text: newComment,
      timestamp: new Date().toISOString(),
      author: 'Anonymous User',
    };
    
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`comments-${project.id}`, JSON.stringify(updatedComments));
    setNewComment('');
  };

  const shareUrl = project?.html_url || window.location.href;
  const shareTitle = `Check out ${project?.name} on GitHub`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center justify-between">
              {project?.name}
              <div className="flex space-x-2">
                <FacebookShareButton url={shareUrl} quote={shareTitle}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl} title={shareTitle}>
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
                <RedditShareButton url={shareUrl} title={shareTitle}>
                  <RedditIcon size={32} round />
                </RedditShareButton>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-32">
          <div className="my-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    img({node, ...props}) {
                      return (
                        <img
                          {...props}
                          className="max-w-full h-auto rounded-lg shadow-lg"
                          loading="lazy"
                        />
                      );
                    }
                  }}
                >
                  {readme}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments
            </h3>
            
            <div className="max-h-32 overflow-y-auto space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-blue-400">{comment.author}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-200">{comment.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleAddComment}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
