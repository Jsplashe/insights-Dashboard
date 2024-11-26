import React, { useState, useMemo } from 'react';
import { FileText, AlertCircle, ChevronRight, Clock, Search, SortAsc, Filter } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface DocumentListProps {
  documents: AnalysisResult[];
  onViewDetails: (id: string) => void;
}

type SortField = 'name' | 'issues' | 'date';
type FilterType = 'all' | 'bias' | 'fallacy' | 'heuristic';

const DocumentList: React.FC<DocumentListProps> = ({ documents, onViewDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');

  const filteredAndSortedDocs = useMemo(() => {
    return documents
      .filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' || doc.issues.some(issue => {
          const type = issue.type.toLowerCase();
          switch (filterType) {
            case 'bias': return type.includes('bias');
            case 'fallacy': return type.includes('fallac');
            case 'heuristic': return type.includes('heuristic');
            default: return true;
          }
        });
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortField) {
          case 'name':
            return sortAsc 
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          case 'issues':
            const aCount = a.issues.reduce((sum, i) => sum + i.count, 0);
            const bCount = b.issues.reduce((sum, i) => sum + i.count, 0);
            return sortAsc ? aCount - bCount : bCount - aCount;
          default:
            return sortAsc ? -1 : 1;
        }
      });
  }, [documents, searchQuery, sortField, sortAsc, filterType]);

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl font-semibold text-gray-900">Resource Insights</h2>
        
        {documents.length > 0 && (
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="appearance-none pl-10 pr-8 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="bias">Biases</option>
                <option value="fallacy">Fallacies</option>
                <option value="heuristic">Heuristics</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="appearance-none pl-10 pr-8 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Date Added</option>
                <option value="name">Name</option>
                <option value="issues">Issue Count</option>
              </select>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                aria-label={sortAsc ? "Sort descending" : "Sort ascending"}
              >
                <SortAsc className={`h-4 w-4 text-gray-500 transform transition-transform ${
                  !sortAsc ? 'rotate-180' : ''
                }`} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {filteredAndSortedDocs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">
              {documents.length === 0
                ? "No resources analyzed yet"
                : "No matching resources found"}
            </p>
            <p className="mt-1">
              {documents.length === 0
                ? "Upload documents to get started with the analysis"
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        ) : (
          filteredAndSortedDocs.map((doc) => (
            <div 
              key={doc.id} 
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-gray-400 flex-shrink-0" />
                    <h3 className="ml-3 text-lg font-medium text-gray-900">{doc.name}</h3>
                    {doc.status === 'analyzing' && (
                      <div className="ml-3 flex items-center text-blue-600">
                        <Clock className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm">Analyzing...</span>
                      </div>
                    )}
                    {doc.status === 'error' && (
                      <span className="ml-3 text-sm text-red-600 bg-red-50 px-2 py-1 rounded-full">
                        Analysis failed
                      </span>
                    )}
                  </div>
                  
                  {doc.status === 'completed' && (
                    <>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {doc.issues.slice(0, 3).map((issue, index) => (
                          <div 
                            key={index}
                            className="flex items-start space-x-3 bg-gray-50 rounded-lg p-3"
                          >
                            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {issue.type}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {getIssueContext(issue.type)}
                              </p>
                              <p className="text-xs text-amber-600 mt-1">
                                {issue.count} {issue.count === 1 ? 'instance' : 'instances'} detected
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => onViewDetails(doc.id)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          View Full Insights
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function getIssueContext(type: string): string {
  const contexts: Record<string, string> = {
    'Confirmation Bias': 'May affect investment decisions by favoring confirming evidence',
    'Anchoring Bias': 'Could lead to price anchoring in market analysis',
    'Ad Hominem Fallacy': 'May impact credibility assessment of market analysts',
    'False Dichotomy': 'Could oversimplify complex market scenarios',
    'Availability Heuristic': 'Might overweight recent market events',
    'Representativeness': 'Could lead to pattern-seeking in random market movements',
  };
  
  return contexts[type] || 'May impact financial analysis and decision-making';
}

export default DocumentList;