export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  isPublished: boolean;
  publishedAt: string | null;
}
