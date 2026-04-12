export type AiAgentType = 'FEEDBACK' | 'RECOMMENDATION';

export interface AiResultResponse {
  id: number;
  postId: number;
  agentType: AiAgentType;
  content: string;
  contentHash: string;
  provider: string;
  createdAt: string;
}

export interface PostRecommendationResponse {
  id: number;
  postId: number;
  recommendedPostId: number;
  recommendedPostTitle: string;
  reason: string;
  displayOrder: number;
}
