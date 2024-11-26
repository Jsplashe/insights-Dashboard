import React from 'react';
import { FileText, AlertTriangle, Brain, Lightbulb } from 'lucide-react';
import type { AnalysisStats } from '../types';

interface AnalysisSummaryProps {
  stats: AnalysisStats;
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ stats }) => {
  return (
    <div className="bg-dark-300 rounded-xl overflow-hidden border border-dark-100">
      {/* Header Summary */}
      <div className="p-6 bg-gradient-to-br from-dark-200 to-dark-300">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-6 w-6 text-accent-400" />
          <h3 className="text-lg font-medium text-white">Analysis Summary</h3>
        </div>
        <div className="space-y-2">
          <p className="text-gray-300">
            <span className="font-semibold text-white">{stats.totalDocuments}</span>{' '}
            {stats.totalDocuments === 1 ? 'document' : 'documents'} analyzed
          </p>
          {stats.totalIssues > 0 && (
            <p className="text-gray-300">
              Total issues detected:{' '}
              <span className="font-semibold text-white">{stats.totalIssues}</span>
              <span className="text-gray-400 text-sm">
                {' '}({stats.issueTypes.biases} biases, {stats.issueTypes.fallacies} fallacies,{' '}
                {stats.issueTypes.heuristics} heuristics)
              </span>
            </p>
          )}
          {stats.mostCommonIssue && (
            <p className="text-gray-300">
              Most common issue:{' '}
              <span className="font-semibold text-white">
                {stats.mostCommonIssue.type}
              </span>
              <span className="text-gray-400 text-sm">
                {' '}({stats.mostCommonIssue.count} occurrences)
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="px-6 py-4 grid grid-cols-3 gap-4 border-t border-dark-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Brain className="h-5 w-5 text-accent-400" />
          </div>
          <div className="text-2xl font-semibold text-white">
            {stats.issueTypes.biases}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Biases</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="h-5 w-5 text-accent-400" />
          </div>
          <div className="text-2xl font-semibold text-white">
            {stats.issueTypes.fallacies}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Fallacies</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Lightbulb className="h-5 w-5 text-accent-400" />
          </div>
          <div className="text-2xl font-semibold text-white">
            {stats.issueTypes.heuristics}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Heuristics</div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisSummary;