import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Check, Edit2, X, Save } from 'lucide-react';

export interface MessageAnalysis {
  intents: string[];
  journal?: {
    title: string;
    body: string;
    tags: string[];
  };
  checkin?: {
    energy: number;
    rest: number;
    focus: number;
    connection: number;
    note: string;
    balanceScore: number;
  };
  gratitude?: {
    text: string;
    category: string;
  };
  practice?: {
    text: string;
    durationMin: number;
  };
  reflection: string;
  nudge?: {
    reason: string;
    suggestion: string;
  };
}

interface ResultCardsProps {
  analysis: MessageAnalysis;
  onAccept: (acceptedData: Partial<MessageAnalysis>) => void;
  onSkip: () => void;
}

const ResultCards: React.FC<ResultCardsProps> = ({ analysis, onAccept, onSkip }) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<MessageAnalysis>(analysis);

  const handleEdit = (section: string) => {
    setEditing(section);
  };

  const handleSave = (section: string) => {
    setEditing(null);
    // Data is already updated in editedData state
  };

  const handleAccept = () => {
    onAccept(editedData);
  };

  const updateEditedData = (section: string, updates: any) => {
    setEditedData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof MessageAnalysis], ...updates }
    }));
  };

  const getBalanceScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBalanceScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">{analysis.reflection}</p>
      </div>

      {/* Journal Card */}
      {analysis.journal && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                📝 Journal Entry
                <Badge variant="secondary">Journal</Badge>
              </CardTitle>
              {editing !== 'journal' && (
                <Button variant="ghost" size="sm" onClick={() => handleEdit('journal')}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {editing === 'journal' ? (
              <div className="space-y-3">
                <Input
                  value={editedData.journal?.title || ''}
                  onChange={(e) => updateEditedData('journal', { title: e.target.value })}
                  placeholder="Entry title"
                />
                <Textarea
                  value={editedData.journal?.body || ''}
                  onChange={(e) => updateEditedData('journal', { body: e.target.value })}
                  placeholder="What's on your mind?"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave('journal')}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="font-medium text-sm mb-2">{analysis.journal.title}</h4>
                <p className="text-sm text-gray-600">{analysis.journal.body}</p>
                {analysis.journal.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {analysis.journal.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Check-in Card */}
      {analysis.checkin && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                ⚖️ Daily Check-in
                <Badge variant="secondary">Balance</Badge>
              </CardTitle>
              {editing !== 'checkin' && (
                <Button variant="ghost" size="sm" onClick={() => handleEdit('checkin')}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {editing === 'checkin' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Energy</label>
                    <Slider
                      value={[editedData.checkin?.energy || 5]}
                      onValueChange={(value) => updateEditedData('checkin', { energy: value[0] })}
                      max={10}
                      step={1}
                      className="mt-1"
                    />
                    <span className="text-xs text-gray-500">{editedData.checkin?.energy || 5}/10</span>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Rest</label>
                    <Slider
                      value={[editedData.checkin?.rest || 5]}
                      onValueChange={(value) => updateEditedData('checkin', { rest: value[0] })}
                      max={10}
                      step={1}
                      className="mt-1"
                    />
                    <span className="text-xs text-gray-500">{editedData.checkin?.rest || 5}/10</span>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Focus</label>
                    <Slider
                      value={[editedData.checkin?.focus || 5]}
                      onValueChange={(value) => updateEditedData('checkin', { focus: value[0] })}
                      max={10}
                      step={1}
                      className="mt-1"
                    />
                    <span className="text-xs text-gray-500">{editedData.checkin?.focus || 5}/10</span>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Connection</label>
                    <Slider
                      value={[editedData.checkin?.connection || 5]}
                      onValueChange={(value) => updateEditedData('checkin', { connection: value[0] })}
                      max={10}
                      step={1}
                      className="mt-1"
                    />
                    <span className="text-xs text-gray-500">{editedData.checkin?.connection || 5}/10</span>
                  </div>
                </div>
                <Textarea
                  value={editedData.checkin?.note || ''}
                  onChange={(e) => updateEditedData('checkin', { note: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave('checkin')}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{analysis.checkin.energy}</div>
                    <div className="text-xs text-gray-500">Energy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{analysis.checkin.rest}</div>
                    <div className="text-xs text-gray-500">Rest</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{analysis.checkin.focus}</div>
                    <div className="text-xs text-gray-500">Focus</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{analysis.checkin.connection}</div>
                    <div className="text-xs text-gray-500">Connection</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getBalanceScoreColor(analysis.checkin.balanceScore)}`}>
                    {analysis.checkin.balanceScore}/10
                  </div>
                  <div className="text-sm text-gray-600">{getBalanceScoreLabel(analysis.checkin.balanceScore)}</div>
                </div>
                {analysis.checkin.note && (
                  <p className="text-sm text-gray-600 mt-2">{analysis.checkin.note}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Gratitude Card */}
      {analysis.gratitude && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                🙏 Gratitude
                <Badge variant="secondary">{analysis.gratitude.category}</Badge>
              </CardTitle>
              {editing !== 'gratitude' && (
                <Button variant="ghost" size="sm" onClick={() => handleEdit('gratitude')}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editing === 'gratitude' ? (
              <div className="space-y-3">
                <Textarea
                  value={editedData.gratitude?.text || ''}
                  onChange={(e) => updateEditedData('gratitude', { text: e.target.value })}
                  placeholder="What are you grateful for?"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave('gratitude')}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm">{analysis.gratitude.text}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Practice Card */}
      {analysis.practice && (
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                🧘 Practice
                <Badge variant="secondary">{analysis.practice.durationMin}min</Badge>
              </CardTitle>
              {editing !== 'practice' && (
                <Button variant="ghost" size="sm" onClick={() => handleEdit('practice')}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editing === 'practice' ? (
              <div className="space-y-3">
                <Textarea
                  value={editedData.practice?.text || ''}
                  onChange={(e) => updateEditedData('practice', { text: e.target.value })}
                  placeholder="Practice suggestion..."
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave('practice')}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm">{analysis.practice.text}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button onClick={handleAccept} className="flex-1">
          <Check className="h-4 w-4 mr-2" />
          Accept All
        </Button>
        <Button variant="outline" onClick={onSkip}>
          <X className="h-4 w-4 mr-2" />
          Skip
        </Button>
      </div>
    </div>
  );
};

export default ResultCards;
