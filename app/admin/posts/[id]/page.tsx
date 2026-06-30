interface PageProps {
  params: {
    id: string;
  };
}

export default function PostDetailPage({ params }: PageProps) {
  return <div>Post ID: {params.id}</div>;
}
