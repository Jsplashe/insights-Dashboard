import React from 'react';
import { X, AlertCircle, FileText, TrendingUp, Brain, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface DocumentDetailsProps {
  document: AnalysisResult;
  onClose: () => void;
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({ document, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-300 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-dark-100">
        <div className="p-6 border-b border-dark-100 flex items-center justify-between bg-gradient-to-r from-dark-200 to-dark-300">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-accent-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">{document.name}</h2>
              <p className="text-sm text-gray-400 mt-1">
                Detailed Analysis Report
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="space-y-8">
            {/* Summary Section */}
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-100">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-accent-400" />
                Analysis Overview
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-dark-300 rounded-lg border border-dark-100">
                  <Brain className="h-6 w-6 mx-auto text-accent-400 mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {document.issues.filter(i => i.type.toLowerCase().includes('bias')).length}
                  </div>
                  <div className="text-sm text-gray-400">Cognitive Biases</div>
                </div>
                <div className="text-center p-4 bg-dark-300 rounded-lg border border-dark-100">
                  <AlertTriangle className="h-6 w-6 mx-auto text-accent-400 mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {document.issues.filter(i => i.type.toLowerCase().includes('fallac')).length}
                  </div>
                  <div className="text-sm text-gray-400">Logical Fallacies</div>
                </div>
                <div className="text-center p-4 bg-dark-300 rounded-lg border border-dark-100">
                  <AlertCircle className="h-6 w-6 mx-auto text-accent-400 mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {document.issues.filter(i => i.type.toLowerCase().includes('heuristic')).length}
                  </div>
                  <div className="text-sm text-gray-400">Mental Heuristics</div>
                </div>
              </div>
            </div>

            {/* Detailed Issues */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Detailed Analysis</h3>
              <div className="space-y-6">
                {document.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="bg-dark-300 border border-dark-100 rounded-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-accent-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-white">
                            {issue.type}
                          </h4>
                          <p className="mt-2 text-gray-300">
                            {getIssueDescription(issue.type)}
                          </p>
                          <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent-400/10 text-accent-300">
                            {issue.count} {issue.count === 1 ? 'instance' : 'instances'} detected
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Investment Impact */}
                        <div className="bg-dark-200 rounded-lg p-4 border border-dark-100">
                          <h5 className="text-sm font-medium text-white mb-2 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-accent-400" />
                            Investment Impact
                          </h5>
                          <p className="text-sm text-gray-300">
                            {getFinancialImplication(issue.type)}
                          </p>
                        </div>

                        {/* Mitigation Strategy */}
                        <div className="bg-dark-200 rounded-lg p-4 border border-dark-100">
                          <h5 className="text-sm font-medium text-white mb-2 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-accent-400" />
                            Mitigation Strategy
                          </h5>
                          <p className="text-sm text-gray-300">
                            {getMitigationStrategy(issue.type)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Steps */}
                    <div className="border-t border-dark-100 bg-dark-200 px-6 py-4">
                      <h5 className="text-sm font-medium text-white mb-3">
                        Recommended Actions
                      </h5>
                      <ul className="space-y-2">
                        {getActionSteps(issue.type).map((step, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-300">
                            <ArrowRight className="h-4 w-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Overall Recommendations */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Strategic Recommendations</h3>
              <div className="bg-gradient-to-br from-dark-200 to-dark-300 rounded-lg p-6 border border-dark-100">
                <ul className="space-y-4">
                  {getRecommendations(document.issues).map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-accent-600 text-white text-sm mt-0.5 mr-3">
                        {index + 1}
                      </div>
                      <p className="text-gray-300">{rec}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getIssueDescription(type: string): string {
  const descriptions: Record<string, string> = {
    'Confirmation Bias': 'The tendency to search for, interpret, and recall information in a way that confirms one\'s preexisting beliefs or investment theses.',
    'Anchoring Bias': 'The tendency to rely too heavily on the first piece of information encountered (such as a stock\'s purchase price) when making investment decisions.',
    'Ad Hominem Fallacy': 'Dismissing market analysis or investment advice based on personal characteristics of the source rather than the merits of the argument.',
    'False Dichotomy': 'Oversimplifying market conditions into an "either/or" scenario when multiple outcomes or strategies might be viable.',
    'Availability Heuristic': 'Making investment decisions based on easily recalled events or recent market movements rather than comprehensive analysis.',
    'Representativeness': 'Assuming that similar market conditions or company characteristics will lead to similar outcomes.',
  };
  
  return descriptions[type] || 'A cognitive pattern that may affect investment decision-making and risk assessment.';
}

function getFinancialImplication(type: string): string {
  const implications: Record<string, string> = {
    'Confirmation Bias': 'May lead to overlooking critical market signals that contradict your investment thesis, potentially missing important sell indicators or risk factors.',
    'Anchoring Bias': 'Could result in missed opportunities by fixating on historical price points or valuations, preventing timely portfolio adjustments.',
    'Ad Hominem Fallacy': 'Might cause dismissal of valuable market insights based on personal biases against analysts or sources, limiting your information advantage.',
    'False Dichotomy': 'Can lead to missed investment opportunities by oversimplifying market conditions and failing to consider multiple scenarios.',
    'Availability Heuristic': 'May result in overreaction to recent market events while ignoring long-term trends and fundamentals.',
    'Representativeness': 'Could lead to pattern-based trading without sufficient statistical evidence, potentially increasing portfolio risk.',
  };
  
  return implications[type] || 'May significantly impact investment decision-making and risk assessment processes.';
}

function getMitigationStrategy(type: string): string {
  const strategies: Record<string, string> = {
    'Confirmation Bias': 'Actively seek out and document contradictory evidence to your investment thesis. Establish pre-defined exit criteria.',
    'Anchoring Bias': 'Use multiple valuation methods and regularly reassess positions based on current market conditions, not historical reference points.',
    'Ad Hominem Fallacy': 'Implement a systematic approach to evaluate arguments based on data and logic, regardless of the source.',
    'False Dichotomy': 'Develop scenario analysis incorporating multiple possible outcomes and their probabilities.',
    'Availability Heuristic': 'Create a structured analysis framework that considers both historical data and current market conditions.',
    'Representativeness': 'Use quantitative analysis to verify perceived patterns and maintain a diversified portfolio.',
  };

  return strategies[type] || 'Implement systematic decision-making processes and regular review mechanisms.';
}

function getActionSteps(type: string): string[] {
  const steps: Record<string, string[]> = {
    'Confirmation Bias': [
      'Document both supporting and contradicting evidence for each investment thesis',
      'Set up automated alerts for contrary indicators',
      'Regular peer review of investment decisions',
    ],
    'Anchoring Bias': [
      'Establish multiple price targets using different valuation methods',
      'Regular portfolio rebalancing based on current market conditions',
      'Document reasoning for each position adjustment',
    ],
    'Ad Hominem Fallacy': [
      'Create a structured evaluation framework for all investment research',
      'Blind review of investment recommendations when possible',
      'Focus on data-driven decision making',
    ],
    'False Dichotomy': [
      'Map out at least three possible scenarios for each major market event',
      'Develop contingency plans for multiple outcomes',
      'Use probability-weighted analysis for decision making',
    ],
    'Availability Heuristic': [
      'Maintain a comprehensive market event database',
      'Use systematic risk assessment tools',
      'Regular review of historical market cycles',
    ],
    'Representativeness': [
      'Conduct statistical analysis of perceived patterns',
      'Implement position sizing based on quantitative criteria',
      'Regular review of correlation assumptions',
    ],
  };

  return steps[type] || [
    'Document decision-making process',
    'Implement regular review mechanisms',
    'Seek external validation when appropriate',
  ];
}

function getRecommendations(issues: Array<{ type: string; count: number }>): string[] {
  const recommendations = new Set<string>();
  
  issues.forEach(issue => {
    switch (true) {
      case /bias/i.test(issue.type):
        recommendations.add('Implement a structured decision-making framework with pre-defined criteria for investment decisions.');
        recommendations.add('Establish regular portfolio review sessions with documented contrary viewpoints.');
        recommendations.add('Create a systematic approach to challenge existing investment theses.');
        break;
      case /fallacy/i.test(issue.type):
        recommendations.add('Develop quantitative metrics for evaluating investment opportunities.');
        recommendations.add('Implement a peer review process for major investment decisions.');
        recommendations.add('Create standardized documentation for investment rationale and risk assessment.');
        break;
      case /heuristic/i.test(issue.type):
        recommendations.add('Build a comprehensive market analysis framework incorporating multiple data sources.');
        recommendations.add('Establish regular review cycles for investment assumptions and mental models.');
        recommendations.add('Implement systematic risk management protocols with clear triggers.');
        break;
    }
  });
  
  return Array.from(recommendations);
}

export default DocumentDetails;