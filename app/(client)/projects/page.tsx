import { getProjects } from "@/lib/api/projects.api";
import { projectsMock } from "@/mocks/projects.mock";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { Container } from "@/components/layout/Container";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export default async function ProjectsPage() {
  const projects = USE_MOCK ? projectsMock : (await getProjects({ limit: 50 })).data;

  return (
    <>
      <PageHeader eyebrow="Dự án" title="Những công trình đã đồng hành cùng SolarDV." description="Từ hộ gia đình đến nhà xưởng quy mô lớn — mỗi dự án là một câu chuyện về tiết kiệm điện năng." />
      <section className="bg-paper py-24">
        <Container>{projects.length === 0 ? <p className="py-20 text-center text-navy/40">Chưa có dự án nào.</p> : <ProjectGallery projects={projects} />}</Container>
      </section>
    </>
  );
}
