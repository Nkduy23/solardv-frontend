import { projectsMock } from "@/mocks/projects.mock";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { Container } from "@/components/layout/Container";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader eyebrow="Dự án" title="Những công trình đã đồng hành cùng SolarDV." description="Từ hộ gia đình đến nhà xưởng quy mô lớn — mỗi dự án là một câu chuyện về tiết kiệm điện năng." />

      <section className="bg-paper py-24">
        <Container>
          <ProjectGallery projects={projectsMock} />
        </Container>
      </section>
    </>
  );
}
