export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  thumbnail?: string;
  isPublished: boolean;
  publishedAt: string | null;
}
