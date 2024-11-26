import { v4 as uuidv4 } from 'uuid';
import type { AnalysisResult, DocumentSection } from '../types';

// Simulated document splitting function
async function splitDocument(file: File): Promise<DocumentSection[]> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock sections (in a real implementation, this would analyze the actual file)
  const numSections = Math.floor(Math.random() * 3) + 2;
  
  return Array.from({ length: numSections }, (_, i) => ({
    id: uuidv4(),
    title: `Section ${i + 1}`,
    content: `Sample content for section ${i + 1}...`,
    pageRange: [i * 5 + 1, (i + 1) * 5],
    enabled: true
  }));
}

// Simulated text analysis
export async function analyzeDocument(file: File): Promise<AnalysisResult> {
  const sections = await splitDocument(file);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  const issueTypes = [
    "Confirmation Bias",
    "Anchoring Bias",
    "Ad Hominem Fallacy",
    "False Dichotomy",
    "Availability Heuristic",
    "Representativeness"
  ];

  const issues = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
    const type = issueTypes[Math.floor(Math.random() * issueTypes.length)];
    const count = Math.floor(Math.random() * 5) + 1;
    
    // Generate section-specific contexts
    const sectionContexts = sections
      .filter(() => Math.random() > 0.5)
      .map(section => ({
        sectionId: section.id,
        context: `Example context for ${type} in section "${section.title}"`,
        pageNumber: Math.floor(Math.random() * (section.pageRange[1] - section.pageRange[0] + 1)) + section.pageRange[0]
      }));

    return {
      type,
      count,
      sections: sectionContexts
    };
  });

  return {
    id: uuidv4(),
    name: file.name,
    sections,
    issues,
    status: 'completed'
  };
}