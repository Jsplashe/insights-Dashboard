export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  pageRange: [number, number];
  enabled: boolean;
}

export interface AnalysisIssue {
  type: string;
  count: number;
  sections: Array<{
    sectionId: string;
    context: string;
    pageNumber: number;
  }>;
}

export interface AnalysisResult {
  id: string;
  name: string;
  sections: DocumentSection[];
  issues: AnalysisIssue[];
  status: 'analyzing' | 'completed' | 'error';
}

export interface AnalysisStats {
  totalDocuments: number;
  issueTypes: {
    fallacies: number;
    biases: number;
    heuristics: number;
  };
  totalIssues: number;
  mostCommonIssue: {
    type: string;
    count: number;
  } | null;
}