export default function MypostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" bg-neutral">
      <div className="container mx-auto px-4 py-4">
        <h1>My posts</h1>
        {children}
      </div>
    </div>
  );
}
