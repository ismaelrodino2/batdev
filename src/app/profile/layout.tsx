export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="pl-4 flex py-6 min-h-[calc(100vh-112px)]">{children}</div>
    </section>
  );
}
