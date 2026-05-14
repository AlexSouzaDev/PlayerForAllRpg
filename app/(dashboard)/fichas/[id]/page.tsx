import { FichaEditor } from "@/components/ficha/FichaEditor";

interface Props {
  params: { id: string };
}

export default function FichaEditorPage({ params }: Props) {
  return (
    <div className="h-[calc(100vh-57px)] flex flex-col">
      <FichaEditor fichaId={params.id} />
    </div>
  );
}
