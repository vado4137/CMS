import { CMSBlock } from "@/types/cms";
import { HeroBlock } from "./blocks/Hero";
import { StatsBlock } from "./blocks/Stats";

// Mapping-Objekt: Typ -> Komponente
const BLOCK_COMPONENTS: Record<string, React.FC<{ data: any }>> = {
  HERO: HeroBlock,
  STATS: StatsBlock,
  // NEWS: NewsBlock, etc.
};

export function BlockRenderer({ blocks }: { blocks: CMSBlock[] }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="p-20 text-center border-2 border-dashed rounded-xl">
        <p className="text-muted-foreground">Diese Seite hat noch keinen Inhalt.</p>
      </div>
    );
  }

  return (
    <>
      {blocks.map((block) => {
        const Component = BLOCK_COMPONENTS[block.type];
        
        if (!Component) {
          console.warn(`Block-Typ "${block.type}" wurde nicht gefunden.`);
          return null;
        }

        return <Component key={block.id} data={block.content} />;
      })}
    </>
  );
}