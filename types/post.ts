export interface Post {
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  excerpt: string;
  isPublished: boolean;
  publishedAt: string | null;
}
