import { ReactNode } from 'react';

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    //<div className="flex flex-col pt-2 px-4 space-y-2 bg-zinc-100 flex-grow pb-4">
    <div className="flex flex-col bg-zinc-100 flex-grow">
      {children}
    </div>
  );
}