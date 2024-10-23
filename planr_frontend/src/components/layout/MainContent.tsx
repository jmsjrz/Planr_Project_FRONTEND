// src/components/layout/MainContent.tsx

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>;
}
