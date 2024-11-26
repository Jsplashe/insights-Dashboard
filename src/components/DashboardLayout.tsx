import React, { useState, useCallback, useMemo } from 'react';
import FileUpload from './FileUpload';
import AnalysisSummary from './AnalysisSummary';
import DocumentList from './DocumentList';
import DocumentDetails from './DocumentDetails';
import { analyzeDocument } from '../utils/textAnalysis';
import type { AnalysisResult, AnalysisStats } from '../types';

const DashboardLayout: React.FC = () => {
  const [documents, setDocuments] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<AnalysisResult | null>(null);

  const handleFileSelect = useCallback(async (files: FileList) => {
    setIsAnalyzing(true);
    
    try {
      const newDocuments = await Promise.all(
        Array.from(files).map(async (file) => {
          return await analyzeDocument(file);
        })
      );

      setDocuments(prev => [...prev, ...newDocuments]);
    } catch (error) {
      console.error('Error analyzing documents:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleViewDetails = useCallback((id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (document) {
      setSelectedDocument(document);
    }
  }, [documents]);

  const stats: AnalysisStats = useMemo(() => {
    const totalDocuments = documents.length;
    const issueTypes = {
      fallacies: 0,
      biases: 0,
      heuristics: 0
    };
    
    let mostCommonIssue: { type: string; count: number } | null = null;
    const issueCounts = new Map<string, number>();

    documents.forEach(doc => {
      doc.issues.forEach(issue => {
        const type = issue.type.toLowerCase();
        if (type.includes('fallac')) issueTypes.fallacies += issue.count;
        else if (type.includes('bias')) issueTypes.biases += issue.count;
        else if (type.includes('heuristic')) issueTypes.heuristics += issue.count;

        const currentCount = (issueCounts.get(issue.type) || 0) + issue.count;
        issueCounts.set(issue.type, currentCount);

        if (!mostCommonIssue || currentCount > mostCommonIssue.count) {
          mostCommonIssue = { type: issue.type, count: currentCount };
        }
      });
    });

    const totalIssues = issueTypes.fallacies + issueTypes.biases + issueTypes.heuristics;

    return {
      totalDocuments,
      issueTypes,
      totalIssues,
      mostCommonIssue
    };
  }, [documents]);

  return (
    <div className="min-h-screen bg-dark-400">
      <header className="bg-dark-300 border-b border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Insights Workspace</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FileUpload
              onFileSelect={handleFileSelect}
              isAnalyzing={isAnalyzing}
            />
          </div>
          <div className="space-y-6">
            <AnalysisSummary stats={stats} />
          </div>
        </div>

        <DocumentList
          documents={documents}
          onViewDetails={handleViewDetails}
        />
      </main>

      {selectedDocument && (
        <DocumentDetails
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;